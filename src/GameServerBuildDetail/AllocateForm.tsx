import React, { ChangeEvent, FormEvent, useCallback, useState } from "react";
import { Alert, Box, Button, Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { ContentCopy } from "@mui/icons-material";
import { fetchWithTimeout } from "../utils";
import { v4 as uuidv4 } from 'uuid';

interface AllocateFormProps {
  allocateApi: string,
  buildID: string,
}

function AllocateForm({ allocateApi, buildID }: AllocateFormProps) {
  const [sessionID, setSessionID] = useState("");
  const [assignedIP, setAssignedIP] = useState("");
  const [assignedPorts, setAssignedPorts] = useState("");
  const [error, setError] = useState<string>();

  const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === "sessionID") {
      setSessionID(event.target.value);
    }
  }, []);

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
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
        return response.json();
      } else {
        setError("API denied the request: " + response.statusText);
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
  }, [allocateApi, buildID, sessionID]);

  return (
    <form onSubmit={handleSubmit}>
      <Grid container justifyContent="left" alignItems="center" spacing={2} sx={{ flexGrow: 1, marginBottom: "40px" }}>
        <Grid item xs={4}>
          <TextField fullWidth name="sessionID" size="small" label="SessionID" value={sessionID} onChange={handleChange} />
        </Grid>
        <Grid item xs={1}>
          <Button sx={{ paddingLeft: "8px", paddingRight: "8px" }} variant="contained" color="primary" onClick={() => setSessionID(uuidv4())}>
            New ID
          </Button>
        </Grid>
        <Grid item xs={2}>
          <Button variant="contained" color="primary" type="submit">
            Allocate
          </Button>
        </Grid>
        <Grid item xs={5} />
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
