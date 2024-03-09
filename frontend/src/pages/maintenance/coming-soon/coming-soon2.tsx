// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, Container, Grid, Stack, TextField, Typography, useMediaQuery } from '@mui/material';

// third-party
import { useTimer } from 'react-timer-hook';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';

// assets
import { Facebook, Google, Notification } from 'iconsax-react';
import coming from 'assets/images/maintenance/img-soon-2.svg';

// ==============================|| COMING SOON ||============================== //

const TimerBox = ({ count, label }: { count: number; label: string }) => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <MainCard content={false} sx={{ width: { xs: 60, sm: 80 } }}>
      <Stack justifyContent="center" alignItems="center">
        <Box sx={{ py: 1.75 }}>
          <Typography variant={matchDownSM ? 'h4' : 'h2'}>{count}</Typography>
        </Box>
      </Stack>
    </MainCard>
  );
};

function ComingSoon() {
  const time = new Date();
  time.setSeconds(time.getSeconds() + 3600 * 24 * 2 - 3600 * 15.5);

  const { seconds, minutes, hours, days } = useTimer({ expiryTimestamp: time });

  return (
    <>
      <Container fixed>
        <Grid container spacing={4} alignItems="center" justifyContent="center" sx={{ minHeight: '100vh', py: 2 }}>
          <Grid item md={6}>
            <Box sx={{ height: { xs: 310, sm: 420 }, width: { xs: 360, sm: 'auto' } }}>
              <img src={coming} alt="coming soon 1" style={{ height: '100%', width: '100%' }} />
            </Box>
          </Grid>
          <Grid item md={6}>
            <Grid container spacing={3} direction="column" alignItems="center">
              <Grid item xs={12}>
                <Stack spacing={1} justifyContent="center" alignItems="center">
                  <Typography align="center" variant="h1">
                    Coming Soon
                  </Typography>
                  <Typography align="center" color="textSecondary">
                    Something new is on its way
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={{ xs: 1, sm: 2 }}>
                  <TimerBox count={days} label="day" />
                  <TimerBox count={hours} label="hour" />
                  <TimerBox count={minutes} label="min" />
                  <TimerBox count={seconds} label="sec" />
                </Stack>
              </Grid>
              <Grid item xs={12} sx={{ width: { xs: 380, md: 380, lg: 380 } }}>
                <Stack spacing={3} sx={{ mt: 2 }}>
                  <Stack direction="row" spacing={1}>
                    <TextField fullWidth placeholder="Email Address" />
                    <Button variant="contained" sx={{ width: '50%' }} startIcon={<Notification variant="Bold" />}>
                      Notify Me
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
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
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ComingSoon;
