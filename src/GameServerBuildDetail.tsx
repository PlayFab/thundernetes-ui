import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import AllocateForm from "./AllocateForm";
import GameServerBuildSpec from "./GameServerBuildSpec";
import GameServerBuildStatus from "./GameServerBuildStatus"
import GameServerTable from "./GameServerTable";
import { emptyGameServerBuild, GameServerBuild, GameServer } from "./types";

interface GameServerBuildDetailProps {
  clusters: Record<string, Record<string, string>>
}

function GameServerBuildDetail({ clusters }: GameServerBuildDetailProps) {
  const [gsb, setGsb] = useState<GameServerBuild>(emptyGameServerBuild);
  const [gsList, setGsList] = useState<Array<GameServer>>([]);

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
      .then(response => { console.log(response); setGsb(response) })
      .catch(err => setGsb(emptyGameServerBuild));
  }, [clusterApi, params.namespace, params.buildName]);

  useEffect(() => {
    getGameServerBuild();
  }, [getGameServerBuild]);

  useEffect(() => {
    getGameServers();
  }, [getGameServers]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom component="div" sx={{ marginBottom: "40px" }}>
        {params.namespace + "/" + params.buildName}
      </Typography>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Specs
      </Typography>
      <Box sx={{ marginBottom: "40px" }}><GameServerBuildSpec clusterApi={clusterApi} gsb={gsb} /></Box>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Status
      </Typography>
      <Box sx={{ marginBottom: "40px" }}><GameServerBuildStatus gsb={gsb} /></Box>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Game Servers
      </Typography>
      <Box><AllocateForm allocateApi={allocateApi} buildID={gsb.spec.buildID} /></Box>
      <Box><GameServerTable gsList={gsList} /></Box>
    </Box>
  );
}

export default GameServerBuildDetail;
