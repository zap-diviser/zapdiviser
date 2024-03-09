import { Link } from 'react-router-dom';

// material-ui
import { Box, Button, Grid, Stack, Typography } from '@mui/material';

// project-imports
import { APP_DEFAULT_PATH } from 'config';

// assets
import error404 from 'assets/images/maintenance/img-error-404.svg';

// ==============================|| ERROR 404 ||============================== //

function Error404() {
  return (
    <>
      <Grid
        container
        spacing={10}
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh', pt: 2, pb: 1, overflow: 'hidden' }}
      >
        <Grid item xs={12}>
          <Stack direction="row">
            <Grid item>
              <Box sx={{ width: { xs: 250, sm: 590 }, height: { xs: 130, sm: 300 } }}>
                <img src={error404} alt="error 404" style={{ width: '100%', height: '100%' }} />
              </Box>
            </Grid>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="h1">Page Not Found</Typography>
            <Typography color="textSecondary" align="center" sx={{ width: { xs: '73%', sm: '61%' } }}>
              The page you are looking was moved, removed, renamed, or might never exist!
            </Typography>
            <Button component={Link} to={APP_DEFAULT_PATH} variant="contained">
              Back To Home
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default Error404;
