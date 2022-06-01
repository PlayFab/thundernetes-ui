import { useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Paper, TextField } from "@mui/material";
import { GameServerBuild } from "./types";

interface GameServerBuildSpecProps {
  gsb: GameServerBuild,
  clusterApi: string
}

function GameServerBuildSpec({ gsb, clusterApi }: GameServerBuildSpecProps) {
  const [max, setMax] = useState(0);
  const [standingBy, setStandingBy] = useState(0);

  useEffect(() => {
    setMax(gsb.spec ? gsb.spec.max : 0);
    setStandingBy(gsb.spec ? gsb.spec.standingBy : 0);
  }, [gsb.spec]);

  const handleChange = (event: any) => {
    if (event.target.name === "max") {
      setMax(event.target.value);
    } else if (event.target.name === "standingBy") {
      setStandingBy(event.target.value);
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    if (!gsb.metadata) {
      return;
    }
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
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell><Typography>Build ID</Typography></TableCell>
              <TableCell><Typography>{gsb.spec ? gsb.spec.buildID : 0}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography>StandingBy</Typography></TableCell>
              <TableCell>
                <TextField name="standingBy" type="number" id="standingBy" size="small" sx={{ width: 100 }} value={standingBy} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography>Max</Typography></TableCell>
              <TableCell>
                <TextField name="max" type="number" id="max" size="small" sx={{ width: 100 }} value={max} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography>Ports to Expose</Typography></TableCell>
              <TableCell><Typography>{gsb.spec ? JSON.stringify(gsb.spec.portsToExpose) : ""}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography>Crashes to mark Unhealthy</Typography></TableCell>
              <TableCell><Typography>{gsb.spec ? gsb.spec.crashesToMarkUnhealthy : 0}</Typography></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" type="submit" sx={{ marginTop: "10px" }}>
        Patch
      </Button>
    </form>
  );
}

export default GameServerBuildSpec;
