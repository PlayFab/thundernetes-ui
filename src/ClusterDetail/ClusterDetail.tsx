import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Chip, Grid, Stack, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GameServerBuildTable from "./GameServerBuildTable";
import NodeTable from "../Common/NodeTable";
import { GameServer, GameServerBuild } from "../types";

interface ClusterDetailProps {
  clusters: Record<string, Record<string, string>>
}

function ClusterDetail({ clusters }: ClusterDetailProps) {
  const [gsList, setGsList] = useState<Array<GameServer>>([]);
  const [gsbList, setGsbList] = useState<Array<GameServerBuild>>([]);
  const [apiError, setApiError] = useState<Error>();

  const params = useParams();
  const clusterName = params.clusterName ? params.clusterName : "";
  const clusterApi = clusters[clusterName] ? clusters[clusterName].api : "";

  const getGameServerBuilds = useCallback(() => {
    fetch(clusterApi + "gameserverbuilds")
      .then(response => response.json())
      .then(response => setGsbList(response.items))
      .catch(err => {
        setApiError(err);
        setGsbList([]);
      });
  }, [clusterApi]);

  const getGameServers = useCallback(() => {
    fetch(clusterApi + "gameservers")
      .then(response => response.json())
      .then(response => setGsList(response.items))
      .catch(err => {
        setApiError(err);
        setGsList([]);
      });
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
    <React.Fragment>
      {(apiError) &&
        <Box display="flex" justifyContent="center">
          <Stack direction="column">
            <Chip color="error" sx={{ marginBottom: "5px" }} variant="outlined"
              label={"Couldn't reach cluster '" + clusterName + "' at: " + clusters[clusterName].api} />
          </Stack>
        </Box>
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
        <GameServerBuildTable gsbList={gsbList} />
      </Box>
      <Typography variant="h5" gutterBottom component="div">
        Nodes
      </Typography>
      <NodeTable nodeData={nodeData} />
    </React.Fragment>
  );
}

export default ClusterDetail;
