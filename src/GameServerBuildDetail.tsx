import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import GameServerBuildSpec from "./GameServerBuildSpec";
import GameServerBuildStatus from "./GameServerBuildStatus"
import GameServerTable from "./GameServerTable";

const emptyGsb = {
  spec: {
    buildID: "",
    max: 0,
    standingBy: 0,
    portsToExpose: [],
    crashesToMarkUnhealthy: 0
  },
  metadata: {
    namespace: ""
  },
  status: {}
}
function GameServerBuildDetail(props: any) {
  const [gsb, setGsb] = useState(emptyGsb);

  const params = useParams();
  const clusterName = params.clusterName?params.clusterName:"";
  const clusterApi = props.clusters[clusterName];

  useEffect(() => {
    console.log(clusterApi+"gameserverbuilds/"+params.namespace+"/"+params.buildName);
    fetch(clusterApi+"gameserverbuilds/"+params.namespace+"/"+params.buildName)
      .then(response => response.json())
      .then(response => {console.log(response); setGsb(response)})
      .catch(err => {console.log(err); setGsb(emptyGsb)});
  }, [clusterApi]);

  return (
    <Box>
      <Typography variant="h4" gutterBottom component="div" sx={{ marginBottom: "40px" }}>
        {params.namespace+"/"+params.buildName}
      </Typography>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Status
      </Typography>
      <Box sx={{ marginBottom: "40px" }}><GameServerBuildStatus gsb={gsb} /></Box>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Specs
      </Typography>
      <Box sx={{ marginBottom: "40px" }}><GameServerBuildSpec clusterApi={clusterApi} namespace={params.namespace} buildName={params.buildName} gsb={gsb} /></Box>
      <Typography variant="h6" gutterBottom component="div" sx={{ marginBottom: "20px" }}>
        Game Servers
      </Typography>
      <Box><GameServerTable clusterApi={clusterApi} gsb={gsb} /></Box>
    </Box>
  );
}

export default GameServerBuildDetail;
