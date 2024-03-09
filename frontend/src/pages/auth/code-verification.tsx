import { Grid, Stack, Typography } from '@mui/material';
import { useIntl } from 'react-intl';
import { useSearchParams } from 'react-router-dom';

import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthCodeVerification from 'sections/auth/auth-forms/AuthCodeVerification';

const CodeVerification = () => {
  const [searchParams] = useSearchParams();

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography variant="h3">{useIntl().formatMessage({ id: 'enter_verification_code' })}</Typography>
            <Typography color="secondary">{useIntl().formatMessage({ id: 'we_have_sent_you_an_email_code_verification' })}.</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography>seu email é {searchParams.get('email')}?</Typography>
        </Grid>
        <Grid item xs={12}>
          <AuthCodeVerification />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
};

export default CodeVerification;
