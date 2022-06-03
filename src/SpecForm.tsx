import { useState } from "react";
import { Box, Button, Chip, Grid, Stack, TextField } from "@mui/material";
import { Done } from "@mui/icons-material";
import { GameServerBuild } from "./types";

interface SpecFormProps {
  clusterApi: string,
  gsb: GameServerBuild,
}

function SpecForm({ clusterApi, gsb }: SpecFormProps) {
  const [max, setMax] = useState(0);
  const [standingBy, setStandingBy] = useState(0);
  const [allocateError, setAllocateError] = useState<Error>();
  const [requestAccepted, setRequestAccepted] = useState<boolean>();

  const handleChange = (event: any) => {
    if (event.target.name === "max") {
      setMax(event.target.value);
    } else if (event.target.name === "standingBy") {
      setStandingBy(event.target.value);
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const patch = {
      standingBy: Math.floor(standingBy),
      max: Math.floor(max)
    }
    fetch(clusterApi + "gameserverbuilds/" + gsb.metadata.namespace + "/" + gsb.metadata.name, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patch)
    }).then(response => {
      if (response.status === 200) {
        setRequestAccepted(true);
      } else {
        setRequestAccepted(false);
      }
    }).catch(err => {
      setAllocateError(err);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent="left" spacing={2} sx={{ flexGrow: 1, marginBottom: "40px" }}>
        <Grid item xs={2}>
          <TextField name="standingBy" type="number" id="standingBy" size="small" label="StandingBy" value={standingBy} onChange={handleChange} />
        </Grid>
        <Grid item xs={2}>
          <TextField name="max" type="number" id="max" size="small" label="Max" value={max} onChange={handleChange} />
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" color="primary" type="submit">
            Patch
          </Button>
        </Grid>
        {(requestAccepted) &&
          <Grid item xs={1}>
            <Done color="success" sx={{marginTop: "5px"}} />
          </Grid>
        }
        {(allocateError) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="left">
              <Stack direction="column">
                <Chip color="error" sx={{ marginBottom: "5px" }} variant="outlined"
                  label={"Couldn't reach API at: " + clusterApi} />
              </Stack>
            </Box>
          </Grid>
        }
        {(!requestAccepted && requestAccepted !== undefined) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="left">
              <Stack direction="column">
                <Chip color="error" sx={{ marginBottom: "5px" }} variant="outlined"
                  label={"API denied the request at: " + clusterApi} />
              </Stack>
            </Box>
          </Grid>
        }
      </Grid>
    </form>
  );
}

export default SpecForm;
