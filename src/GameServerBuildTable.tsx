import { useEffect, useState } from "react";
import GameServerBuildTableItem from "./GameServerBuildTableItem";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

function GameServerBuildTable(props: any) {
  const [gsbList, setGsbList] = useState([]);

  useEffect(() => {
    fetch(props.clusterApi + "gameserverbuilds")
      .then(response => response.json())
      .then(response => {console.log(response.items); setGsbList(response.items)})
      .catch(err => {console.log(err); setGsbList([])});
  }, [props.clusterApi]);

  let items = gsbList.map((gsb, index) => <GameServerBuildTableItem key={index} clusterApi={props.clusterApi} gsb={gsb} />);
  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Namespace</TableCell>
            <TableCell>Active</TableCell>
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
  );
}

export default GameServerBuildTable;
