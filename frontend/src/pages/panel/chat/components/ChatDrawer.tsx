import { useState, ChangeEvent, MouseEvent } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Chip,
  Drawer,
  InputAdornment,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery
} from '@mui/material';

import UserList from './UserList';
import MainCard from 'components/MainCard';
import SimpleBar from 'components/third-party/SimpleBar';

// types
import { UserProfile } from 'types/user-profile';

// assets
import { SearchNormal1 } from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import { useSuspenseQuery } from '@tanstack/react-query';

// ==============================|| CHAT - DRAWER ||============================== //

interface ChatDrawerProps {
  handleDrawerOpen: () => void;
  openChatDrawer: boolean | undefined;
  setUser: (u: UserProfile) => void;
}

function ChatDrawer({ handleDrawerOpen, openChatDrawer, setUser }: ChatDrawerProps) {
  const theme = useTheme();

  const { data: whatapps } = useSuspenseQuery({
    queryKey: ['whatsapp', 'all'],
    queryFn: async () => {
      const response = await fetch('/api/whatsapp');
      return response.json();
    },
  })

  const matchDownLG = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerBG = theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'white';

  // show menu to set current user status
  const [anchorEl, setAnchorEl] = useState<Element | (() => Element) | null | undefined>();
  const handleClickRightMenu = (event: MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleCloseRightMenu = () => {
    setAnchorEl(null);
  };

  // set user status on status menu click
  const [status, setStatus] = useState('available');
  const handleRightMenuItemClick = (userStatus: string) => () => {
    setStatus(userStatus);
    handleCloseRightMenu();
  };

  const [search, setSearch] = useState<string | undefined>('');
  const handleSearch = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | undefined) => {
    const newString = event?.target.value;
    setSearch(newString);
  };

  return (
    <Drawer
      sx={{
        width: 320,
        flexShrink: 0,
        zIndex: { xs: 1200, lg: 0 },
        '& .MuiDrawer-paper': {
          height: matchDownLG ? '100%' : 'auto',
          width: 320,
          boxSizing: 'border-box',
          position: 'relative',
          border: 'none',
          ...(!matchDownLG && {
            borderRadius: '12px 0 0 12px'
          })
        }
      }}
      variant={matchDownLG ? 'temporary' : 'persistent'}
      anchor="left"
      open={openChatDrawer}
      ModalProps={{ keepMounted: true }}
      onClose={handleDrawerOpen}
    >
      <MainCard
        sx={{
          bgcolor: matchDownLG ? 'transparent' : drawerBG,
          borderRadius: '12px 0 0 12px',
          borderRight: 'none',
        }}
        border={!matchDownLG}
        content={false}
      >
        <Box sx={{ p: 3, pb: 1 }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="h5" color="inherit">
                Mensagens
              </Typography>
              <Chip
                label="9"
                component="span"
                color={theme.palette.mode === ThemeMode.DARK ? 'default' : 'secondary'}
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  '& .MuiChip-label': {
                    px: 0.5
                  }
                }}
              />
            </Stack>

            <OutlinedInput
              fullWidth
              id="input-search-header"
              placeholder="Pesquisar"
              value={search}
              onChange={handleSearch}
              sx={{
                '& .MuiOutlinedInput-input': {
                  p: '10.5px 0px 12px'
                }
              }}
              startAdornment={
                <InputAdornment position="start">
                  <SearchNormal1 style={{ fontSize: 'small' }} />
                </InputAdornment>
              }
            />
          </Stack>
        </Box>

        <SimpleBar
          sx={{
            overflowX: 'hidden',
            height: matchDownLG ? 'calc(100vh - 120px)' : 'calc(100vh - 428px)'
            // minHeight: matchDownLG ? 0 : 420
          }}
        >
          <Box sx={{ p: 3, pt: 0 }}>
            <UserList setUser={setUser} search={search} />
          </Box>
        </SimpleBar>
      </MainCard>
    </Drawer>
  );
}

export default ChatDrawer;
