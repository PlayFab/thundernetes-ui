import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, Paper } from "@mui/material";
import { GameServerBuild } from "../types";

interface GameServerBuildSpecProps {
  gsb: GameServerBuild
}

function GameServerBuildSpec({ gsb }: GameServerBuildSpecProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell><Typography>Build ID</Typography></TableCell>
            <TableCell><Typography>{gsb.spec ? gsb.spec.buildID : ""}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>StandingBy</Typography></TableCell>
            <TableCell><Typography>{gsb.spec ? (gsb.spec.standingBy ? gsb.spec.standingBy : 0) : 0}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Max</Typography></TableCell>
            <TableCell><Typography>{gsb.spec ? (gsb.spec.max ? gsb.spec.max : 0) : 0}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Ports to Expose</Typography></TableCell>
            <TableCell><Typography>{gsb.spec ? JSON.stringify(gsb.spec.portsToExpose) : ""}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Crashes to mark Unhealthy</Typography></TableCell>
            <TableCell><Typography>{gsb.spec ? (gsb.spec.crashesToMarkUnhealthy ? gsb.spec.crashesToMarkUnhealthy : 0) : 0}</Typography></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GameServerBuildSpec;
