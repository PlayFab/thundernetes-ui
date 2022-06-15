import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TableCell, TableRow } from "@mui/material";
import { GameServerBuild } from "../types";
import { DeleteOutline } from "@mui/icons-material";
import { fetchWithTimeout } from "../utils";

interface GameServerBuildTableItemProps {
  clusterApi: string
  gsb: GameServerBuild
}

function GameServerBuildTableItem({ clusterApi, gsb }: GameServerBuildTableItemProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string>();

  const deleteGameServerBuild = () => {
    fetchWithTimeout(clusterApi + "gameserverbuilds/" + gsb.metadata.namespace + "/" + gsb.metadata.name, {
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
    setError(undefined);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <TableRow>
        <TableCell><Link to={"gsb/" + gsb.metadata.namespace + "/" + gsb.metadata.name}>{gsb.metadata.name}</Link><br />{gsb.spec.buildID}</TableCell>
        <TableCell>{gsb.metadata.namespace}</TableCell>
        <TableCell>{gsb.status.currentActive ? gsb.status.currentActive : 0}</TableCell>
        <TableCell>{gsb.status.currentStandingByReadyDesired}</TableCell>
        <TableCell>{gsb.status.crashesCount ? gsb.status.crashesCount : 0}</TableCell>
        <TableCell>{gsb.status.health}</TableCell>
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
                {"Are you sure you want to delete " + gsb.metadata.name + "?"}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>No</Button>
              <Button onClick={deleteGameServerBuild}>Yes</Button>
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

export default GameServerBuildTableItem;
