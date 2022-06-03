import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import GameServerBuildsSummaryItem from "./GameServerBuildsSummaryItem";

interface GameServerBuildsSummaryProps {
  perBuild: Record<string, Record<string, number>>
}

function GameServerBuildsSummary({ perBuild }: GameServerBuildsSummaryProps) {
  let keys = Object.keys(perBuild).sort();
  let items = keys.map((buildName, index) => <GameServerBuildsSummaryItem key={index} buildName={buildName} values={perBuild[buildName]} />);
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
