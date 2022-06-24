import { Box, Divider, Drawer, List, Toolbar } from '@mui/material';
import { AccountTree, Home } from '@mui/icons-material';
import ListItemLink from './ListItemLink';
import { useMemo } from 'react';

interface SideMenuProps {
  clusterNames: Array<string>,
  width: number
}

function SideMenu({ clusterNames, width }: SideMenuProps) {
  const items = useMemo(() => {
    return clusterNames.map((entry, index) => (
      <ListItemLink key={index} icon={<AccountTree />} to={entry} primary={entry} />
    ))
  }, [clusterNames]);

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
          {items}
        </List>
      </Box>
    </Drawer>
  );
}

export default SideMenu;
