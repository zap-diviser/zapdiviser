import { ReactNode } from 'react';

// material-ui
import { Box, Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project-imports
import AuthSlider from './AuthSlider';

interface Props {
  children: ReactNode;
}

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

const AuthWrapper3 = ({ children }: Props) => {
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
            <Grid
              item
              md={7}
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flex: 1,
                padding: 4,
                minHeight: '100vh',
                '& > .MuiPaper-root > .MuiBox-root': { minHeight: '100%', display: 'flex' }
              }}
            >
              {children}
            </Grid>
            <Grid
              item
              md={5}
              sx={{
                display: { xs: 'none', lg: 'flex' },
                width: 580,
                overflow: 'hidden',
                alignSelf: 'stretch',
                position: 'relative',
                bgcolor: theme.palette.primary.main
              }}
            >
              <AuthSlider />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AuthWrapper3;
