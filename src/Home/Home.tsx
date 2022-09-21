import React, { useMemo } from "react";
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

  const groupValues = (data: Map<string, Array<GameServerBuild>>): [Record<string, number>, Record<string, Record<string, number>>, Record<string, Record<string, number>>, Record<string, Record<string, string>>] => {
    function emptyValues() {
      return {
        standingBy: 0,
        active: 0
      }
    };

    function emptyMetadata() {
      return {
        namespace: "",
        clusterName: "",
      };
    };

    let total: Record<string, number> = emptyValues();
    let perCluster: Record<string, Record<string, number>> = {};
    let perBuild: Record<string, Record<string, number>> = {};
    let perBuildMetadata: Record<string, Record<string, string>> = {};
    const keys = Array.from(data.keys());
    keys.forEach((clusterName) => {
      if (!perCluster[clusterName]) {
        perCluster[clusterName] = emptyValues();
      }
      data.get(clusterName)!.forEach((gsb: GameServerBuild) => {
        let buildName = gsb.metadata.name;
        let buildKey = clusterName + "-:-" + buildName;
        if (!perBuild[buildKey]) {
          perBuild[buildKey] = emptyValues();
        }
        if (!perBuildMetadata[buildKey]) {
          perBuildMetadata[buildKey] = emptyMetadata();
        }
        total.standingBy += gsb.status.currentStandingBy ? gsb.status.currentStandingBy : 0;
        perCluster[clusterName].standingBy += gsb.status.currentStandingBy ? gsb.status.currentStandingBy : 0;
        perBuild[buildKey].standingBy += gsb.status.currentStandingBy ? gsb.status.currentStandingBy : 0;
        total.active += gsb.status.currentActive ? gsb.status.currentActive : 0;
        perCluster[clusterName].active += gsb.status.currentActive ? gsb.status.currentActive : 0;
        perBuild[buildKey].active += gsb.status.currentActive ? gsb.status.currentActive : 0;
        perBuildMetadata[buildKey].namespace = gsb.metadata.namespace ? gsb.metadata.namespace : "";
        perBuildMetadata[buildKey].clusterName = clusterName;
      });
    });
    return [total, perCluster, perBuild, perBuildMetadata];
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

  const handleCloseAlert = useCallback((error: string) => {
    setErrors(prev => {
      const newErrors = new Set(prev);
      newErrors.delete(error);
      return newErrors;
    });
  }, []);

  useEffect(() => {
    getAllBuilds();
    const interval = setInterval(getAllBuilds, 5000);
    return () => clearInterval(interval);
  }, [getAllBuilds]);

  const [total, perCluster, perBuild, perBuildMetadata] = useMemo(() => groupValues(gsbMap), [gsbMap]);
  const errorMessages = useMemo(() => {
    const errorsArray = Array.from(errors).sort();
    return errorsArray.map((error, index) =>
      <Box key={index} display="flex" justifyContent="center">
        <Alert severity="error" onClose={() => handleCloseAlert(error)}>
          {error}
        </Alert>
      </Box>
    );
  }, [errors, handleCloseAlert]);

  return (
    <React.Fragment>
      {(errors) &&
        <React.Fragment>
          {errorMessages}
        </React.Fragment>
      }
      <Typography variant="h4" component="div" sx={{ marginBottom: "40px" }}>
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
      <GameServerBuildsSummary perBuild={perBuild} perBuildMetadata={perBuildMetadata} />
    </React.Fragment>
  );
}

export default Home;
