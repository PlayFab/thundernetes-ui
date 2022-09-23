import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Collapse } from "@mui/material";
import { useMemo, useState } from "react";
import NodeMetricsSummary from "./NodeMetricsSummary";
import NodeTableItem from "./NodeTableItem";

interface NodeTableProps {
  nodeData: Record<string, Record<string, number>>
}

interface NodeMetricsInfo {
  name: string,
  metrics: {
    [name: string]: number
  }
};

function NodeTable({ nodeData }: NodeTableProps) {
  const [selectedNode, setSelectedNode] = useState<NodeMetricsInfo | undefined>(undefined);

  const items = useMemo(() => {
    const nodeNames = Object.keys(nodeData).sort();
    const toggleSelectedNode = (nodeToggled: string, data: Record<string, number>) => {
      if (selectedNode && nodeToggled === selectedNode.name) {
        setSelectedNode(undefined);
        return;
      }
      setSelectedNode({ name: nodeToggled, metrics: data });
    }

    return nodeNames.map((nodeName, index) => <NodeTableItem 
                                                key={index} 
                                                selectedNode={selectedNode?.name} 
                                                onNodeSelected={toggleSelectedNode} 
                                                nodeName={nodeName} 
                                                values={nodeData[nodeName]} />);
  }, [nodeData, selectedNode]);

  return (
    <>
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
      <Collapse unmountOnExit in={!!selectedNode}>
        {selectedNode && <NodeMetricsSummary 
          name={selectedNode.name} 
          allocation={selectedNode.metrics.active === 0 && selectedNode.metrics.standingBy === 0 ? 0 : (selectedNode.metrics.active*100)/(selectedNode.metrics.active + selectedNode.metrics.standingBy)}
          />}
      </Collapse>
    </>
  );
}

export default NodeTable;
