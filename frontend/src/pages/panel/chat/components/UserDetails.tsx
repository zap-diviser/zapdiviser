import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { useMediaQuery, Box, Chip, Collapse, Divider, Grid, Stack, Switch, Typography } from '@mui/material';

// project-imports
import AvatarStatus from './AvatarStatus';
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';

// assets
import { Add, ArrowDown2, ArrowRight2, Camera, Document, DocumentLike, FolderOpen, Image, Link2, Mobile, More, Sms } from 'iconsax-react';

// types
import { ThemeMode } from 'types/config';
import { UserProfile } from 'types/user-profile';

// ==============================|| CHAT - USER DETAILS ||============================== //

type Props = {
  user: UserProfile;
  onClose?: () => void;
};

const UserDetails = ({ user, onClose }: Props) => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down('md'));

  const [checked, setChecked] = useState(true);

  if (Object.keys(user).length === 0) return <Typography>...Loading</Typography>;

  let statusBGColor;
  let statusColor;
  if (user.online_status === 'available') {
    statusBGColor = theme.palette.success.lighter;
    statusColor = theme.palette.success.main;
  } else if (user.online_status === 'do_not_disturb') {
    statusBGColor = theme.palette.common.white;
    statusColor = theme.palette.secondary[400];
  } else {
    statusBGColor = theme.palette.warning.lighter;
    statusColor = theme.palette.warning.main;
  }

  return (
    <MainCard
      sx={{
        bgcolor: theme.palette.mode === ThemeMode.DARK ? 'dark.main' : 'common.white',
        borderRadius: '0 4px 4px 0',
        borderLeft: 'none'
      }}
      content={false}
    >
      <Box sx={{ p: 3 }}>
        {onClose && (
          <IconButton size="small" sx={{ position: 'absolute', right: 8, top: 8 }} onClick={onClose} color="error">
            <Add style={{ transform: 'rotate(45deg)' }} />
          </IconButton>
        )}
        <Grid container spacing={1} justifyContent="center">
          <Grid item xs={12}>
            <Stack>
              <Avatar
                alt={user.name}
                src={user.avatar}
                size="xl"
                sx={{
                  m: '8px auto',
                  width: 88,
                  height: 88,
                  border: '1px solid',
                  borderColor: theme.palette.primary.main,
                  p: 1,
                  bgcolor: 'transparent',
                  '& .MuiAvatar-img ': {
                    height: '88px',
                    width: '88px',
                    borderRadius: '50%'
                  }
                }}
              />
              <Typography variant="h5" align="center" component="div">
                {user.name}
              </Typography>
              <Typography variant="body2" align="center" color="textSecondary">
                {user.role}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12}>
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              justifyContent="center"
              sx={{ mt: 0.75, '& .MuiChip-root': { height: '24px' } }}
            >
              <AvatarStatus status={user.online_status!} />
              <Chip
                label={user?.online_status?.replaceAll('_', ' ')}
                sx={{
                  bgcolor: statusBGColor,
                  textTransform: 'capitalize',
                  color: statusColor,
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            </Stack>
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 3 }}>
          <IconButton size="medium" color="secondary" sx={{ boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.05)' }}>
            <Mobile />
          </IconButton>
          <IconButton size="medium" color="secondary" sx={{ boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.05)' }}>
            <Sms />
          </IconButton>
          <IconButton size="medium" color="secondary" sx={{ boxShadow: '0px 8px 25px rgba(0, 0, 0, 0.05)' }}>
            <Camera />
          </IconButton>
        </Stack>
      </Box>
      <Box>
        <SimpleBar
          sx={{
            overflowX: 'hidden',
            height: matchDownLG ? 'auto' : 'calc(100vh - 397px)',
            minHeight: matchDownLG ? 0 : 420
          }}
        >
          <Stack spacing={3}>
            <Stack direction="row" spacing={1.5} justifyContent="center" sx={{ px: 3 }}>
              <Box sx={{ bgcolor: 'primary.lighter', p: 2, width: '50%', borderRadius: 2 }}>
                <Typography color="primary">All File</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                  <FolderOpen style={{ color: theme.palette.primary.main, fontSize: '1.15em' }} />
                  <Typography variant="h4">231</Typography>
                </Stack>
              </Box>
              <Box sx={{ bgcolor: 'secondary.lighter', p: 2, width: '50%', borderRadius: 2 }}>
                <Typography>All Link</Typography>
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
                  <Link2 style={{ fontSize: '1.15em' }} />
                  <Typography variant="h4">231</Typography>
                </Stack>
              </Box>
            </Stack>
            <Box sx={{ px: 3, pb: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ cursor: 'pointer' }}
                    onClick={() => setChecked(!checked)}
                  >
                    <Typography variant="h5" component="div">
                      Information
                    </Typography>
                    <IconButton size="small" color="secondary">
                      <ArrowDown2 />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ mt: -1 }}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Collapse in={checked}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 1, mb: 2 }}>
                      <Typography>Address</Typography>
                      <Typography color="textSecondary">{user.location}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                      <Typography>Email</Typography>
                      <Typography color="textSecondary">{user.personal_email}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                      <Typography>Phone</Typography>
                      <Typography color="textSecondary">{user.personal_phone}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" sx={{ mt: 2, mb: 2 }}>
                      <Typography>Last visited</Typography>
                      <Typography color="textSecondary">{user.lastMessage}</Typography>
                    </Stack>
                  </Collapse>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5">Notification</Typography>
                    <Switch defaultChecked />
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ mt: -1 }}>
                  <Divider />
                </Grid>
                <Grid item xs={12} sx={{ mt: -1 }}>
                  <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5">File type</Typography>
                    <IconButton size="medium" color="secondary">
                      <More />
                    </IconButton>
                  </Stack>
                </Grid>
                <Grid item xs={12} sx={{ mt: -1 }}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          color: theme.palette.success.dark,
                          bgcolor: theme.palette.success.light,
                          borderRadius: 1
                        }}
                      >
                        <DocumentLike />
                      </Avatar>
                      <Stack>
                        <Typography>Document</Typography>
                        <Typography color="textSecondary">123 files, 193MB</Typography>
                      </Stack>
                    </Stack>
                    <IconButton size="small" color="secondary">
                      <ArrowRight2 />
                    </IconButton>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          color: theme.palette.warning.main,
                          bgcolor: theme.palette.warning.lighter,
                          borderRadius: 1
                        }}
                      >
                        <Image />
                      </Avatar>
                      <Stack>
                        <Typography>Photos</Typography>
                        <Typography color="textSecondary">53 files, 321MB</Typography>
                      </Stack>
                    </Stack>
                    <IconButton size="small" color="secondary">
                      <ArrowRight2 />
                    </IconButton>
                  </Stack>
                </Grid>

                <Grid item xs={12}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                      <Avatar
                        sx={{
                          color: theme.palette.primary.main,
                          bgcolor: theme.palette.primary.lighter,
                          borderRadius: 1
                        }}
                      >
                        <Document />
                      </Avatar>
                      <Stack>
                        <Typography>Other</Typography>
                        <Typography color="textSecondary">49 files, 193MB</Typography>
                      </Stack>
                    </Stack>
                    <IconButton size="small" color="secondary">
                      <ArrowRight2 />
                    </IconButton>
                  </Stack>
                </Grid>
              </Grid>
            </Box>
          </Stack>
        </SimpleBar>
      </Box>
    </MainCard>
  );
};

export default UserDetails;
