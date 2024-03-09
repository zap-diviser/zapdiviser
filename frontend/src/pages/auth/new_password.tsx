import { Link } from 'react-router-dom';

import { Box, Button, Grid, Typography } from '@mui/material';

import AnimateButton from 'components/@extended/AnimateButton';
import AuthWrapper from 'sections/auth/AuthWrapper';
import { useIntl } from 'react-intl';
import { useAuth } from 'contexts/AuthContext';

const NewPassword = () => {
  const { isLoggedIn } = useAuth();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">{useIntl().formatMessage({ id: 'new_password_text' })}</Typography>
            <Typography color="secondary" sx={{ mb: 0.5, mt: 1.25 }}>
              {useIntl().formatMessage({ id: 'we_have_sent_you_an_email' })}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              component={Link}
              to={isLoggedIn ? '/auth/login' : '/login'}
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              {useIntl().formatMessage({ id: 'sign_in' })}
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default NewPassword;
