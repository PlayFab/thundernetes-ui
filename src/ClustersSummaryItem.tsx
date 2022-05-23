import { TableCell, TableRow } from "@mui/material";

interface ClustersSummaryItemProps {
  clusterName: string,
  values: Record<string, number>
}

function ClustersSummaryItem({ clusterName, values }: ClustersSummaryItemProps) {
  return (
    <TableRow>
      <TableCell>{clusterName}</TableCell>
      <TableCell>{values.standingBy}</TableCell>
      <TableCell>{values.active}</TableCell>
    </TableRow>
  );
}

export default ClustersSummaryItem;
