import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Alert, Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import Editor from "@monaco-editor/react";
import { parse, stringify } from 'yaml';
import { fetchWithTimeout } from "../utils";

interface GameServerBuildCreateProps {
  clusters: Record<string, Record<string, string>>
}

function GameServerBuildCreate({ clusters }: GameServerBuildCreateProps) {
  const [buildYaml, setBuildYaml] = useState("# some comment");
  const [error, setError] = useState<string>();
  const [requestAccepted, setRequestAccepted] = useState<boolean>();

  const params = useParams();
  const clusterName = params.clusterName ? params.clusterName : "";
  const clusterApi = clusters[clusterName] ? clusters[clusterName].api : "";

  const handleTemplateChange = (event: SelectChangeEvent) => {
    setBuildYaml(event.target.value as string);
  };

  const handleYamlChange = (value: string | undefined) => {
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
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(build)
    }).then(response => {
      if (response.status === 200) {
        setRequestAccepted(true);
      } else {
        setError("API denied the request: " + response.text());
      }
    }).catch(err => {
      setError("Couldn't reach API at: " + clusterApi);
    });
  }

  return (
    <React.Fragment>
      <Grid container spacing={2}>
        {(error && error === clusterApi) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center">
              <Alert severity="error" onClose={() => { setError(undefined) }}>
                {error}
              </Alert>
            </Box>
          </Grid>
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
              onChange={handleTemplateChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
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
