import React from "react";
import { Box, TableCell, TableRow, IconButton, Collapse, Typography } from "@mui/material";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import GameServerSpec from "./GameServerSpec";
import GameServerTable from "./GameServerTable";

class GameServerBuildTableItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    render() {
        return (
            <React.Fragment>
                <TableRow>
                    <TableCell>
                        <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => this.setState({ open: !this.state.open})}
                        >
                            {this.state.open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                        </IconButton>
                    </TableCell>
                    <TableCell>{this.props.gsb.metadata.name}</TableCell>
                    <TableCell>{this.props.gsb.metadata.namespace}</TableCell>
                    <TableCell>{this.props.gsb.status.currentStandingByReadyDesired}</TableCell>
                    <TableCell>{this.props.gsb.status.crashesCount}</TableCell>
                    <TableCell>{this.props.gsb.status.health}</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                            <Box sx={{ margin: 3 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Specs
                                </Typography>
                                <GameServerSpec gsb={this.props.gsb}></GameServerSpec>
                            </Box>
                            <Box sx={{ margin: 3 }}>
                                <Typography variant="h6" gutterBottom component="div">
                                    Game Servers
                                </Typography>
                                <GameServerTable clusterApi={this.props.clusterApi} gsb={this.props.gsb}></GameServerTable>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
            </React.Fragment>
        );
    }
}

export default GameServerBuildTableItem;