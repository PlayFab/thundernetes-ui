import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function ClustersSummaryItem(props: any) {
  return (
    <TableRow>
      <TableCell>{props.clusterName}</TableCell>
      <TableCell>{props.values.standingBy}</TableCell>
      <TableCell>{props.values.active}</TableCell>
    </TableRow>
  );
}

function ClustersSummary(props: any) {
  let items = Object.keys(props.perCluster).map((clusterName) => <ClustersSummaryItem clusterName={clusterName} values={props.perCluster[clusterName]} />);
  return (
    <TableContainer component={Paper} sx={{ marginBottom: "40px"}}>
      <Table sx={{ minWidth: 500 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Cluster Name</TableCell>
            <TableCell>Active</TableCell>
            <TableCell>StandingBy</TableCell>
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
