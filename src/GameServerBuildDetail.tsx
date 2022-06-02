import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AllocateForm from "./AllocateForm";
import GameServerBuildSpec from "./GameServerBuildSpec";
import GameServerBuildStatus from "./GameServerBuildStatus"
import GameServerTable from "./GameServerTable";
import NodeTable from "./NodeTable";
import SpecForm from "./SpecForm";
import { emptyGameServerBuild, GameServerBuild, GameServer, GameServerDetail } from "./types";

interface GameServerBuildDetailProps {
  clusters: Record<string, Record<string, string>>
}

function GameServerBuildDetail({ clusters }: GameServerBuildDetailProps) {
  const [gsb, setGsb] = useState<GameServerBuild>(emptyGameServerBuild);
  const [gsList, setGsList] = useState<Array<GameServer>>([]);
  const [gsdList, setGsdList] = useState<Array<GameServerDetail>>([]);

  const params = useParams();
  const clusterName = params.clusterName ? params.clusterName : "";
  const clusterApi = clusters[clusterName].api;
  const allocateApi = clusters[clusterName].allocate;

  const getGameServers = useCallback(() => {
    fetch(clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName + "/gameservers")
      .then(response => response.json())
      .then(response => setGsList(response.items))
      .catch(err => console.log(err));
  }, [clusterApi, params.namespace, params.buildName]);

  const getGameServerBuild = useCallback(() => {
    fetch(clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName)
      .then(response => response.json())
      .then(response => setGsb(response))
      .catch(err => setGsb(emptyGameServerBuild));
  }, [clusterApi, params.namespace, params.buildName]);

  const getGameServerDetails = useCallback(() => {
    fetch(clusterApi + "gameserverbuilds/" + params.namespace + "/" + params.buildName + "/gameserverdetails")
      .then(response => response.json())
      .then(response => setGsdList(response.items))
      .catch(err => console.log(err));
  }, [clusterApi, params.namespace, params.buildName]);

  const groupDataByNode = (gsList: Array<GameServer>) => {
    const emptyValues = () => {
      return { standingBy: 0, active: 0 }
    }
    const nodeData: Record<string, Record<string, number>> = {}
    gsList.forEach((gs) => {
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
    const gsdByName: Record<string, Record<string, number>> = {}
    gsdList.forEach((gsd) => {
      gsdByName[gsd.metadata.name] = {
        connectedPlayersCount: gsd.spec.connectedPlayersCount
      };
    });
    return gsdByName;
  };

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
    };
  }, [getGameServerBuild, getGameServers, getGameServerDetails]);

  const nodeData = groupDataByNode(gsList);
  const gsdByName = groupDetailsByName(gsdList);
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom component="div" sx={{ marginBottom: "40px" }}>
        {params.namespace + "/" + params.buildName}
      </Typography>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Specs
      </Typography>
      <Box sx={{ marginBottom: "40px" }}><GameServerBuildSpec gsb={gsb} /></Box>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Patch Specs
      </Typography>
      <Box sx={{ marginBottom: "40px" }}><SpecForm clusterApi={clusterApi} gsb={gsb} /></Box>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Status
      </Typography>
      <Box sx={{ marginBottom: "40px" }}><GameServerBuildStatus gsb={gsb} /></Box>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Nodes
      </Typography>
      <Box sx={{ marginBottom: "40px" }}><NodeTable nodeData={nodeData} /></Box>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Game Servers
      </Typography>
      <Box><AllocateForm allocateApi={allocateApi} buildID={gsb.spec ? gsb.spec.buildID : ""} /></Box>
      <Box><GameServerTable gsList={gsList} gsdByName={gsdByName} /></Box>
    </Box>
  );
}

export default GameServerBuildDetail;
