import { Box, Toolbar } from '@mui/material';
import ClusterDetail from './ClusterDetail';
import SideMenu from './SideMenu';
import TopAppBar from './TopAppBar';

function App() {
  return (
    <Box sx={{ display: 'flex' }}>
      <TopAppBar />
      <SideMenu width={200} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <ClusterDetail clusterApi={process.env.REACT_APP_GAMESERVERAPI_URL} />
      </Box>
    </Box>
  );
}

export default App;
