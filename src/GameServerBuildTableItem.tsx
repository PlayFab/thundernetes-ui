import React from "react";
import { useState } from "react";
import { Box, TableCell, TableRow, IconButton, Collapse, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import GameServerBuildSpec from "./GameServerBuildSpec";
import GameServerTable from "./GameServerTable";

function GameServerBuildTableItem(props: any) {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{props.gsb.metadata.name}</TableCell>
        <TableCell>{props.gsb.metadata.namespace}</TableCell>
        <TableCell>{props.gsb.status.currentStandingByReadyDesired}</TableCell>
        <TableCell>{props.gsb.status.crashesCount}</TableCell>
        <TableCell>{props.gsb.status.health}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 3 }}>
              <Typography variant="h6" gutterBottom component="div">
                Specs
              </Typography>
              <GameServerBuildSpec gsb={props.gsb} />
            </Box>
            <Box sx={{ margin: 3 }}>
              <Typography variant="h6" gutterBottom component="div">
                Game Servers
              </Typography>
              <GameServerTable clusterApi={props.clusterApi} gsb={props.gsb} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default GameServerBuildTableItem;