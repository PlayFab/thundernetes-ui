import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useMemo } from "react";
import GameServerBuildsSummaryItem from "./GameServerBuildsSummaryItem";

interface GameServerBuildsSummaryProps {
  perBuild: Record<string, Record<string, number>>,
  perBuildMetadata: Record<string, Record<string, string>>
}

function GameServerBuildsSummary({ perBuild, perBuildMetadata }: GameServerBuildsSummaryProps) {
  const items = useMemo(() => {
    const keys = Object.keys(perBuild).sort();
    return keys.map((buildName, index) => <GameServerBuildsSummaryItem key={index} buildName={buildName} values={perBuild[buildName]} metadata={perBuildMetadata[buildName]} />);
  }, [perBuild, perBuildMetadata]);

  return (
    <TableContainer component={Paper} sx={{ marginBottom: "40px" }}>
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow>
            <TableCell>Build Name</TableCell>
            <TableCell>StandingBy</TableCell>
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

export default GameServerBuildsSummary;
