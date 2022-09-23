import { Box, Chip, TableCell, TableRow } from "@mui/material";
import React from "react";

interface NodeTableItemProps {
  nodeName: string,
  values: Record<string, number>,
  selectedNode?: string,
  onNodeSelected: (name: string, data: Record<string, number>) => void
}


function NodeTableItem({ nodeName, values, onNodeSelected, selectedNode }: NodeTableItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);
  return (
    <TableRow sx={[{ '&:hover': { cursor: 'pointer' } }]} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} hover selected={nodeName === selectedNode} onClick={() => onNodeSelected(nodeName, values)}>

      <TableCell style={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            display: 'grid',
            gap: 0,
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <span style={{ marginRight: '5px' }}>{nodeName}</span>
          { (isHovered || nodeName === selectedNode) && <Chip sx={{ fontSize: 'x-small', '&:hover': { cursor: 'pointer' } }} label="View Metrics" size="small" />} 
        </Box>
      </TableCell> 
        <TableCell>{values.active}</TableCell>
        <TableCell>{values.standingBy}</TableCell>
      </TableRow>
  );
}

export default NodeTableItem;
