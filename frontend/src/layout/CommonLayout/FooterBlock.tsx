// material-ui
import { styled, useTheme } from '@mui/material/styles';
import { Box, Container, Grid, Link, Stack, Typography } from '@mui/material';

// third-party
import { motion } from 'framer-motion';

// project-imports
import Logo from 'components/logo';

// assets
import { Facebook } from 'iconsax-react';

// link - custom style
const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  '&:hover, &:active': {
    color: theme.palette.primary.main
  }
}));

// ==============================|| LANDING - FOOTER PAGE ||============================== //

type showProps = {
  isFull?: boolean;
};

const FooterBlock = ({ isFull }: showProps) => {
  const theme = useTheme();

  const linkSX = {
    color: theme.palette.text.secondary,
    fontWeight: 400,
    opacity: '0.6',
    cursor: 'pointer',
    '&:hover': {
      opacity: '1'
    }
  };

  return (
    <>
      <Box sx={{ pt: isFull ? 5 : 10, pb: 10, bgcolor: 'secondary.200', borderTop: `1px solid ${theme.palette.divider}` }}>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Logo reverse to="/" />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 400 }}>
                      Phoenixcoded has gained the trust of over 5.5K customers since 2015, thanks to our commitment to delivering
                      high-quality products. Our experienced team players are responsible for managing Able Pro.
                    </Typography>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={8}>
              <Grid container spacing={{ xs: 5, md: 2 }}>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5">Company</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="https://themeforest.net/user/phoenixcoded" target="_blank" underline="none">
                        Profile
                      </FooterLink>
                      <FooterLink href="https://themeforest.net/user/phoenixcoded/portfolio" target="_blank" underline="none">
                        Portfolio
                      </FooterLink>
                      <FooterLink href="https://themeforest.net/user/phoenixcoded/followers" target="_blank" underline="none">
                        Follow Us
                      </FooterLink>
                      <FooterLink href="https://phoenixcoded.net" target="_blank" underline="none">
                        Website
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5">Help & Support</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="https://phoenixcoded.gitbook.io/able-pro/v/react/" target="_blank" underline="none">
                        Documentation
                      </FooterLink>
                      <FooterLink href="https://phoenixcoded.gitbook.io/able-pro/v/react/roadmap/" target="_blank" underline="none">
                        Feature Request
                      </FooterLink>
                      <FooterLink href="https://phoenixcoded.gitbook.io/able-pro/v/react/roadmap/" target="_blank" underline="none">
                        RoadMap
                      </FooterLink>
                      <FooterLink href="https://phoenixcoded.authordesk.app/" target="_blank" underline="none">
                        Support
                      </FooterLink>
                      <FooterLink href="https://themeforest.net/user/phoenixcoded#contact" target="_blank" underline="none">
                        Email Us
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
                <Grid item xs={6} sm={4}>
                  <Stack spacing={3}>
                    <Typography variant="h5">Useful Resources</Typography>
                    <Stack spacing={{ xs: 1.5, md: 2.5 }}>
                      <FooterLink href="https://themeforest.net/page/item_support_policy" target="_blank" underline="none">
                        Support Policy
                      </FooterLink>
                      <FooterLink href="https://themeforest.net/licenses/standard" target="_blank" underline="none">
                        Licenses Term
                      </FooterLink>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box
        sx={{
          py: 2.4,
          borderTop: `1px solid ${theme.palette.divider}`,
          bgcolor: 'secondary.200'
        }}
      >
        <Container>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={8}>
              <Typography>
                © Handcrafted by Team{' '}
                <Link href="https://themeforest.net/user/phoenixcoded" underline="none">
                  {' '}
                  Phoenixcoded
                </Link>
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container spacing={2} alignItems="center" sx={{ justifyContent: 'flex-end' }}>
                <Grid item>
                  <Link underline="none" sx={linkSX}>
                    <Facebook size="22" variant="Bulk" />
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default FooterBlock;
