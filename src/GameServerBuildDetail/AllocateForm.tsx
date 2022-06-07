import { useState } from "react";
import { Alert, Box, Button, Grid, TextField, Typography } from "@mui/material";
import { Done } from "@mui/icons-material";

interface AllocateFormProps {
  allocateApi: string,
  buildID: string,
}

function AllocateForm({ allocateApi, buildID }: AllocateFormProps) {
  const [sessionID, setSessionID] = useState("");
  const [assignedIP, setAssignedIP] = useState("");
  const [assignedPorts, setAssignedPorts] = useState("");
  const [allocateError, setAllocateError] = useState<Error>();
  const [requestAccepted, setRequestAccepted] = useState<boolean>();

  const handleChange = (event: any) => {
    if (event.target.name === "sessionID") {
      setSessionID(event.target.value);
    }
  }

  const handleSubmit = (event: any) => {
    event.preventDefault();
    const body = {
      sessionID: sessionID,
      buildID: buildID
    }
    fetch(allocateApi, {
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
        setRequestAccepted(false);
        return undefined;
      }
    }).then(response => {
      if (response) {
        setAssignedIP(response.IPV4Address);
        setAssignedPorts(response.Ports);
      }
    }).catch(err => {
      setAllocateError(err);
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
        {(!allocateError && !requestAccepted && assignedIP && assignedPorts) &&
          <Grid item xs={12}>
            <Typography>IP={assignedIP}, Port={assignedPorts}</Typography>
          </Grid>
        }
        {(allocateError) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="left">
              <Alert severity="error" onClose={() => { setAllocateError(undefined) }}>
                {"Couldn't reach allocation endpoint at: " + allocateApi}
              </Alert>
            </Box>
          </Grid>
        }
        {(!requestAccepted && requestAccepted !== undefined) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="left">
              <Alert severity="error" onClose={() => { setRequestAccepted(undefined) }}>
                {"Allocation endpoint denied the request at: " + allocateApi}
              </Alert>
            </Box>
          </Grid>
        }
      </Grid>
    </form>
  );
}

export default AllocateForm;
