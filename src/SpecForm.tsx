import { useState } from "react";
import { Box, Button, Grid, TextField } from "@mui/material";
import { GameServerBuild } from "./types";

interface SpecFormProps {
  clusterApi: string,
  gsb: GameServerBuild,
}

function SpecForm({ clusterApi, gsb }: SpecFormProps) {
  const [max, setMax] = useState(0);
  const [standingBy, setStandingBy] = useState(0);

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
    }).then(response => console.log(response));
  }

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ flexGrow: 1, marginBottom: "40px" }}>
        <Grid container justifyContent="left" spacing={2}>
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
        </Grid>
      </Box>
    </form>
  );
}

export default SpecForm;
