import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, Grid, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import IconButton from 'components/@extended/IconButton';
import SimpleBar from 'components/third-party/SimpleBar';
import MessageCard from 'components/cards/statistics/MessageCard';

// assets
import { Add, NotificationStatus } from 'iconsax-react';

import message1 from 'assets/images/widget/message/message1.svg';
import message2 from 'assets/images/widget/message/message2.svg';
import message3 from 'assets/images/widget/message/message3.svg';
import message4 from 'assets/images/widget/message/message4.svg';

// types
import { ThemeMode } from 'types/config';

// ==============================|| HEADER CONTENT - CUSTOMIZATION ||============================== //

const Customization = () => {
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen(!open);
  };

  const iconBackColorOpen = theme.palette.mode === ThemeMode.DARK ? 'secondary.200' : 'secondary.200';
  const iconBackColor = theme.palette.mode === ThemeMode.DARK ? 'background.default' : 'secondary.100';

  return (
    <>
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <IconButton
          color="secondary"
          variant="light"
          onClick={handleToggle}
          aria-label="settings toggler"
          size="large"
          sx={{ color: 'secondary.main', bgcolor: open ? iconBackColorOpen : iconBackColor, p: 1 }}
        >
          <NotificationStatus variant="Bulk" />
        </IconButton>
      </Box>
      <Drawer sx={{ zIndex: 2001 }} anchor="right" onClose={handleToggle} open={open} PaperProps={{ sx: { width: { xs: 350, sm: 474 } } }}>
        {open && (
          <MainCard content={false} sx={{ border: 'none', borderRadius: 0, height: '100vh' }}>
            <SimpleBar
              sx={{
                '& .simplebar-content': {
                  display: 'flex',
                  flexDirection: 'column'
                }
              }}
            >
              <Box sx={{ p: 2.5 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
                  <Typography variant="h5">What’s new announcement?</Typography>
                  <IconButton color="secondary" sx={{ p: 0 }} onClick={handleToggle}>
                    <Add size={28} style={{ transform: 'rotate(45deg)' }} />
                  </IconButton>
                </Stack>
                <Grid container spacing={1.5} sx={{ mt: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="h6">Today</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'New Feature', color: 'success' }}
                      time="just now"
                      title="Select Business Unit"
                      message="You can use the Analytics Dashboard to explore how many new users download reports daily and monthly"
                      src={message1}
                      actions={[
                        {
                          label: 'Skip Intro',
                          button: {
                            variant: 'outlined',
                            color: 'secondary',
                            fullWidth: true
                          }
                        },
                        {
                          label: 'Next',
                          button: {
                            variant: 'contained',
                            fullWidth: true
                          }
                        }
                      ]}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'Meeting', color: 'warning' }}
                      time="2 min ago"
                      title="General Meeting for update"
                      message="You can use the Dashboard to explore how many new users download reports daily and monthly"
                      src={message2}
                    />
                  </Grid>
                  <Grid item xs={12} sx={{ my: 1.25 }}>
                    <Typography variant="h6">Yesterday</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'Improvement', color: 'primary' }}
                      time="2 hours ago"
                      title="Widgets update"
                      message="We've made some updates to the emendable widget which we think you are going to love."
                      src={message3}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MessageCard
                      status={{ label: 'Improvement', color: 'primary' }}
                      time="1 day ago"
                      title="Coming soon dark mode"
                      message="We've made some updates to the emendable widget which we think you are going to love."
                      src={message4}
                    />
                  </Grid>
                </Grid>
              </Box>
            </SimpleBar>
          </MainCard>
        )}
      </Drawer>
    </>
  );
};

export default Customization;
