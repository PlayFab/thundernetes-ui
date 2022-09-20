import { TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface ClustersSummaryItemProps {
  clusterName: string,
  values: Record<string, number>
}
function ClustersSummaryItem({ clusterName, values }: ClustersSummaryItemProps) {
  const navigate = useNavigate();
  return (
    <TableRow onClick={() => navigate(clusterName)} hover style={{cursor: 'pointer'}}>
      <TableCell>{clusterName}</TableCell>
      <TableCell>{values.standingBy}</TableCell>
      <TableCell>{values.active}</TableCell>
    </TableRow>
  );
}

export default ClustersSummaryItem;
