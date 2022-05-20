import { useEffect, useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Typography, Paper, TextField } from "@mui/material";

function GameServerBuildSpec(props: any) {
  const [max, setMax] = useState(0);
  const [standingBy, setStandingBy] = useState(0);

  useEffect(() => {
    setMax(props.gsb.spec.max);
    setStandingBy(props.gsb.spec.standingBy);
  }, [props.gsb.spec]);

  function handleChange(event: any) {
    if (event.target.name === "max") {
      setMax(event.target.value);
    } else if (event.target.name === "standingBy") {
      setStandingBy(event.target.value);
    }
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    const patch = {
      standingBy: Math.floor(standingBy),
      max: Math.floor(max)
    }
    console.log(JSON.stringify(patch));
    console.log(props.clusterApi+"gameservers/"+props.namespace+"/"+props.buildName);
    fetch(props.clusterApi+"gameserverbuilds/"+props.namespace+"/"+props.buildName,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patch)
    }).then(response => console.log(response));
  }

  return (
    <form onSubmit={handleSubmit}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell><Typography>Build ID</Typography></TableCell>
              <TableCell><Typography>{props.gsb.spec.buildID}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography>StandingBy</Typography></TableCell>
              <TableCell>
                <TextField name="standingBy" type="number" size="small" sx={{ width: 100 }} value={standingBy} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography>Max</Typography></TableCell>
              <TableCell>
                <TextField name="max" type="number" size="small" sx={{ width: 100 }} value={max} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography>Ports to Expose</Typography></TableCell>
              <TableCell><Typography>{props.gsb.spec.portsToExpose}</Typography></TableCell>
            </TableRow>
            <TableRow>
              <TableCell><Typography>Crashes to mark unhealthy</Typography></TableCell>
              <TableCell><Typography>{props.gsb.spec.crashesToMarkUnhealthy}</Typography></TableCell>
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
