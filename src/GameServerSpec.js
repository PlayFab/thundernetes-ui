import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";

class GameServerSpec extends React.Component {
    render() {
        return(
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableBody>
                        <TableRow>
                            <TableCell>Build ID</TableCell>
                            <TableCell>{this.props.gsb.spec.buildID}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>StandingBy</TableCell>
                            <TableCell>{this.props.gsb.spec.standingBy}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Max</TableCell>
                            <TableCell>{this.props.gsb.spec.max}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Ports to Expose</TableCell>
                            <TableCell>{this.props.gsb.spec.portsToExpose}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Crashes to mark unhealthy</TableCell>
                            <TableCell>{this.props.gsb.spec.crashesToMarkUnhealthy}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
 }

 export default GameServerSpec;