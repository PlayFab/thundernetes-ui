import React from "react";
import { TableCell, TableRow } from "@mui/material";

class GameServerTableItem extends React.Component {
    render() {
        return (
            <TableRow>
                <TableCell>{this.props.gs.metadata.name}</TableCell>
                <TableCell>{this.props.gs.metadata.namespace}</TableCell>
                <TableCell>{this.props.gs.status.state}</TableCell>
                <TableCell>{this.props.gs.status.health}</TableCell>
            </TableRow>
        );
    }
}

export default GameServerTableItem;