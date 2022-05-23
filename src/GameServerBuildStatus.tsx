import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, Paper } from "@mui/material";
import { GameServerBuild } from "./types";

interface GameServerBuildStatusProps {
  gsb: GameServerBuild
}

function GameServerBuildStatus({ gsb }: GameServerBuildStatusProps) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell><Typography>Health</Typography></TableCell>
            <TableCell><Typography>{gsb.status.health}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Current StandingBy</Typography></TableCell>
            <TableCell><Typography>{gsb.status.currentStandingBy ? gsb.status.currentStandingBy : 0}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Current Active</Typography></TableCell>
            <TableCell><Typography>{gsb.status.currentActive ? gsb.status.currentActive : 0}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Crashes Count</Typography></TableCell>
            <TableCell><Typography>{gsb.status.crashesCount ? gsb.status.crashesCount : 0}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Current Pending</Typography></TableCell>
            <TableCell><Typography>{gsb.status.currentPending ? gsb.status.currentPending : 0}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Current Initializing</Typography></TableCell>
            <TableCell><Typography>{gsb.status.currentInitializing ? gsb.status.currentInitializing : 0}</Typography></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GameServerBuildStatus;
