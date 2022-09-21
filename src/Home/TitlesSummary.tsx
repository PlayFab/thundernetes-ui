import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useMemo } from "react";
import TitleSummaryItem from "./TitleSummaryItem";

export interface TitlesDetail {
    [name: string]: {
        active: number,
        standingBy: number,
        pending: number,
        initializing: number,
        status: "Healthy" | "Unhealthy" | "Unknown"
    }
}

export interface TitlesSummaryProps {
    perTitle: TitlesDetail
}

function TitlesSummary({ perTitle }: TitlesSummaryProps) {
    const items = useMemo(() => {
        const keys = Object.keys(perTitle).sort();
        return keys.map((titleId, index) => <TitleSummaryItem key={index} titleInfo={{ id: titleId, details: perTitle[titleId] }} />);
      }, [perTitle]);
    
    return (
        <TableContainer component={Paper} sx={{ marginBottom: "40px" }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow>
                <TableCell>Title ID</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Pending</TableCell>
                <TableCell>Initializing</TableCell>
                <TableCell>Standing By</TableCell>
                <TableCell>Active</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items}  
            </TableBody>
          </Table>
        </TableContainer>
      );
}


export default TitlesSummary;