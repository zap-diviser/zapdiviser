import { ReactNode } from 'react';

// material-ui
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import AuthCard from './AuthCard';

// assets
import AuthSideImg from 'assets/images/auth/img-auth-sideimg.png';

interface Props {
  children: ReactNode;
}

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper2 = ({ children }: Props) => {
  const theme = useTheme();
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Grid
        container
        direction="column"
        justifyContent="center"
        sx={{
          minHeight: '100vh',
          background: theme.palette.background.paper
        }}
      >
        <Grid item xs={12}>
          <Grid
            item
            xs={12}
            container
            justifyContent="center"
            alignItems="center"
            sx={{ minHeight: { xs: 'calc(100vh - 210px)', sm: 'calc(100vh - 134px)', md: 'calc(100vh - 112px)' } }}
          >
            <Grid item md={7} sx={{ display: { xs: 'none', md: 'flex' }, alignSelf: 'center', justifyContent: 'flex-start' }}>
              <img src={AuthSideImg} alt="Authimg" style={{ height: '100vh', minHeight: '100%', width: '100%' }} />
            </Grid>
            <Grid item md={5} sx={{ display: 'flex', justifyContent: 'center' }}>
              <AuthCard border={false}>{children}</AuthCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthWrapper2;
