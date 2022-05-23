import React from "react";
import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@mui/material";
import { GameServerBuild } from "./types";

interface GameServerBuildTableItemProps {
  gsb: GameServerBuild
}

function GameServerBuildTableItem({ gsb }: GameServerBuildTableItemProps) {
  return (
    <React.Fragment>
      <TableRow>
        <TableCell><Link to={"gsb/"+gsb.metadata.namespace+"/"+gsb.metadata.name}>{gsb.metadata.name}</Link><br />{gsb.spec.buildID}</TableCell>
        <TableCell>{gsb.metadata.namespace}</TableCell>
        <TableCell>{gsb.status.currentActive?gsb.status.currentActive:0}</TableCell>
        <TableCell>{gsb.status.currentStandingByReadyDesired}</TableCell>
        <TableCell>{gsb.status.crashesCount?gsb.status.crashesCount:0}</TableCell>
        <TableCell>{gsb.status.health}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default GameServerBuildTableItem;
