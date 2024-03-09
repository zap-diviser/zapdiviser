import { useMemo } from 'react';

// material-ui
import { Theme } from '@mui/material/styles';
import { Box, useMediaQuery } from '@mui/material';

// project-imports
import Search from './Search';
import Message from './Message';
import Profile from './Profile';
import Localization from './Localization';
import Notification from './Notification';
import MobileSection from './MobileSection';
import MegaMenuSection from './MegaMenuSection';

import { useConfig } from 'contexts/ConfigContext';
import DrawerHeader from 'layout/MainLayout/Drawer/DrawerHeader';

// type
import { MenuOrientation } from 'types/config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { i18n, menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const localization = useMemo(() => <Localization />, [i18n]);

  const megaMenu = useMemo(() => <MegaMenuSection />, []);

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open={true} />}
      {/* {!downLG && <Search />} */}
      {/* {!downLG && megaMenu} */}
      {/* {!downLG && localization} */}
      {downLG && <Box sx={{ width: '100%', ml: 'auto' }} />}

      {/* <Notification /> */}
      {/* <Message /> */}
      {/* {!downLG && <Profile />} */}
      {<Profile />}
      {/* {downLG && <MobileSection />} */}
    </>
  );
};

export default HeaderContent;
