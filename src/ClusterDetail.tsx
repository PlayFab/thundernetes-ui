import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GameServerBuildTable from "./GameServerBuildTable";
import { GameServerBuild } from "./types";

interface ClusterDetailProps {
  clusters: Record<string, Record<string, string>>
}

function ClusterDetail({ clusters }: ClusterDetailProps) {
  const [gsbList, setGsbList] = useState<Array<GameServerBuild>>([]);

  const params = useParams();
  const clusterName = params.clusterName ? params.clusterName : "";
  const clusterApi = clusters[clusterName].api;

  const getGameServerBuilds = useCallback(() => {
    fetch(clusterApi + "gameserverbuilds")
      .then(response => response.json())
      .then(response => setGsbList(response.items))
      .catch(err => { console.log(err); setGsbList([]) });
  }, [clusterApi]);

  useEffect(() => {
    getGameServerBuilds();
    const interval = setInterval(getGameServerBuilds, 5000);
    return () => clearInterval(interval);
  }, [getGameServerBuilds]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom component="div">
        {clusterName}
      </Typography>
      <Grid container spacing={2} sx={{marginBottom: "20px"}}>
        <Grid container item xs={6}>
          <Typography variant="h6" gutterBottom component="div">
            Game Server Builds
          </Typography>
        </Grid>
        <Grid container item xs={6} justifyContent="flex-end">
          <Link to="gsb/create" style={{textDecoration: "none"}}>
          <Button variant="contained" color="primary">
            Create
          </Button>
          </Link>
        </Grid>
      </Grid>
      <GameServerBuildTable gsbList={gsbList} />
    </Box>
  );
}

export default ClusterDetail;
