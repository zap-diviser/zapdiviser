import { useEffect, useRef, useState, KeyboardEvent, MouseEvent } from 'react';

// material-ui
import { useTheme, styled, Theme } from '@mui/material/styles';
import {
  Box,
  ClickAwayListener,
  Collapse,
  Dialog,
  Grid,
  Menu,
  MenuItem,
  Popper,
  Stack,
  TextField,
  Typography,
  useMediaQuery
} from '@mui/material';

// third-party
import EmojiPicker, { SkinTones, EmojiClickData } from 'emoji-picker-react';

// project-imports
import ChatDrawer from './components/ChatDrawer';
import ChatHistory from './components/ChatHistory';
import UserAvatar from './components/UserAvatar';
import UserDetails from './components/UserDetails';

import Loader from 'components/Loader';
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import { PopupTransition } from 'components/@extended/Transitions';

import { dispatch, useSelector } from 'store';
import { openDrawer } from 'store/reducers/menu';
import { openSnackbar } from 'store/reducers/snackbar';
import { getUser, getUserChats, insertChat } from 'store/reducers/chat';

// assets
import {
  Add,
  Call,
  Camera,
  DocumentDownload,
  EmojiHappy,
  HambergerMenu,
  Image,
  InfoCircle,
  More,
  Paperclip,
  Send,
  Trash,
  VolumeHigh,
  VolumeMute
} from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import { History as HistoryProps } from 'types/chat';
import { UserProfile } from 'types/user-profile';

const drawerWidth = 320;

const Main = styled('main', { shouldForwardProp: (prop: string) => prop !== 'open' })(
  ({ theme, open }: { theme: Theme; open: boolean }) => ({
    flex: 1,
    width: 'calc(100% - 320px)',
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shorter
    }),
    marginLeft: `-${drawerWidth}px`,
    [theme.breakpoints.down('lg')]: {
      paddingLeft: 0,
      marginLeft: 0
    },
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.shorter
      }),
      marginLeft: 0
    })
  })
);

// ==============================|| APPLICATION - CHAT ||============================== //

