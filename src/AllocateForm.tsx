import { useState } from "react";
import { Box, Button, Chip, Grid, Stack, TextField, Typography } from "@mui/material";

interface AllocateFormProps {
  allocateApi: string,
  buildID: string,
}

function AllocateForm({ allocateApi, buildID }: AllocateFormProps) {
  const [sessionID, setSessionID] = useState("");
  const [assignedIP, setAssignedIP] = useState("");
  const [assignedPorts, setAssignedPorts] = useState("");
  const [allocateError, setAllocateError] = useState<Error>();
  const [requestDenied, setRequestDenied] = useState(false);

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
        return response.json();
      } else {
        setRequestDenied(true);
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
        <Grid item xs={7}>
          <Button variant="contained" color="primary" type="submit">
            Allocate
          </Button>
        </Grid>
        {(!allocateError && !requestDenied &&assignedIP && assignedPorts) &&
          <Grid item xs={12}>
            <Typography>IP={assignedIP}, Port={assignedPorts}</Typography>
          </Grid>
        }
        {(allocateError) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="left">
              <Stack direction="column">
                <Chip color="error" sx={{ marginBottom: "5px" }} variant="outlined"
                  label={"Couldn't reach allocation endpoint at: " + allocateApi} />
              </Stack>
            </Box>
          </Grid>
        }
        {(requestDenied) &&
          <Grid item xs={12}>
            <Box display="flex" justifyContent="left">
              <Stack direction="column">
                <Chip color="error" sx={{ marginBottom: "5px" }} variant="outlined"
                  label={"Allocation endpoint denied the request at: " + allocateApi} />
              </Stack>
            </Box>
          </Grid>
        }
      </Grid>
    </form>
  );
}

export default AllocateForm;
