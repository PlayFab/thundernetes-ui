import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import ClustersSummary from "./ClustersSummary";
import GameServerBuildsSummary from "./GameServerBuildsSummary";
import TotalSummary from "./TotalSummary";

function groupValues(data: Map<string, Array<any>>) {
  function emptyValues() {
    return {
      standingBy: 0,
      active: 0
    }
  };
  let total: Record<string, number> = emptyValues();
  let perCluster: Record<string, any> = {};
  let perBuild: Record<string, any> = {};
  let keys = Array.from(data.keys());
  keys.forEach((clusterName) => {
    if (!perCluster[clusterName]) {
      perCluster[clusterName] = emptyValues();
    }
    data.get(clusterName)!.forEach((gsb: any) => {
      let buildName = gsb.metadata.name;
      if (!perBuild[buildName]) {
        perBuild[buildName] = emptyValues();
      }
      total.standingBy += gsb.status.currentStandingBy ? gsb.status.currentStandingBy : 0;
      perCluster[clusterName].standingBy += gsb.status.currentStandingBy ? gsb.status.currentStandingBy : 0;
      perBuild[buildName].standingBy += gsb.status.currentStandingBy ? gsb.status.currentStandingBy : 0;
      total.active += gsb.status.currentActive ? gsb.status.currentActive : 0;
      perCluster[clusterName].active += gsb.status.currentActive ? gsb.status.currentActive : 0;
      perBuild[buildName].active += gsb.status.currentActive ? gsb.status.currentActive : 0;
    });
  });
  return [total, perCluster, perBuild];
}

function Home(props: any) {
  const [gsbMap, setGsbMap] = useState<Map<string, Array<any>>>(new Map());

  useEffect(() => {
    let entries = Object.entries(props.clusters);
    entries.forEach((value) => {
      let [clusterName, clusterApi] = value;
      fetch(clusterApi + "gameserverbuilds")
        .then(response => response.json())
        .then(response => setGsbMap(prevGsbMap => new Map(prevGsbMap.set(clusterName, response.items))))
        .catch(err => { console.log(err); setGsbMap(prevGsbMap => new Map(prevGsbMap.set(clusterName, []))) });
    });
  }, [props.clusters]);

  const [total, perCluster, perBuild] = groupValues(gsbMap);
  return (
    <Box>
      <Typography variant="h4" gutterBottom component="div" sx={{ marginBottom: "40px" }}>
        Summary
      </Typography>
      <TotalSummary total={total} />
      <Typography variant="h5" gutterBottom component="div">
        Clusters
      </Typography>
      <ClustersSummary perCluster={perCluster} />
      <Typography variant="h5" gutterBottom component="div">
        Builds
      </Typography>
      <GameServerBuildsSummary perBuild={perBuild} />
    </Box>
  );
}

export default Home;
