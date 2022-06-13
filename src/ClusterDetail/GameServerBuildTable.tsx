import GameServerBuildTableItem from "./GameServerBuildTableItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { GameServerBuild } from "../types";

interface GameServerBuildTableProps {
  gsbList: Array<GameServerBuild>
}

function GameServerBuildTable({ gsbList }: GameServerBuildTableProps) {
  gsbList = gsbList.sort((a: GameServerBuild, b: GameServerBuild) => a.metadata.name > b.metadata.name ? 1 : (a.metadata.name < b.metadata.name ? -1 : 0));
  let items = gsbList.map((gsb, index) => <GameServerBuildTableItem key={index} gsb={gsb} />);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Namespace</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>StandingBy</TableCell>
            <TableCell>Crashes</TableCell>
            <TableCell>Health</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GameServerBuildTable;
