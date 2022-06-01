import { styled } from '@mui/material/styles';
import { Box, Grid, Paper, Typography } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.primary,
}));

interface TotalSummaryProps {
  total: Record<string, number>
}

function TotalSummary({ total }: TotalSummaryProps) {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: "40px" }}>
      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={4}>
          <Item>
            <Typography>Total Standing By<br/>{total.standingBy}</Typography>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <Typography>Total Active<br/>{total.active}</Typography>
          </Item>
        </Grid>
      </Grid>
    </Box>
  );
}

export default TotalSummary;
