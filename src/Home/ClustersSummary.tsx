import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useMemo } from "react";
import ClustersSummaryItem from "./ClustersSummaryItem";

interface ClustersSummaryProps {
  perCluster: Record<string, Record<string, number>>
}

function ClustersSummary({ perCluster }: ClustersSummaryProps) {
  const items = useMemo(() => {
    const keys = Object.keys(perCluster).sort();
    return keys.map((clusterName, index) => <ClustersSummaryItem key={index} clusterName={clusterName} values={perCluster[clusterName]} />);
  }, [perCluster]);

  return (
    <TableContainer component={Paper} sx={{ marginBottom: "40px"}}>
      <Table sx={{ minWidth: 500 }}>
        <TableHead>
          <TableRow>
            <TableCell>Cluster Name</TableCell>
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

export default ClustersSummary;
