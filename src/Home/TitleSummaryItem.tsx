import { TableCell, TableRow } from "@mui/material";

interface TitleSummaryItemProps {
  titleInfo: {
    id: string,
    details: {
        active: number,
        pending: number,
        initializing: number,
        standingBy: number,
        status: "Healthy" | "Unhealthy" | "Unknown"
    }
  }
}

function TitleSummaryItem({ titleInfo }: TitleSummaryItemProps) {
  return (
    <TableRow>
      <TableCell>{titleInfo.id}</TableCell>
      <TableCell>{titleInfo.details.status}</TableCell>
      <TableCell>{titleInfo.details.pending}</TableCell>
      <TableCell>{titleInfo.details.initializing}</TableCell>
      <TableCell>{titleInfo.details.standingBy}</TableCell>
      <TableCell>{titleInfo.details.active}</TableCell>
    </TableRow>
  );
}

export default TitleSummaryItem;
