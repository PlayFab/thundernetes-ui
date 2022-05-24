import { useCallback, useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
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
      <Typography variant="h6" gutterBottom component="div">
        Game Server Builds
      </Typography>
      <GameServerBuildTable gsbList={gsbList} />
    </Box>
  );
}

export default ClusterDetail;
