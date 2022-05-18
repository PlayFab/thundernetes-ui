import { Box, Typography } from "@mui/material";
import GameServerBuildTable from "./GameServerBuildTable";

type ClusterDetailProps = {
  clusterApi:  string | undefined;
}

function ClusterDetail({clusterApi}: ClusterDetailProps) {
  return (
    <Box>
      <Typography variant="h6" gutterBottom component="div">
        Game Server Builds
      </Typography>
      <GameServerBuildTable clusterApi={clusterApi} />
    </Box>
  );
}

export default ClusterDetail;