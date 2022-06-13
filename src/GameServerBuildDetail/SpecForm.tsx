import { useState } from "react";
import { Alert, Box, Button, Grid, TextField } from "@mui/material";
import { Done } from "@mui/icons-material";
import { GameServerBuild } from "../types";
import { fetchWithTimeout } from "../utils";

interface SpecFormProps {
  clusterApi: string,
  gsb: GameServerBuild,
}

function SpecForm({ clusterApi, gsb }: SpecFormProps) {
  const [max, setMax] = useState<number>();
  const [standingBy, setStandingBy] = useState<number>();
  const [error, setError] = useState<string>();
  const [requestAccepted, setRequestAccepted] = useState<boolean>();

  const handleChange = (event: any) => {
    const isInt = /^\d+$/;
    if (!(isInt.test(event.target.value) || event.target.value === "")) {
      return;
    }
    if (event.target.name === "max") {
      if (event.target.value === "") {
        setMax(undefined);
      } else {
        setMax(Number(event.target.value));
      }
    }
    if (event.target.name === "standingBy") {
      if (event.target.value === "") {
        setStandingBy(undefined);
      } else {
        setStandingBy(Number(event.target.value));
      }
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setError(undefined);
    setRequestAccepted(undefined);
    if (standingBy === undefined || max === undefined) {
      setError("standingBy and max values cannot be empty");
      return;
    }
    if (standingBy > max) {
      setError("standingBy cannot be more than max");
      return;
    }
    const patch = {
      standingBy: Math.floor(standingBy),
      max: Math.floor(max)
    }
    fetchWithTimeout(clusterApi + "gameserverbuilds/" + gsb.metadata.namespace + "/" + gsb.metadata.name, {
      timeout: 5000,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patch)
    }).then(response => {
      if (response.status === 200) {
        setRequestAccepted(true);
      } else {
        setError("API denied the request: " + response.statusText);
      }
    }).catch(err => {
      setError("Couldn't reach API at: " + clusterApi);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent="left" spacing={2} sx={{ flexGrow: 1, marginBottom: "40px" }}>
        <Grid item xs={2}>
          <TextField name="standingBy" id="standingBy" size="small" label="StandingBy" value={standingBy === undefined ? "" : standingBy} onChange={handleChange} />
        </Grid>
        <Grid item xs={2}>
          <TextField name="max" id="max" size="small" label="Max" value={max === undefined ? "" : max} onChange={handleChange} />
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" color="primary" type="submit">
            Patch
          </Button>
        </Grid>
        {(requestAccepted) &&
          <Grid item xs={1}>
            <Done color="success" sx={{ marginTop: "5px" }} />
          </Grid>
        }
        {(error) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="left">
              <Alert severity="error" onClose={() => { setError(undefined) }}>
                {error}
              </Alert>
            </Box>
          </Grid>
        }
      </Grid>
    </form>
  );
}

export default SpecForm;
