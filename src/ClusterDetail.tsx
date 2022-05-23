import { Box, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import GameServerBuildTable from "./GameServerBuildTable";

interface ClusterDetailProps {
  clusters: Record<string, Record<string, string>>
}

function ClusterDetail({ clusters }: ClusterDetailProps) {
  const params = useParams();
  const clusterName = params.clusterName?params.clusterName:"";
  const clusterApi = clusters[clusterName].api;
  console.log(clusterApi);
  return (
    <Box>
      <Typography variant="h4" gutterBottom component="div">
        {clusterName}
      </Typography>
      <Typography variant="h6" gutterBottom component="div">
        Game Server Builds
      </Typography>
      <GameServerBuildTable clusterApi={clusterApi} />
    </Box>
  );
}

export default ClusterDetail;
