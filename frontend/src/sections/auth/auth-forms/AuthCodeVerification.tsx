import { useCallback, useState } from 'react';

import { useTheme } from '@mui/material/styles';
import { Button, Grid, Stack, Typography } from '@mui/material';
import { dispatch } from 'store';
import OtpInput from 'react18-input-otp';
import AnimateButton from 'components/@extended/AnimateButton';
import { ThemeMode } from 'types/config';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { openSnackbar } from 'store/reducers/snackbar';
import { useAuth } from 'contexts/AuthContext';

const AuthCodeVerification = () => {
  const theme = useTheme();
  const [otp, setOtp] = useState<string>();
  const navigate = useNavigate();

  const { resetPassword, checkCodeIsValid } = useAuth();

  const [searchParams] = useSearchParams();

  const borderColor = theme.palette.mode === ThemeMode.DARK ? theme.palette.secondary[200] : theme.palette.secondary.light;

  const handleResendCode = async () => {
    await resetPassword(searchParams.get('email') || '')
      .then(() => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Cheque seu email para obter o novo código de redefinição de senha',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      })
      .catch((err: any) => {
        dispatch(
          openSnackbar({
            open: true,
            message: err.message,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      });
  };

  const continueToResetPassword = useCallback(async () => {
    await checkCodeIsValid(searchParams.get('email') || '', otp || '')
      .then(() => {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Código verificado com sucesso',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
        navigate('/reset-password', {
          state: {
            email: searchParams.get('email'),
            code: otp
          }
        });
      })
      .catch((err: any) => {
        dispatch(
          openSnackbar({
            open: true,
            message: err.message,
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      });
  }, [otp]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <OtpInput
          value={otp}
          onChange={(otp: string) => setOtp(otp)}
          numInputs={6}
          containerStyle={{ justifyContent: 'space-between' }}
          inputStyle={{
            width: '100%',
            margin: '8px',
            padding: '10px',
            border: `1px solid ${borderColor}`,
            borderRadius: 4,
            ':hover': {
              borderColor: theme.palette.primary.main
            }
          }}
          focusStyle={{
            outline: 'none',
            boxShadow: theme.customShadows.primary,
            border: `1px solid ${theme.palette.primary.main}`
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <AnimateButton>
          <Button disableElevation fullWidth size="large" type="submit" variant="contained" onClick={continueToResetPassword}>
            Continue
          </Button>
        </AnimateButton>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between" alignItems="baseline">
          <Typography>{useIntl().formatMessage({ id: 'not_received_code?' })}</Typography>
          <Typography
            onClick={handleResendCode}
            variant="body1"
            sx={{ minWidth: 85, ml: 2, textDecoration: 'none', cursor: 'pointer' }}
            color="primary"
          >
            {useIntl().formatMessage({ id: 'resend_code' })}
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AuthCodeVerification;
