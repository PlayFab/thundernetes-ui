import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Button, FormControl, Grid, InputLabel, ListSubheader, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import Editor from "@monaco-editor/react";
import { parse, stringify } from 'yaml';
import { fetchWithTimeout } from "../utils";
import { GameServerBuild } from "../types";

interface GameServerBuildCreateProps {
  clusters: Record<string, Record<string, string>>
}

function GameServerBuildCreate({ clusters }: GameServerBuildCreateProps) {
  const [buildYaml, setBuildYaml] = useState("");
  const [currentTemplate, setCurrentTemplate] = useState("");
  const [error, setError] = useState<string>();
  const [defaultTemplate, setDefaultTemplate] = useState<string>("");
  const [requestAccepted, setRequestAccepted] = useState<boolean>();
  const [gsbTemplates, setGsbTemplates] = useState<Map<string, Array<GameServerBuild>>>(new Map());
  const [templatesErrors, setTemplatesErrors] = useState<Set<string>>(new Set());

  const params = useParams();
  const clusterName = params.clusterName ? params.clusterName : "";
  const clusterApi = clusters[clusterName] ? clusters[clusterName].api : "";

  const getDefaultTemplate = useCallback(() => {
    fetchWithTimeout("https://raw.githubusercontent.com/PlayFab/thundernetes/main/samples/netcore/sample.yaml", { timeout: 5000 })
      .then(response => {
        if (response.status === 200) {
          return response.text();
        }
        setTemplatesErrors(prev => new Set(
          prev.add("Couldn't load default template")
        ));
        return undefined;
      })
      .then(response => {
        if (response) {
          setDefaultTemplate(response);
          setBuildYaml(response);
          setCurrentTemplate(response);
        }
      })
      .catch(err => {
        setDefaultTemplate("");
        setTemplatesErrors(prev => new Set(
          prev.add("Couldn't load default template")
        ));
      });
  }, []);

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
          setTemplatesErrors(prev => new Set(
            prev.add("Couldn't load build templates from cluster '" + clusterName + "' at: " + clusterApi)
          ));
          return undefined;
        })
        .then(response => {
          if (response && response.items) {
            setGsbTemplates(prev => new Map(prev.set(clusterName, response.items)));
          }
        })
        .catch(err => {
          setGsbTemplates(prevGsbMap => new Map(prevGsbMap.set(clusterName, [])));
          setTemplatesErrors(prev => new Set(
            prev.add("Couldn't load build templates from cluster '" + clusterName + "' at: " + clusterApi)
          ));
        });
    });
  }, [clusters]);

  const makeSelectItems = (data: Map<string, Array<GameServerBuild>>) => {
    let selectItems: Array<JSX.Element> = [<MenuItem key="default" value={defaultTemplate}>Default</MenuItem>];
    const clusterNames = Array.from(data.keys()).sort();
    clusterNames.forEach((clusterName) => {
      selectItems = selectItems.concat([<ListSubheader key={clusterName}>{clusterName}</ListSubheader>]);
      const clusterSelectItems = data.get(clusterName)!.map((gsb) =>
        <MenuItem key={clusterName + gsb.metadata.name} value={stringify(gsb)}>{gsb.metadata.name}</MenuItem>
      );
      selectItems = selectItems.concat(clusterSelectItems);
    });
    return selectItems;
  };

  useEffect(() => {
    getDefaultTemplate();
    getAllBuilds();
  }, [getAllBuilds, getDefaultTemplate]);

  const handleCloseAlert = (error: string) => {
    templatesErrors.delete(error);
    setTemplatesErrors(prev => new Set(prev));
  };

  const handleTemplateChange = (event: SelectChangeEvent) => {
    if (event && event.target && event.target.value) {
      setCurrentTemplate(event.target.value as string);
      setBuildYaml(event.target.value as string);
    }
  };

  const handleYamlChange = (value: string | undefined) => {
    if (currentTemplate !== "") {
      setCurrentTemplate("");
    }
    if (value) {
      setBuildYaml(value);
    } else {
      setBuildYaml("");
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setError(undefined);
    setRequestAccepted(undefined);

    let build: any = {};
    try {
      build = parse(buildYaml);
    } catch {
      console.log("Not a valid yaml file");
      setError("Not a valid yaml file");
      return;
    }

    fetchWithTimeout(clusterApi + "gameserverbuilds", {
      timeout: 5000,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(build)
    }).then(response => {
      if (response.status === 201) {
        setRequestAccepted(true);
      } else {
        setError("API denied the request: " + response.statusText);
      }
    }).catch(err => {
      setError("Couldn't reach API at: " + clusterApi);
    });
  }

  const selectItems = makeSelectItems(gsbTemplates);
  const templateErrorsArray = Array.from(templatesErrors).sort();
  const templateErrorMessages = templateErrorsArray.map((error, index) =>
    <Grid key={index} item xs={12}>
      <Box display="flex" justifyContent="center">
        <Alert severity="error" onClose={() => handleCloseAlert(error)}>
          {error}
        </Alert>
      </Box>
    </Grid>
  );

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {(error) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Alert severity="error" onClose={() => { setError(undefined) }}>
                {error}
              </Alert>
            </Box>
          </Grid>
        }
        {(requestAccepted) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Alert severity="success" onClose={() => { setRequestAccepted(undefined) }}>
                {"Successfully created build"}
              </Alert>
            </Box>
          </Grid>
        }
        {(templatesErrors) &&
          <React.Fragment>
            {templateErrorMessages}
          </React.Fragment>
        }
        <Grid container item xs={7}>
          <Typography variant="h4" gutterBottom component="div" sx={{ marginBottom: "40px" }}>
            {clusterName + ": Create a Build"}
          </Typography>
        </Grid>
        <Grid container item xs={3} justifyContent="flex-end">
          <FormControl sx={{ m: 1 }} fullWidth size="small">
            <InputLabel id="template-select">Template</InputLabel>
            <Select
              labelId="template-select"
              id="template-select"
              label="Template"
              value={currentTemplate}
              onChange={handleTemplateChange}
            >
              {selectItems}
            </Select>
          </FormControl>
        </Grid>
        <Grid container item xs={1} justifyContent="flex-end">
          <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ height: "40px", marginTop: "8px" }}>
            Create
          </Button>
        </Grid>
        <Grid container item xs={12} justifyContent="center">
          <Editor
            height="60vh"
            width="70vw"
            defaultLanguage="yaml"
            onChange={handleYamlChange}
            options={{ tabSize: 2 }}
            value={buildYaml}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export default GameServerBuildCreate;
