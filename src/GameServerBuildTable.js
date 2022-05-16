import React from "react";
import "./GameServerBuildTable.css"
import GameServerBuildTableItem from "./GameServerBuildTableItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

class GameServerBuildTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gsbList: [] };
    }

    componentDidMount() {
        fetch(this.props.clusterApi + "gameserverbuilds")
            .then(response => response.json())
            .then(response => {this.setState({ gsbList: response.items }); console.log(response.items);})
            .catch(err => console.log(err))
    }

    render() {
        let items = this.state.gsbList.map((gsb, index) => <GameServerBuildTableItem key={index} clusterApi={this.props.clusterApi} gsb={gsb}/> )
        return (
            <div className="GameServerBuildTable">
                <Typography variant="h6" gutterBottom component="div">
                    Game Server Builds
                </Typography>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Name</TableCell>
                                <TableCell>Namespace</TableCell>
                                <TableCell>StandingBy</TableCell>
                                <TableCell>Crashes</TableCell>
                                <TableCell>Health</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        );
    }
}

export default GameServerBuildTable;