const Chat = () => {
  const theme = useTheme();

  const matchDownSM = useMediaQuery(theme.breakpoints.down('lg'));
  const matchDownMD = useMediaQuery(theme.breakpoints.down('md'));

  const [loading, setLoading] = useState<boolean>(true);
  const [emailDetails, setEmailDetails] = useState(false);
  const [user, setUser] = useState<UserProfile>({});

  const [data, setData] = useState<HistoryProps[]>([]);
  const chatState = useSelector((state) => state.chat);
  const [anchorEl, setAnchorEl] = useState<Element | (() => Element) | null | undefined>(null);

  const handleClickSort = (event: MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorEl(event?.currentTarget);
  };

  const handleCloseSort = () => {
    setAnchorEl(null);
  };

  const handleUserChange = () => {
    setEmailDetails((prev) => !prev);
  };

  const [openChatDrawer, setOpenChatDrawer] = useState(true);
  const handleDrawerOpen = () => {
    setOpenChatDrawer((prevState) => !prevState);
  };

  const [anchorElEmoji, setAnchorElEmoji] = useState<any>(); /** No single type can cater for all elements */

  const handleOnEmojiButtonClick = (event: MouseEvent<HTMLButtonElement> | undefined) => {
    setAnchorElEmoji(anchorElEmoji ? null : event?.currentTarget);
  };

  // handle new message form
  const [message, setMessage] = useState('');
  const textInput = useRef(null);

  const handleOnSend = () => {
    if (message.trim() === '') {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Message required',
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
    } else {
      const d = new Date();
      const newMessage = {
        from: 'User1',
        to: user.name,
        text: message,
        time: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setData((prevState) => [...prevState, newMessage]);
      dispatch(insertChat(newMessage));
    }
    setMessage('');
  };

  const handleEnter = (event: KeyboardEvent<HTMLDivElement> | undefined) => {
    if (event?.key !== 'Enter') {
      return;
    }
    handleOnSend();
  };

  // handle emoji
  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setMessage(message + emojiObject.emoji);
  };

  const emojiOpen = Boolean(anchorElEmoji);
  const emojiId = emojiOpen ? 'simple-popper' : undefined;

  const handleCloseEmoji = () => {
    setAnchorElEmoji(null);
  };

  // close sidebar when widow size below 'md' breakpoint
  useEffect(() => {
    setOpenChatDrawer(!matchDownSM);
  }, [matchDownSM]);

  useEffect(() => {
    setUser(chatState.user);
  }, [chatState.user]);

  useEffect(() => {
    setData(chatState.chats);
  }, [chatState.chats]);

  useEffect(() => {
    // hide left drawer when email app opens
    const drawerCall = dispatch(openDrawer(false));
    const userCall = dispatch(getUser(1));
    Promise.all([drawerCall, userCall]).then(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(getUserChats(user.name));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (loading) return <Loader />;

  return (
    <Box sx={{ display: 'flex' }}>
      <ChatDrawer openChatDrawer={openChatDrawer} handleDrawerOpen={handleDrawerOpen} setUser={setUser} />
      <Main theme={theme} open={openChatDrawer}>
        <Grid container>
          <Grid
            item
            xs={12}
            md={emailDetails ? 8 : 12}
            xl={emailDetails ? 9 : 12}
            sx={{
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.shorter + 200
              })
            }}
          >
            <MainCard
              content={false}
              sx={{
                bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'secondary.lighter',
                borderRadius: emailDetails ? '0' : '0 12px 12px 0',

                transition: theme.transitions.create('width', {
                  easing: theme.transitions.easing.easeOut,
                  duration: theme.transitions.duration.shorter + 200
                })
              }}
            >
              <Grid container>
                <Grid
                  item
                  xs={12}
                  sx={{
                    pt: 2,
                    pl: 2,
                    bgcolor: theme.palette.background.paper,
                    borderBottom: `1px solid ${theme.palette.divider}`
                  }}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    sx={{
                      m: 0,
                      pb: 1,
                      width: '100%',
                      height: '100%'
                    }}
                  >
                    <Grid item>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton onClick={handleDrawerOpen} color="secondary" size="large">
                          <HambergerMenu />
                        </IconButton>
                        <UserAvatar
                          user={{
                            online_status: user.online_status,
                            avatar: user.avatar,
                            name: user.name
                          }}
                        />
                        <Stack>
                          <Typography variant="subtitle1">{user.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            Active {user.lastMessage} ago
                          </Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                    <Grid item>
                      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={1}>
                        <IconButton size="large" color="secondary">
                          <Call />
                        </IconButton>
                        <IconButton size="large" color="secondary">
                          <Camera />
                        </IconButton>
                        <IconButton onClick={handleUserChange} size="large" color={emailDetails ? 'error' : 'secondary'}>
                          {emailDetails ? <Add style={{ transform: 'rotate(45deg)' }} /> : <InfoCircle />}
                        </IconButton>
                        <IconButton onClick={handleClickSort} size="large" color="secondary">
                          <More />
                        </IconButton>
                        <Menu
                          id="simple-menu"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleCloseSort}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right'
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right'
                          }}
                        >
                          <MenuItem onClick={handleCloseSort}>
                            <DocumentDownload style={{ paddingRight: 8 }} />
                            <Typography>Archive</Typography>
                          </MenuItem>
                          <MenuItem onClick={handleCloseSort}>
                            <VolumeMute style={{ paddingRight: 8 }} />
                            <Typography>Muted</Typography>
                          </MenuItem>
                          <MenuItem onClick={handleCloseSort}>
                            <Trash style={{ paddingRight: 8 }} />
                            <Typography>Delete</Typography>
                          </MenuItem>
                        </Menu>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <SimpleBar
                    sx={{
                      overflowX: 'hidden',
                      height: 'calc(100vh - 398px)'
                      // minHeight: 420
                    }}
                  >
                    <Box sx={{ pl: 1, pt: 1, pr: 3 }}>
                      <ChatHistory theme={theme} user={user} data={data} />
                    </Box>
                  </SimpleBar>
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{ pl: 3, pt: 3, mt: 3, bgcolor: theme.palette.background.paper, borderTop: `1px solid ${theme.palette.divider}` }}
                >
                  <Stack>
                    <TextField
                      inputRef={textInput}
                      fullWidth
                      multiline
                      rows={4}
                      placeholder="Your Message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value.length <= 1 ? e.target.value.trim() : e.target.value)}
                      onKeyPress={handleEnter}
                      variant="standard"
                      sx={{
                        pr: 2,
                        '& .MuiInput-root:before': { borderBottomColor: theme.palette.divider }
                      }}
                    />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" sx={{ py: 2, ml: -1 }}>
                        <>
                          <IconButton
                            ref={anchorElEmoji}
                            aria-describedby={emojiId}
                            onClick={handleOnEmojiButtonClick}
                            sx={{ opacity: 0.5 }}
                            size="medium"
                            color="secondary"
                          >
                            <EmojiHappy />
                          </IconButton>
                          <Popper
                            id={emojiId}
                            open={emojiOpen}
                            anchorEl={anchorElEmoji}
                            disablePortal
                            style={{ zIndex: 1200 }}
                            popperOptions={{
                              modifiers: [
                                {
                                  name: 'offset',
                                  options: {
                                    offset: [-20, 125]
                                  }
                                }
                              ]
                            }}
                          >
                            <ClickAwayListener onClickAway={handleCloseEmoji}>
                              <MainCard elevation={8} content={false}>
                                <EmojiPicker onEmojiClick={onEmojiClick} defaultSkinTone={SkinTones.DARK} autoFocusSearch={false} />
                              </MainCard>
                            </ClickAwayListener>
                          </Popper>
                        </>
                        <IconButton sx={{ opacity: 0.5 }} size="medium" color="secondary">
                          <Paperclip />
                        </IconButton>
                        <IconButton sx={{ opacity: 0.5 }} size="medium" color="secondary">
                          <Image />
                        </IconButton>
                        <IconButton sx={{ opacity: 0.5 }} size="medium" color="secondary">
                          <VolumeHigh />
                        </IconButton>
                      </Stack>
                      <IconButton color="primary" onClick={handleOnSend} size="large" sx={{ mr: 1.5 }}>
                        <Send />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </MainCard>
          </Grid>
          <Grid item xs={12} md={4} xl={3} sx={{ overflow: 'hidden', display: emailDetails ? 'flex' : 'none' }}>
            <Collapse orientation="horizontal" in={emailDetails && !matchDownMD}>
              <UserDetails user={user} onClose={handleUserChange} />
            </Collapse>
          </Grid>

          <Dialog TransitionComponent={PopupTransition} onClose={handleUserChange} open={matchDownMD && emailDetails} scroll="body">
            <UserDetails user={user} />
          </Dialog>
        </Grid>
      </Main>
    </Box>
  );
};

export default Chat;
