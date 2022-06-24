import GameServerBuildTableItem from "./GameServerBuildTableItem";
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { GameServerBuild } from "../types";
import { visuallyHidden } from '@mui/utils';
import { useMemo } from "react";

interface GameServerBuildTableProps {
  clusterApi: string,
  gsbList: Array<GameServerBuild>
}

function GameServerBuildTable({ clusterApi, gsbList }: GameServerBuildTableProps) {
  const items = useMemo(() => {
    const sortedGsb = gsbList.sort((a: GameServerBuild, b: GameServerBuild) => a.metadata.name > b.metadata.name ? 1 : (a.metadata.name < b.metadata.name ? -1 : 0));
    return sortedGsb.map((gsb, index) => <GameServerBuildTableItem key={index} clusterApi={clusterApi} gsb={gsb} />);
  }, [clusterApi, gsbList]);
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
