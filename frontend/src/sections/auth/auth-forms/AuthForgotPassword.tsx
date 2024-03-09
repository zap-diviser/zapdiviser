import { useNavigate } from 'react-router-dom';

// material-ui
import { Button, FormHelperText, Grid, InputLabel, OutlinedInput, Stack, Typography } from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import useScriptRef from 'hooks/useScriptRef';
import AnimateButton from 'components/@extended/AnimateButton';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { useIntl } from 'react-intl';
import { useAuth } from 'contexts/AuthContext';

// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const AuthForgotPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const { isLoggedIn, resetPassword } = useAuth();

  const messageAlert = useIntl().formatMessage({ id: 'check_your_email_for_a_link_to_reset_your_password' });

  const emailAddress = useIntl().formatMessage({ id: 'email_address' });

  const enterEmail = useIntl().formatMessage({ id: 'enter_email' });

  const doNotForgotToCheckSpamBox = useIntl().formatMessage({ id: 'do_not_forgot_to_check_spam_box' });

  const sendPasswordResetEmail = useIntl().formatMessage({ id: 'send_password_reset_email' });

  return (
    <>
      <Formik
        initialValues={{
          email: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email(useIntl().formatMessage({ id: 'invalid_email' }))
            .max(255)
            .required(useIntl().formatMessage({ id: 'required_email' }))
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          try {
            await resetPassword(values.email).then(
              () => {
                setStatus({ success: true });
                setSubmitting(false);
                dispatch(
                  openSnackbar({
                    open: true,
                    message: messageAlert,
                    variant: 'alert',
                    alert: {
                      color: 'success'
                    },
                    close: false
                  })
                );
                setTimeout(() => {
                  navigate(isLoggedIn ? '/auth/check-mail' : '/check-mail', { replace: true });
                }, 1500);
              },
              (err: any) => {
                setStatus({ success: false });
                setErrors({ submit: err.message });
                setSubmitting(false);
              }
            );
          } catch (err: any) {
            console.error(err);
            if (scriptedRef.current) {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            }
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-forgot">{emailAddress}</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                    id="email-forgot"
                    type="email"
                    value={values.email}
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={enterEmail}
                    inputProps={{}}
                  />
                  {touched.email && errors.email && (
                    <FormHelperText error id="helper-text-email-forgot">
                      {errors.email}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12} sx={{ mb: -2 }}>
                <Typography variant="caption">{doNotForgotToCheckSpamBox}</Typography>
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    {sendPasswordResetEmail}
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>
    </>
  );
};

export default AuthForgotPassword;
