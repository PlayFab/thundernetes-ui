import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useMemo } from "react";
import NodeTableItem from "./NodeTableItem";

interface NodeTableProps {
  nodeData: Record<string, Record<string, number>>
}

function NodeTable({ nodeData }: NodeTableProps) {
  const items = useMemo(() => {
    const nodeNames = Object.keys(nodeData).sort();
    return nodeNames.map((nodeName, index) => <NodeTableItem key={index} nodeName={nodeName} values={nodeData[nodeName]} />);
  }, [nodeData]);

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
