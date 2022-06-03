import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import ClustersSummaryItem from "./ClustersSummaryItem";

interface ClustersSummaryProps {
  perCluster: Record<string, Record<string, number>>
}

function ClustersSummary({ perCluster }: ClustersSummaryProps) {
  let keys = Object.keys(perCluster).sort();
  let items = keys.map((clusterName, index) => <ClustersSummaryItem key={index} clusterName={clusterName} values={perCluster[clusterName]} />);
  return (
    <TableContainer component={Paper} sx={{ marginBottom: "40px"}}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
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
