import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GameServerBuildTable from "./GameServerBuildTable";
import NodeTable from "./NodeTable";
import { GameServer, GameServerBuild } from "./types";

interface ClusterDetailProps {
  clusters: Record<string, Record<string, string>>
}

function ClusterDetail({ clusters }: ClusterDetailProps) {
  const [gsList, setGsList] = useState<Array<GameServer>>([]);
  const [gsbList, setGsbList] = useState<Array<GameServerBuild>>([]);

  const params = useParams();
  const clusterName = params.clusterName ? params.clusterName : "";
  const clusterApi = clusters[clusterName] ? clusters[clusterName].api: "";

  const getGameServerBuilds = useCallback(() => {
    fetch(clusterApi + "gameserverbuilds")
      .then(response => response.json())
      .then(response => setGsbList(response.items))
      .catch(err => { console.log(err); setGsbList([]) });
  }, [clusterApi]);

  const getGameServers = useCallback(() => {
    fetch(clusterApi + "gameservers")
      .then(response => response.json())
      .then(response => setGsList(response.items))
      .catch(err => { console.log(err); setGsList([]) });
  }, [clusterApi]);

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

  useEffect(() => {
    getGameServers();
    getGameServerBuilds();
    const gsInterval = setInterval(getGameServers, 5000);
    const gsbInterval = setInterval(getGameServerBuilds, 5000);
    return () => { clearInterval(gsInterval); clearInterval(gsbInterval); };
  }, [getGameServers, getGameServerBuilds]);

  const nodeData = groupDataByNode(gsList);
  
  return (
    <Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h4" gutterBottom component="div">
          {clusterName}
        </Typography>
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Grid container spacing={2}>
          <Grid container item xs={6}>
            <Typography variant="h6" gutterBottom component="div">
              Game Server Builds
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
        <GameServerBuildTable gsbList={gsbList} />
      </Box>
      <Box sx={{ marginBottom: "20px" }}>
        <Typography variant="h6" gutterBottom component="div">
          Nodes
        </Typography>
        <NodeTable nodeData={nodeData} />
      </Box>
    </Box>
  );
}

export default ClusterDetail;
