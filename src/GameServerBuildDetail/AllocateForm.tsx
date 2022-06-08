import React, { useState } from "react";
import { Alert, Box, Button, Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { ContentCopy, Done } from "@mui/icons-material";
import { fetchWithTimeout } from "../utils";

interface AllocateFormProps {
  allocateApi: string,
  buildID: string,
}

function AllocateForm({ allocateApi, buildID }: AllocateFormProps) {
  const [sessionID, setSessionID] = useState("");
  const [assignedIP, setAssignedIP] = useState("");
  const [assignedPorts, setAssignedPorts] = useState("");
  const [error, setError] = useState<string>();
  const [requestAccepted, setRequestAccepted] = useState<boolean>();

  const handleChange = (event: any) => {
    if (event.target.name === "sessionID") {
      setSessionID(event.target.value);
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    setError(undefined);
    setRequestAccepted(undefined);
    setAssignedIP("");
    setAssignedPorts("");
    if (!sessionID) {
      setError("Session ID cannot be empty");
      return;
    }
    const body = {
      sessionID: sessionID,
      buildID: buildID
    }
    fetchWithTimeout(allocateApi, {
      timeout: 5000,
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }).then(response => {
      if (response.status === 200) {
        setRequestAccepted(true);
        return response.json();
      } else {
        setError("API denied the request: " + response.text());
        return undefined;
      }
    }).then(response => {
      if (response && response.IPV4Address && response.Ports) {
        setAssignedIP(response.IPV4Address);
        setAssignedPorts(response.Ports);
      }
    }).catch(err => {
      setError("Couldn't reach API at: " + allocateApi);
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent="left" spacing={2} sx={{ flexGrow: 1, marginBottom: "40px" }}>
        <Grid item xs={5}>
          <TextField fullWidth name="sessionID" size="small" label="SessionID" value={sessionID} onChange={handleChange} />
        </Grid>
        <Grid item xs={1}>
          <Button sx={{ paddingLeft: "8px", paddingRight: "8px" }} variant="contained" color="primary" onClick={() => setSessionID(crypto.randomUUID())}>
            {"New ID"}
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="contained" color="primary" type="submit">
            Allocate
          </Button>
        </Grid>
        {(requestAccepted) &&
          <Grid item xs={1}>
            <Done color="success" sx={{ marginTop: "5px" }} />
          </Grid>
        }
        <Grid item xs={4} />
        {(!error && assignedIP && assignedPorts) &&
          <React.Fragment>
            <Grid item xs={3}>
              <TextField
                fullWidth
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={"Copy value"} placement="right">
                        <IconButton
                          edge="end"
                          onClick={() => navigator.clipboard.writeText(assignedIP)}
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                name="assignedIP"
                size="small"
                label="Assigned IP"
                value={assignedIP}
              />
            </Grid>
            <Grid item xs={2}>
              <TextField
                fullWidth
                disabled
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={"Copy value"} placement="right">
                        <IconButton
                          edge="end"
                          onClick={() => navigator.clipboard.writeText(assignedPorts)}
                        >
                          <ContentCopy />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
                name="assignedPorts"
                size="small"
                label="Assigned Ports"
                value={assignedPorts}
              />
            </Grid>
            <Grid item xs={7} />
          </React.Fragment>
        }
        {(error) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="left">
              <Alert severity="error" onClose={() => { setError(undefined) }}>
                {error}
              </Alert>
            </Box>
          </Grid>
        }
      </Grid>
    </form>
  );
}

export default AllocateForm;
