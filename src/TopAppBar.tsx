import { AppBar, Toolbar, Typography } from "@mui/material";

function TopAppBar () {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h5" component="div" sx={{ flexGrow: 1, marginTop: "5px", marginLeft: "20px" }}>
          Thundernetes Control Panel
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopAppBar;
