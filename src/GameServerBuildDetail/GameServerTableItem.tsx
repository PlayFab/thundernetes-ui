import React, { useState } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TableCell, TableRow } from "@mui/material";
import { GameServer } from "../types";
import { DeleteOutline } from "@mui/icons-material";
import { fetchWithTimeout } from "../utils";

interface GameServerTableItemProps {
  clusterApi: string,
  gs: GameServer,
  gsd: Record<string, number>
}

function GameServerTableItem({ clusterApi, gs, gsd }: GameServerTableItemProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();

  const deleteGameServer = () => {
    fetchWithTimeout(clusterApi + "gameservers/" + gs.metadata.namespace + "/" + gs.metadata.name, {
      timeout: 5000,
      method: "DELETE"
    }).then(response => {
      if (response.status === 200) {
        setOpen(false);
      } else {
        setError("API denied the request: " + response.statusText);
      }
    }).catch(err => {
      setError("Couldn't reach API at: " + clusterApi);
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(undefined);
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{gs.metadata.name}</TableCell>
        <TableCell>{gs.metadata.namespace}</TableCell>
        <TableCell>{gs.status.health}</TableCell>
        <TableCell>{gs.status.state}</TableCell>
        <TableCell>{gs.status.publicIP}</TableCell>
        <TableCell>{gs.status.ports}</TableCell>
        <TableCell>{gsd ? (gsd.connectedPlayersCount ? gsd.connectedPlayersCount : 0) : 0}</TableCell>
        <TableCell>
          <IconButton color="error" component="span" onClick={handleClickOpen}>
            <DeleteOutline />
          </IconButton>
        </TableCell>
      </TableRow>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        {!error &&
          <React.Fragment>
            <DialogTitle id="alert-dialog-title">
              {"Delete a Game Server Build?"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {"Are you sure you want to delete " + gs.metadata.name + "?"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>No</Button>
              <Button onClick={deleteGameServer}>Yes</Button>
            </DialogActions>
          </React.Fragment>
        }
        {error &&
          <React.Fragment>
            <DialogTitle id="alert-dialog-title">
              {"Delete request failed"}
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                {error}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Close</Button>
            </DialogActions>
          </React.Fragment>
        }
      </Dialog>
    </React.Fragment>
  );
}

export default GameServerTableItem;
