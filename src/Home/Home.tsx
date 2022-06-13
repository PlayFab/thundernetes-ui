import React from "react";
import { useCallback, useEffect, useState } from "react";
import { Alert, Box, Typography } from "@mui/material";
import ClustersSummary from "./ClustersSummary";
import { GameServerBuild } from "../types";
import GameServerBuildsSummary from "./GameServerBuildsSummary";
import TotalSummary from "./TotalSummary";
import { fetchWithTimeout } from "../utils";

interface HomeProps {
  clusters: Record<string, Record<string, string>>
}

function Home({ clusters }: HomeProps) {
  const [gsbMap, setGsbMap] = useState<Map<string, Array<GameServerBuild>>>(new Map());
  const [errors, setErrors] = useState<Set<string>>(new Set());

  const groupValues = (data: Map<string, Array<GameServerBuild>>): [Record<string, number>, Record<string, Record<string, number>>, Record<string, Record<string, number>>] => {
    function emptyValues() {
      return {
        standingBy: 0,
        active: 0
      }
    };
    let total: Record<string, number> = emptyValues();
    let perCluster: Record<string, Record<string, number>> = {};
    let perBuild: Record<string, Record<string, number>> = {};
    let keys = Array.from(data.keys());
    keys.forEach((clusterName) => {
      if (!perCluster[clusterName]) {
        perCluster[clusterName] = emptyValues();
      }
      data.get(clusterName)!.forEach((gsb: GameServerBuild) => {
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

  const getAllBuilds = useCallback(() => {
    let entries = Object.entries(clusters);
    entries.forEach((value) => {
      let [clusterName, endpoints] = value;
      let clusterApi = endpoints.api;
      fetchWithTimeout(clusterApi + "gameserverbuilds", { timeout: 5000 })
        .then(response => {
          if (response.status === 200) {
            return response.json();
          }
          setErrors(prev => new Set(
            prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameserverbuilds")
          ));
          return undefined;
        })
        .then(response => {
          if (response && response.items) {
            setGsbMap(prevGsbMap => new Map(prevGsbMap.set(clusterName, response.items)));
          }
        })
        .catch(err => {
          setGsbMap(prevGsbMap => new Map(prevGsbMap.set(clusterName, [])));
          setErrors(prev => new Set(
            prev.add("Couldn't reach cluster '" + clusterName + "' at: " + clusterApi + "gameserverbuilds")
          ));
        });
    });
  }, [clusters]);

  const handleCloseAlert = (error: string) => {
    errors.delete(error);
    setErrors(prev => new Set(prev));
  };

  useEffect(() => {
    getAllBuilds();
    const interval = setInterval(getAllBuilds, 5000);
    return () => clearInterval(interval);
  }, [getAllBuilds]);

  const [total, perCluster, perBuild] = groupValues(gsbMap);
  const errorsArray = Array.from(errors).sort();
  const errorMessages = errorsArray.map((error, index) =>
    <Box key={index} display="flex" justifyContent="center">
      <Alert severity="error" onClose={() => handleCloseAlert(error)}>
        {error}
      </Alert>
    </Box>
  );

  return (
    <React.Fragment>
      {(errors) &&
        <React.Fragment>
          {errorMessages}
        </React.Fragment>
      }
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
    </React.Fragment>
  );
}

export default Home;
