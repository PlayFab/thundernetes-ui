import { TableCell, TableRow } from "@mui/material";
import { GameServer } from "../types";

interface GameServerTableItemProps {
  gs: GameServer,
  gsd: Record<string, number>
}

function GameServerTableItem({ gs, gsd }: GameServerTableItemProps) {
  return (
    <TableRow>
      <TableCell>{gs.metadata.name}</TableCell>
      <TableCell>{gs.metadata.namespace}</TableCell>
      <TableCell>{gs.status.health}</TableCell>
      <TableCell>{gs.status.state}</TableCell>
      <TableCell>{gs.status.publicIP}</TableCell>
      <TableCell>{gs.status.ports}</TableCell>
      <TableCell>{gsd?(gsd.connectedPlayersCount?gsd.connectedPlayersCount:0):0}</TableCell>
    </TableRow>
  );
}

export default GameServerTableItem;
