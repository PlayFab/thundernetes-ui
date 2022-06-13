import { TableCell, TableRow } from "@mui/material";

interface GameServerBuildsSummaryItemProps {
  buildName: string,
  values: Record<string, number>
}

function GameServerBuildsSummaryItem({ buildName, values }: GameServerBuildsSummaryItemProps) {
  return (
    <TableRow>
      <TableCell>{buildName}</TableCell>
      <TableCell>{values.standingBy}</TableCell>
      <TableCell>{values.active}</TableCell>
    </TableRow>
  );
}

export default GameServerBuildsSummaryItem;
