import { useEffect, useState } from "react";
import GameServerTableItem from "./GameServerTableItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function GameServerTable(props: any) {
  const [gsList, setGsList] = useState([]);

  useEffect(() => {
    let gsEndpoint = props.clusterApi + "gameserverbuilds/" + props.gsb.metadata.namespace + "/" + props.gsb.metadata.name + "/gameservers"
    fetch(gsEndpoint)
      .then(response => response.json())
      .then(response => setGsList(response.items))
      .catch(err => console.log(err));
  });

  let items = gsList.map((gs, index) => <GameServerTableItem key={index} gs={gs} />);
  return (
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

export default GameServerTable;