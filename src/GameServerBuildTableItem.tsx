import React from "react";
import { Link } from "react-router-dom";
import { TableCell, TableRow } from "@mui/material";

function GameServerBuildTableItem(props: any) {

  return (
    <React.Fragment>
      <TableRow>
        <TableCell><Link to={"gsb/"+props.gsb.metadata.namespace+"/"+props.gsb.metadata.name}>{props.gsb.metadata.name}</Link><br />{props.gsb.spec.buildID}</TableCell>
        <TableCell>{props.gsb.metadata.namespace}</TableCell>
        <TableCell>{props.gsb.status.currentActive?props.gsb.status.currentActive:0}</TableCell>
        <TableCell>{props.gsb.status.currentStandingByReadyDesired}</TableCell>
        <TableCell>{props.gsb.status.crashesCount?props.gsb.status.crashesCount:0}</TableCell>
        <TableCell>{props.gsb.status.health}</TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default GameServerBuildTableItem;
