import { useState } from "react";
import { Button, Table, TableBody, TableCell, TableContainer, TableRow, Paper, TextField } from "@mui/material";

function GameServerBuildSpec(props: any) {
  const [max, setMax] = useState(props.gsb.spec.max);
  const [standingBy, setStandingBy] = useState(props.gsb.spec.standingBy);


  function handleChange(event: any) {
    if (event.target.name === "max") {
      setMax(event.target.value);
    } else if (event.target.name === "standingBy") {
      setStandingBy(event.target.value);
    }
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    console.log({ max, standingBy });
  }

  return (
    <form onSubmit={handleSubmit}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 500 }} aria-label="simple table">
          <TableBody>
            <TableRow>
              <TableCell>Build ID</TableCell>
              <TableCell>{props.gsb.spec.buildID}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>StandingBy</TableCell>
              <TableCell>
                <TextField name="standingBy" type="number" size="small" sx={{ width: 100 }} value={standingBy} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Max</TableCell>
              <TableCell>
                <TextField name="max" type="number" size="small" sx={{ width: 100 }} value={max} onChange={handleChange} />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Ports to Expose</TableCell>
              <TableCell>{props.gsb.spec.portsToExpose}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Crashes to mark unhealthy</TableCell>
              <TableCell>{props.gsb.spec.crashesToMarkUnhealthy}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant="contained" color="primary" type="submit" sx={{ marginTop: "10px" }}>
        Submit
      </Button>
    </form>
  );
}

export default GameServerBuildSpec;