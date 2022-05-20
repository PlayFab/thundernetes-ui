import { Table, TableBody, TableCell, TableContainer, TableRow, Typography, Paper } from "@mui/material";

function GameServerBuildStatus(props: any) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell><Typography>Health</Typography></TableCell>
            <TableCell><Typography>{props.gsb.status.health}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Current StandBy</Typography></TableCell>
            <TableCell><Typography>{props.gsb.status.currentStandingByReadyDesired}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Current Active</Typography></TableCell>
            <TableCell><Typography>{props.gsb.status.currentActive ? props.gsb.status.currentActive : 0}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Crashes Count</Typography></TableCell>
            <TableCell><Typography>{props.gsb.status.crashesCount ? props.gsb.status.crashesCount : 0}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Current Pending</Typography></TableCell>
            <TableCell><Typography>{props.gsb.status.currentPending ? props.gsb.status.currentPending : 0}</Typography></TableCell>
          </TableRow>
          <TableRow>
            <TableCell><Typography>Current Initializing</Typography></TableCell>
            <TableCell><Typography>{props.gsb.status.currentInitializing ? props.gsb.status.currentInitializing : 0}</Typography></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GameServerBuildStatus;
