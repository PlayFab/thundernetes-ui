import GameServerBuildTableItem from "./GameServerBuildTableItem";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { GameServerBuild } from "../types";
import { visuallyHidden } from '@mui/utils';

interface GameServerBuildTableProps {
  clusterApi: string,
  gsbList: Array<GameServerBuild>
}

function GameServerBuildTable({ clusterApi, gsbList }: GameServerBuildTableProps) {
  gsbList = gsbList.sort((a: GameServerBuild, b: GameServerBuild) => a.metadata.name > b.metadata.name ? 1 : (a.metadata.name < b.metadata.name ? -1 : 0));
  let items = gsbList.map((gsb, index) => <GameServerBuildTableItem key={index} clusterApi={clusterApi} gsb={gsb} />);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Namespace</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>StandingBy</TableCell>
            <TableCell>Crashes</TableCell>
            <TableCell>Health</TableCell>
            <TableCell aria-label="Actions"><Box sx={visuallyHidden}>Actions</Box></TableCell>
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
