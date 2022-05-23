import { TableCell, TableRow } from "@mui/material";
import { GameServer } from "./types";

interface GameServerTableItemProps {
  gs: GameServer
}

function GameServerTableItem({ gs }: GameServerTableItemProps) {
  return (
    <TableRow>
      <TableCell>{gs.metadata.name}</TableCell>
      <TableCell>{gs.metadata.namespace}</TableCell>
      <TableCell>{gs.status.state}</TableCell>
      <TableCell>{gs.status.health}</TableCell>
    </TableRow>
  );
}

export default GameServerTableItem;
