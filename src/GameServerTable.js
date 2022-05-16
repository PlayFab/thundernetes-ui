import React from "react";
import GameServerTableItem from "./GameServerTableItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

class GameServerTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = { gsList: [] };
    }

    componentDidMount() {
        var gsEndpoint = this.props.clusterApi + "gameserverbuilds/"+this.props.gsb.metadata.namespace+"/"+this.props.gsb.metadata.name+"/gameservers"
        fetch(gsEndpoint)
            .then(response => response.json())
            .then(response => {this.setState({ gsList: response.items }); console.log(response.items);})
            .catch(err => console.log(err))
    }

    render() {
        var items =  this.state.gsList.map((gs, index) => <GameServerTableItem key={index} gs={gs}/>);
        return(
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 500 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Namespace</TableCell>
                            <TableCell>State</TableCell>
                            <TableCell>Health</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    }
 }

 export default GameServerTable;