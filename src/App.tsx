import { Routes, Route } from 'react-router-dom';
import { Box, Toolbar } from '@mui/material';
import ClusterDetail from './ClusterDetail/ClusterDetail';
import GameServerBuildDetail from './GameServerBuildDetail/GameServerBuildDetail';
import Home from './Home/Home';
import SideMenu from './Common/SideMenu';
import TopAppBar from './Common/TopAppBar';
import clusters from './clusters.json';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <TopAppBar />
      <SideMenu width={200} clusterNames={Object.keys(clusters)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Routes>
          <Route path="/" element={<Home clusters={clusters} />} />
          <Route path=":clusterName" element={<ClusterDetail clusters={clusters} />} />
          <Route path=":clusterName/gsb/create" element={<h2>Create Game Server Build</h2>}/>
          <Route path=":clusterName/gsb/:namespace/:buildName" element={<GameServerBuildDetail clusters={clusters}/>} />
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
