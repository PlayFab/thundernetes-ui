import { TableCell, TableRow } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface GameServerBuildsSummaryItemProps {
  buildName: string,
  values: Record<string, number>,
  metadata: Record<string, string>,
}

function GameServerBuildsSummaryItem({ buildName, values, metadata }: GameServerBuildsSummaryItemProps) {
  const navigate = useNavigate();
  return (
    <TableRow onClick={() => navigate(metadata.clusterName + "/gsb/" + metadata.namespace + "/" + buildName)} hover style={{cursor: 'pointer'}}>
      <TableCell>{buildName}</TableCell>
      <TableCell>{metadata.clusterName}</TableCell>
      <TableCell>{values.standingBy}</TableCell>
      <TableCell>{values.active}</TableCell>
    </TableRow>
  );
}

export default GameServerBuildsSummaryItem;
