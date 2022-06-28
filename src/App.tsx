import { Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import ClusterDetail from './ClusterDetail/ClusterDetail';
import ErrorBoundary from './Common/ErrorBoundary';
import GameServerBuildCreate from './GameServerBuildCreate/GameServerBuildCreate';
import GameServerBuildDetail from './GameServerBuildDetail/GameServerBuildDetail';
import Home from './Home/Home';
import SideMenu from './Common/SideMenu';
import TopAppBar from './Common/TopAppBar';

declare global {
  interface Window { clusters: any; }
}

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <TopAppBar />
      <SideMenu width={200} clusters={window.clusters} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home clusters={window.clusters} />} />
          <Route path=":clusterName" element={<ClusterDetail clusters={window.clusters} />} />
          <Route path=":clusterName/gsb/create" element={<GameServerBuildCreate clusters={window.clusters}/>}/>
          <Route path=":clusterName/gsb/:namespace/:buildName" element={<GameServerBuildDetail clusters={window.clusters}/>} />
        </Routes>
        </ErrorBoundary>
      </Box>
    </Box>
  );
}

export default App;
