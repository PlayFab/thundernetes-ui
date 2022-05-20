import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function GameServerBuildsSummaryItem(props: any) {
  return (
    <TableRow>
      <TableCell>{props.buildName}</TableCell>
      <TableCell>{props.values.standingBy}</TableCell>
      <TableCell>{props.values.active}</TableCell>
    </TableRow>
  );
}

function GameServerBuildsSummary(props: any) {
  let items = Object.keys(props.perBuild).map((buildName, index) => <GameServerBuildsSummaryItem key={index} buildName={buildName} values={props.perBuild[buildName]} />);
  return (
    <TableContainer component={Paper} sx={{ marginBottom: "40px" }}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Build Name</TableCell>
            <TableCell>StandingBy</TableCell>
            <TableCell>Active</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GameServerBuildsSummary;
