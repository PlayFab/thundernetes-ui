import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, Box, Button, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GameServerBuildTable from "./GameServerBuildTable";
import NodeTable from "../Common/NodeTable";
import { GameServer, GameServerBuild } from "../types";
import { fetchWithTimeout } from "../utils";

interface ClusterDetailProps {
  clusters: Record<string, Record<string, string>>
}

function ClusterDetail({ clusters }: ClusterDetailProps) {
  const [gsList, setGsList] = useState<Array<GameServer>>([]);
  const [gsbList, setGsbList] = useState<Array<GameServerBuild>>([]);
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const params = useParams();
  const clusterName = params.clusterName ? params.clusterName : "";
  const clusterApi = clusters[clusterName] ? clusters[clusterName].api : "";

  const getGameServerBuilds = useCallback(() => {
    fetchWithTimeout(clusterApi + "gameserverbuilds", { timeout: 5000 })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        setErrors(prev => new Set(
          prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameserverbuilds")
        ));
        return undefined;
      })
      .then(response => {
        if (response && response.items) {
          setGsbList(response.items);
        }
      })
      .catch(err => {
        setErrors(prev => new Set(
          prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameserverbuilds")
        ));
      });
  }, [clusterName, clusterApi]);

  const getGameServers = useCallback(() => {
    fetchWithTimeout(clusterApi + "gameservers", { timeout: 5000 })
      .then(response => {
        if (response.status === 200) {
          return response.json();
        }
        setErrors(prev => new Set(
          prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameservers")
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
          prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameservers")
        ));
      });
  }, [clusterName, clusterApi]);

  const handleCloseAlert = (error: string) => {
    setErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(error);
      return newErrors;
    });
  };

  const groupDataByNode = (gsList: Array<GameServer>) => {
    const emptyValues = () => {
      return { standingBy: 0, active: 0 }
    }
    const nodeData: Record<string, Record<string, number>> = {}
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

  useEffect(() => {
    getGameServers();
    getGameServerBuilds();
    const gsInterval = setInterval(getGameServers, 5000);
    const gsbInterval = setInterval(getGameServerBuilds, 5000);
    return () => {
      clearInterval(gsInterval);
      clearInterval(gsbInterval);
      setGsList([]);
      setGsbList([]);
      setErrors(new Set());
    };
  }, [getGameServers, getGameServerBuilds]);

  const nodeData = groupDataByNode(gsList);
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
      <Typography variant="h4" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        {clusterName}
      </Typography>
      <Grid container spacing={2}>
        <Grid container item xs={6}>
          <Typography variant="h5" gutterBottom component="div">
            Builds
          </Typography>
        </Grid>
        <Grid container item xs={6} justifyContent="flex-end">
          <Link to="gsb/create" style={{ textDecoration: "none" }}>
            <Button variant="contained" color="primary">
              Create
            </Button>
          </Link>
        </Grid>
      </Grid>
      <Box sx={{ marginBottom: "30px" }}>
        <GameServerBuildTable clusterApi={clusterApi} gsbList={gsbList} />
      </Box>
      <Typography variant="h5" gutterBottom component="div">
        Nodes
      </Typography>
      <NodeTable nodeData={nodeData} />
    </React.Fragment>
  );
}

export default ClusterDetail;
