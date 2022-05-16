import './App.css';
import React from 'react';
import { AppBar, Typography } from '@mui/material';
import GameServerBuildTable from './GameServerBuildTable';

function App() {
  return (
    <React.Fragment>
      <AppBar position="static" sx={{ minHeight: "50px" }}>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, marginTop: "5px", marginLeft: "20px" }}>
          Thundernetes Control Panel
        </Typography>
      </AppBar>
      <div className="App">
        <GameServerBuildTable clusterApi={process.env.REACT_APP_GAMESERVERAPI_URL} />
      </div>
    </React.Fragment>
  );
}

export default App;
