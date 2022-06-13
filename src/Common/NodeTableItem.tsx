import { TableCell, TableRow } from "@mui/material";

interface NodeTableItemProps {
  nodeName: string,
  values: Record<string, number>
}

function NodeTableItem({ nodeName, values }: NodeTableItemProps) {
  return (
    <TableRow>
        <TableCell>{nodeName}</TableCell>
        <TableCell>{values.active}</TableCell>
        <TableCell>{values.standingBy}</TableCell>
      </TableRow>
  );
}

export default NodeTableItem;
