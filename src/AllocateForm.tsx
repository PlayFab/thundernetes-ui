import { useState } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";

interface AllocateFormProps {
  allocateApi: string,
  buildID: string,
}

function AllocateForm({ allocateApi, buildID }: AllocateFormProps) {
  const [sessionID, setSessionID] = useState("");
  const [assignedIP, setAssignedIP] = useState("");
  const [assignedPorts, setAssignedPorts] = useState("");

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
    }).then(response => response.json())
      .then(response => { setAssignedIP(response.IPV4Address); setAssignedPorts(response.Ports); });
  }

  return (
    <form onSubmit={handleSubmit}>
        <Grid container justifyContent="left" spacing={2} sx={{ flexGrow: 1, marginBottom: "40px" }}>
          <Grid item xs={5}>
            <TextField fullWidth name="sessionID" size="small" label="SessionID" value={sessionID} onChange={handleChange} />
          </Grid>
          <Grid item xs={7}>
            <Button variant="contained" color="primary" type="submit">
              Allocate
            </Button>
          </Grid>
          {(assignedIP && assignedPorts) &&
            <Grid item xs={5}>
              <Typography>IP={assignedIP}, Port={assignedPorts}</Typography>
            </Grid>
          }
        </Grid>
    </form>
  );
}

export default AllocateForm;
