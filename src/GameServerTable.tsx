import GameServerTableItem from "./GameServerTableItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { GameServer } from "./types";

interface GameServerTableProps {
  gsList: Array<GameServer>,
  gsdByName: Record<string, Record<string, number>>
}

function GameServerTable({ gsList, gsdByName }: GameServerTableProps) {
  gsList = gsList.sort((a: GameServer, b: GameServer) => a.metadata.name > b.metadata.name ? 1 : (a.metadata.name < b.metadata.name ? -1 : 0));
  let items = gsList.map((gs, index) => <GameServerTableItem key={index} gs={gs} gsd={gsdByName[gs.metadata.name]} />);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Namespace</TableCell>
            <TableCell>Health</TableCell>
            <TableCell>State</TableCell>
            <TableCell>Public IP</TableCell>
            <TableCell>Ports</TableCell>
            <TableCell>Player Count</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default GameServerTable;
