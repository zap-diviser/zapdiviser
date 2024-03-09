import { Link } from 'react-router-dom';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project-imports
import { APP_DEFAULT_PATH } from 'config';

// assets
import construction from 'assets/images/maintenance/img-construction-2.svg';

// ==============================|| UNDER CONSTRUCTION ||============================== //

function UnderConstruction() {
  return (
    <Grid container spacing={3} direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', py: 2 }}>
      <Grid item xs={12}>
        <Box sx={{ width: { xs: 300, sm: 374 } }}>
          <img src={construction} alt="under construction" style={{ width: '100%', height: 'auto' }} />
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Stack spacing={2} justifyContent="center" alignItems="center">
          <Typography align="center" variant="h1">
            Under Construction
          </Typography>
          <Typography color="textSecondary" align="center" sx={{ width: '85%' }}>
            Hey! Please check out this site later. We are doing some maintenance on it right now.
          </Typography>
          <Button component={Link} to={APP_DEFAULT_PATH} variant="contained">
            Back To Home
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}

export default UnderConstruction;
