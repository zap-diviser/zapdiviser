import { ReactNode, useMemo } from 'react';

// material-ui
import { alpha, useTheme } from '@mui/material/styles';
import { AppBar, Toolbar, useMediaQuery, AppBarProps } from '@mui/material';

import AppBarStyled from './AppBarStyled';
import HeaderContent from './HeaderContent';
import IconButton from 'components/@extended/IconButton';

import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from 'config';
import { useConfig } from 'contexts/ConfigContext';
import { dispatch, useSelector } from 'store';
import { openDrawer } from 'store/reducers/menu';

import { HambergerMenu } from 'iconsax-react';
import { MenuOrientation, ThemeMode } from 'types/config';

// ==============================|| MAIN LAYOUT - HEADER ||============================== //

const Header = () => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  const { menuOrientation } = useConfig();
  const { drawerOpen } = useSelector((state) => state.menu);

  const isHorizontal = menuOrientation === MenuOrientation.HORIZONTAL && !downLG;

  // header content
  const headerContent = useMemo(() => <HeaderContent />, []);

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'secondary.200' : 'secondary.200';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'secondary.100';

  // common header
  const mainHeader: ReactNode = (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 4.5, lg: 8 } }}>
        {!isHorizontal ? (
          <IconButton
            aria-label="open drawer"
            onClick={() => dispatch(openDrawer(!drawerOpen))}
            edge="start"
            color="secondary"
            variant="light"
            size="large"
            sx={{ color: 'secondary.main', bgcolor: drawerOpen ? iconBackColorOpen : iconBackColor, ml: { xs: 0, lg: -2 }, p: 1 }}
          >
            <HambergerMenu />
          </IconButton>
        ) : null}
        {headerContent}
      </Toolbar>
    </div>
  );

  // app-bar params
  const appBar: AppBarProps = {
    position: 'fixed',
    elevation: 0,
    sx: {
      bgcolor: alpha(theme.palette.background.default, 0.8),
      backdropFilter: 'blur(8px)',
      zIndex: 1200,
      width: isHorizontal
        ? '100%'
        : { xs: '100%', lg: drawerOpen ? `calc(100% - ${DRAWER_WIDTH}px)` : `calc(100% - ${MINI_DRAWER_WIDTH}px)` }
    }
  };

  return (
    <>
      {!downLG ? (
        <AppBarStyled open={drawerOpen} {...appBar}>
          {mainHeader}
        </AppBarStyled>
      ) : (
        <AppBar {...appBar}>{mainHeader}</AppBar>
      )}
    </>
  );
};

export default Header;
