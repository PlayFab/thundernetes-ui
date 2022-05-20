import { TableCell, TableRow } from "@mui/material";

function GameServerTableItem(props: any) {
  return (
    <TableRow>
      <TableCell>{props.gs.metadata.name}</TableCell>
      <TableCell>{props.gs.metadata.namespace}</TableCell>
      <TableCell>{props.gs.status.state}</TableCell>
      <TableCell>{props.gs.status.health}</TableCell>
    </TableRow>
  );
}

export default GameServerTableItem;
