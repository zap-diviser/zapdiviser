// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Grid, Stack, TextField, Typography } from '@mui/material';

// project-imports
import IconButton from 'components/@extended/IconButton';

// assets
import { Facebook, Google, Notification } from 'iconsax-react';
import coming1 from 'assets/images/maintenance/img-soon-1-1.png';
import coming2 from 'assets/images/maintenance/img-soon-1-2.png';
import AuthBackground from 'assets/images/auth/AuthBackground';

// ==============================|| COMING SOON ||============================== //

function ComingSoon() {
  const theme = useTheme();

  return (
    <>
      <AuthBackground />
      <Container fixed>
        <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ minHeight: '100vh' }}>
          <Grid item md={6}>
            <Box sx={{ width: { xs: 380, md: 570 }, margin: '0 auto' }}>
              <Grid container spacing={3} direction="column">
                <Grid item xs={12}>
                  <Stack spacing={3}>
                    <Typography variant="h4">Coming Soon</Typography>
                    <Typography variant="h2">
                      <Box sx={{ color: theme.palette.primary.main, display: 'inline-block' }}>Able Pro</Box> - The Bootstrap Admin Template
                    </Typography>
                    <Typography color="textSecondary">
                      Presenting Material-UI based React Dashboard Template to build performance centric websites and applications.
                    </Typography>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ width: { xs: 320, md: 380 } }}>
                  <Stack spacing={3} sx={{ mt: 2 }}>
                    <Stack direction="row" spacing={1}>
                      <TextField fullWidth placeholder="Email Address" />
                      <Button variant="contained" sx={{ width: '50%' }} startIcon={<Notification variant="Bold" />}>
                        Notify Me
                      </Button>
                    </Stack>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <IconButton shape="rounded" color="secondary">
                        <Facebook variant="Bulk" size={20} />
                      </IconButton>
                      <IconButton shape="rounded" color="secondary">
                        <Google variant="Bulk" size={20} />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid item md={6}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: { xs: 360, sm: 'auto' } }}>
              <img src={coming1} alt="coming soon 1" />
              <img src={coming2} alt="coming soon 1" />
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ComingSoon;
