import { Box, Divider, Drawer, List, Toolbar } from '@mui/material';
import { AccountTree, Home } from '@mui/icons-material';
import ListItemLink from './ListItemLink';
import { useMemo } from 'react';

interface SideMenuProps {
  clusters: Record<string, Record<string, string>>
  width: number
}

function SideMenu({ clusters, width }: SideMenuProps) {
  const items = useMemo(() => {
    const clusterNames = clusters ? Object.keys(clusters) : [];
    return clusterNames.map((entry, index) => (
      <ListItemLink key={index} icon={<AccountTree />} to={entry} primary={entry} />
    ))
  }, [clusters]);

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
