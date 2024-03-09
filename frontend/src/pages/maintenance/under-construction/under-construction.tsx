import { Link } from 'react-router-dom';

// material-ui
import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material';

// project-imports
import { APP_DEFAULT_PATH } from 'config';

// assets
import construction from 'assets/images/maintenance/img-cunstruct-1.svg';
import constructionBg from 'assets/images/maintenance/img-cunstruct-1-bg.png';
import constructionbottom from 'assets/images/maintenance/img-cunstruct-1-bottom.svg';

// ==============================|| UNDER CONSTRUCTION ||============================== //

function UnderConstruction() {
  return (
    <Box sx={{ minHeight: '100vh', backgroundImage: `url(${constructionBg})`, backgroundSize: '100%', backgroundRepeat: 'no-repeat' }}>
      <Container
        fixed
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Grid
          container
          spacing={3}
          alignItems="center"
          justifyContent="center"
          sx={{
            py: 2,
            backgroundImage: `url(${constructionbottom})`,
            backgroundSize: '100%',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom'
          }}
        >
          <Grid item md={6}>
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
          <Grid item md={6}>
            <Box sx={{ width: { xs: 300, sm: 374 } }}>
              <img src={construction} alt="under construction" style={{ width: '100%', height: 'auto' }} />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default UnderConstruction;
