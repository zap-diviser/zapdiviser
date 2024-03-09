import { cloneElement, ReactElement } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { AppBar, Box, Container, useScrollTrigger } from '@mui/material';

// project-imports
import Navigation from './DrawerContent/Navigation';

import { HEADER_HEIGHT } from 'config';
import { useConfig } from 'contexts/ConfigContext';

// ==============================|| HORIZONTAL MENU LIST ||============================== //

interface ElevationScrollProps {
  children: ReactElement;
  window?: Window | Node;
}

function ElevationScroll({ children, window }: ElevationScrollProps) {
  const theme = useTheme();
  // Note that you normally won't need to set the window ref as useScrollTrigger
  // will default to window.
  // This is only being set here because the demo is in an iframe.
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
    target: window!
  });

  theme.shadows[4] = theme.customShadows.z1;
  theme.shadows[1] = theme.customShadows.z2;

  return cloneElement(children, {
    elevation: trigger ? 4 : 1
  });
}

// ==============================|| HORIZONTAL MENU ||============================== //

const CustomAppBar = () => {
  const theme = useTheme();
  const { container } = useConfig();

  return (
    <ElevationScroll>
      <AppBar
        sx={{
          top: HEADER_HEIGHT,
          height: HEADER_HEIGHT,
          bgcolor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(8px)',
          width: '100%',
          justifyContent: 'center',
          borderTop: `1px solid ${theme.palette.divider}`,
          zIndex: 1098,
          color: theme.palette.secondary.main
        }}
      >
        <Container maxWidth={container ? 'xl' : false}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Navigation />
          </Box>
        </Container>
      </AppBar>
    </ElevationScroll>
  );
};

export default CustomAppBar;
