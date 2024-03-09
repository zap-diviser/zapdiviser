import { Link } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Grid, Stack, Typography, useMediaQuery } from '@mui/material';

// project-imports
import { APP_DEFAULT_PATH } from 'config';

// assets
import error500 from 'assets/images/maintenance/img-error-500.svg';

// ==============================|| ERROR 500 ||============================== //

function Error500() {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <>
      <Grid container direction="column" alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }} spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ width: 325 }}>
            <img src={error500} alt="error 500" style={{ height: '100%', width: '100%' }} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Stack justifyContent="center" alignItems="center">
            <Typography align="center" variant={matchDownSM ? 'h2' : 'h1'}>
              Internal Server Error
            </Typography>
            <Typography color="textSecondary" variant="body2" align="center" sx={{ width: { xs: '73%', sm: '70%' }, mt: 1 }}>
              Server error 500. we fixing the problem. please try again at a later stage.
            </Typography>
            <Button component={Link} to={APP_DEFAULT_PATH} variant="contained" sx={{ textTransform: 'none', mt: 4 }}>
              Back To Home
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default Error500;
