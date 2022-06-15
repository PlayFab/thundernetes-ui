import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import NodeTableItem from "./NodeTableItem";

interface NodeTableProps {
  nodeData: Record<string, Record<string, number>>
}

function NodeTable({ nodeData }: NodeTableProps) {
  const nodeNames = Object.keys(nodeData).sort();
  const items = nodeNames.map((nodeName, index) => <NodeTableItem key={index} nodeName={nodeName} values={nodeData[nodeName]}/>);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
          <TableCell>Node name</TableCell>
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

export default NodeTable;
