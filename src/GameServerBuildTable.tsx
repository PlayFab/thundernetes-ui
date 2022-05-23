import { useEffect, useState } from "react";
import GameServerBuildTableItem from "./GameServerBuildTableItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { GameServerBuild } from "./types";

interface GameServerBuildTableProps {
  clusterApi: string
}

function GameServerBuildTable({ clusterApi }: GameServerBuildTableProps) {
  const [gsbList, setGsbList] = useState<Array<GameServerBuild>>([]);

  useEffect(() => {
    fetch(clusterApi + "gameserverbuilds")
      .then(response => response.json())
      .then(response => {console.log(response.items); setGsbList(response.items)})
      .catch(err => {console.log(err); setGsbList([])});
  }, [clusterApi]);

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
