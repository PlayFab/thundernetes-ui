import { Box, Divider, Drawer, List, Toolbar } from '@mui/material';
import { AccountTree, Home } from '@mui/icons-material';
import ListItemLink from './ListItemLink';

interface SideMenuProps {
  clusterNames: Array<string>,
  width: number
}

function SideMenu({ clusterNames, width }: SideMenuProps) {
  return (
    <Drawer
      sx={{
        width: width,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: width,
          boxSizing: 'border-box',
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItemLink icon={<Home />} to={"/"} primary={"Home"} />
        </List>
        <Divider />
        <List>
          {clusterNames.map((entry, index) => (
            <ListItemLink key={index} icon={<AccountTree />} to={entry} primary={entry} />
          ))}
        </List>
      </Box>
    </Drawer>
  );
}

export default SideMenu;
