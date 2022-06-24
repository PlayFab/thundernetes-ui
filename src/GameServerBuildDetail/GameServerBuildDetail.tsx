import React from "react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Typography } from "@mui/material";
import AllocateForm from "./AllocateForm";
import GameServerBuildSpec from "./GameServerBuildSpec";
import GameServerBuildStatus from "./GameServerBuildStatus"
import GameServerTable from "./GameServerTable";
import NodeTable from "../Common/NodeTable";
import SpecForm from "./SpecForm";
import { GameServerBuild, GameServer, GameServerDetail } from "../types";
import { fetchWithTimeout } from "../utils";

interface GameServerBuildDetailProps {
  clusters: Record<string, Record<string, string>>
}

function GameServerBuildDetail({ clusters }: GameServerBuildDetailProps) {
  const [gsb, setGsb] = useState<GameServerBuild>();
  const [gsList, setGsList] = useState<Array<GameServer>>([]);
  const [gsdList, setGsdList] = useState<Array<GameServerDetail>>([]);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const params = useParams();
  const clusterName = params.clusterName ? params.clusterName : "";
  const clusterApi = clusters[clusterName].api;
  const allocateApi = clusters[clusterName].allocate;

  const getGameServers = useCallback(() => {
    fetchWithTimeout(clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName + "/gameservers", { timeout: 5000 })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        setErrors(prev => new Set(
          prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName + "/gameservers")
        ));
        return undefined;
      })
      .then(response => {
        if (response && response.items) {
          setGsList(response.items);
        }
      })
      .catch(err => {
        setErrors(prev => new Set(
          prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName + "/gameservers")
        ));
      });
  }, [clusterName, clusterApi, params.namespace, params.buildName]);

  const getGameServerBuild = useCallback(() => {
    fetchWithTimeout(clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName, { timeout: 5000 })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        } else if (response.status === 404) {
          setErrors(prev => new Set(
            prev.add("Couldn't find a Build named '" + params.buildName + "' at: " + clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName)
          ));
          return undefined;
        }
      })
      .then(response => setGsb(response))
      .catch(err => {
        setErrors(prev => new Set(
          prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName)
        ));
      });
  }, [clusterName, clusterApi, params.namespace, params.buildName]);

  const getGameServerDetails = useCallback(() => {
    fetchWithTimeout(clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName + "/gameserverdetails", { timeout: 5000 })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        setErrors(prev => new Set(
          prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName + "/gameserverdetails")
        ));
        return undefined;
      })
      .then(response => {
        if (response && response.items) {
          setGsdList(response.items);
        }
      })
      .catch(err => {
        setErrors(prev => new Set(
          prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName + "/gameserverdetails")
        ));
      });
  }, [clusterName, clusterApi, params.namespace, params.buildName]);

  const groupDataByNode = (gsList: Array<GameServer>) => {
    const emptyValues = () => {
      return { standingBy: 0, active: 0 }
    }
    const nodeData: Record<string, Record<string, number>> = {};
    gsList.forEach((gs) => {
      if (!gs.status.nodeName) {
        return;
      }
      if (!nodeData[gs.status.nodeName]) {
        nodeData[gs.status.nodeName] = emptyValues();
      }
      if (gs.status.state === "StandingBy") {
        nodeData[gs.status.nodeName].standingBy++;
      } else if (gs.status.state === "Active") {
        nodeData[gs.status.nodeName].active++;
      }
    });
    return nodeData;
  };

  const groupDetailsByName = (gsdList: Array<GameServerDetail>) => {
    const gsdByName: Record<string, Record<string, number>> = {};
    gsdList.forEach((gsd) => {
      gsdByName[gsd.metadata.name] = {
        connectedPlayersCount: gsd.spec.connectedPlayersCount
      };
    });
    return gsdByName;
  };

  const handleCloseAlert = useCallback((error: string) => {
    setErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(error);
      return newErrors;
    });
  }, []);

  useEffect(() => {
    getGameServerBuild();
    getGameServers();
    getGameServerDetails();
    const intervalGsb = setInterval(getGameServerBuild, 5000);
    const intervalGs = setInterval(getGameServers, 5000);
    const intervalGsd = setInterval(getGameServerDetails, 5000);
    return () => {
      clearInterval(intervalGsb);
      clearInterval(intervalGs);
      clearInterval(intervalGsd);
      setGsb(undefined);
      setGsList([]);
      setGsdList([]);
      setErrors(new Set());
    };
  }, [getGameServerBuild, getGameServers, getGameServerDetails]);

  const nodeData = groupDataByNode(gsList);
  const gsdByName = groupDetailsByName(gsdList);
  const errorsArray = Array.from(errors).sort();
  const errorMessages = errorsArray.map((error, index) =>
    <Box key={index} display="flex" justifyContent="center">
      <Alert severity="error" onClose={() => { handleCloseAlert(error) }}>
        {error}
      </Alert>
    </Box>
  );

  return (
    <React.Fragment>
      {(errors) &&
        <React.Fragment>
          {errorMessages}
        </React.Fragment>
      }
      {(gsb) &&
        <React.Fragment>
          <Typography variant="h4" gutterBottom component="div" sx={{ marginBottom: "40px" }}>
            {clusterName + ": " + gsb.metadata.namespace + "/" + gsb.metadata.name}
          </Typography>
          <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
            Status
          </Typography>
          <Box sx={{ marginBottom: "40px" }}>
            <GameServerBuildStatus gsb={gsb} />
          </Box>
          <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
            Specs
          </Typography>
          <Box sx={{ marginBottom: "40px" }}>
            <GameServerBuildSpec gsb={gsb} />
          </Box>
          <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
            Patch Specs
          </Typography>
          <Box sx={{ marginBottom: "40px" }}>
            <SpecForm clusterApi={clusterApi} gsb={gsb} />
          </Box>
          <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
            Nodes
          </Typography>
          <Box sx={{ marginBottom: "40px" }}>
            <NodeTable nodeData={nodeData} />
          </Box>
          <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
            Game Servers
          </Typography>
          <Box>
            <AllocateForm allocateApi={allocateApi} buildID={gsb.spec ? gsb.spec.buildID : ""} />
          </Box>
          <Box>
            <GameServerTable clusterApi={clusterApi} gsList={gsList} gsdByName={gsdByName} />
          </Box>
        </React.Fragment>
      }
    </React.Fragment>
  );
}

export default GameServerBuildDetail;
