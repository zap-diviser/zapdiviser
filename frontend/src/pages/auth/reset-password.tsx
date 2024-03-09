import { Grid, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';

import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthResetPassword from 'sections/auth/auth-forms/AuthResetPassword';

const ResetPassword = () => (
  <AuthWrapper>
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Stack sx={{ mb: { xs: -0.5, sm: 0.5 } }} spacing={1}>
          <Typography variant="h3">{useIntl().formatMessage({ id: 'reset_password' })}</Typography>
          <Typography color="secondary">{useIntl().formatMessage({ id: 'please_choose_your_new_password' })}.</Typography>
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <AuthResetPassword />
      </Grid>
    </Grid>
  </AuthWrapper>
);

export default ResetPassword;
