import { useEffect, useState, SyntheticEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography
} from '@mui/material';

// third-party
import * as Yup from 'yup';
import { Formik } from 'formik';

// project-imports
import { useAuth } from 'contexts/AuthContext';
import useScriptRef from 'hooks/useScriptRef';
import IconButton from 'components/@extended/IconButton';
import AnimateButton from 'components/@extended/AnimateButton';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { strengthColor, strengthIndicator } from 'utils/password-strength';

// types
import { StringColorProps } from 'types/password';

// assets
import { Eye, EyeSlash } from 'iconsax-react';
import { useIntl } from 'react-intl';

// ============================|| FIREBASE - RESET PASSWORD ||============================ //

const AuthResetPassword = (props) => {
  const navigate = useNavigate();

  const { state } = useLocation();

  console.log('props', state);

  const { resetPasswordwithCode } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  return (
    <>
      <Formik
        initialValues={{
          password: '',
          confirmPassword: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          password: Yup.string()
            .max(255)
            .required(useIntl().formatMessage({ id: 'required_password' })),
          confirmPassword: Yup.string()
            .required(useIntl().formatMessage({ id: 'confirm_password_required' }))
            .test('confirmPassword', 'Ambas as senhas devem ser iguais!', (confirmPassword, yup) => yup.parent.password === confirmPassword)
        })}
        onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
          resetPasswordwithCode(state.email, state.code, values.password)
            .then(() => {
              setStatus({ success: true });
              setSubmitting(false);
              dispatch(
                openSnackbar({
                  open: true,
                  message: 'Senha alterada com sucesso!',
                  variant: 'alert',
                  alert: {
                    color: 'success'
                  },
                  close: false
                })
              );
              setTimeout(() => {
                navigate('/login', { replace: true });
              }, 1500);
            })
            .catch((err: any) => {
              setStatus({ success: false });
              setErrors({ submit: err.message });
              setSubmitting(false);
            });
          // try {
          //   // password reset
          //     setStatus({ success: true });
          //     setSubmitting(false);

          //     dispatch(
          //       openSnackbar({
          //         open: true,
          //         message: useIntl().formatMessage({ id: 'sucessfully_changed_password' }),
          //         variant: 'alert',
          //         alert: {
          //           color: 'success'
          //         },
          //         close: false
          //       })
          //     );

          //     // setTimeout(() => {
          //     //   navigate(isLoggedIn ? '/auth/login' : '/login', { replace: true });
          //     // }, 1500);
          //   }
          // } catch (err: any) {
          //   if (scriptedRef.current) {
          //     setStatus({ success: false });
          //     setErrors({ submit: err.message });
          //     setSubmitting(false);
          //   }
          // }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-reset">{useIntl().formatMessage({ id: 'password' })}</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-reset"
                    type={showPassword ? 'text' : 'password'}
                    value={values.password}
                    name="password"
                    onBlur={handleBlur}
                    onChange={(e) => {
                      handleChange(e);
                    }}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder={useIntl().formatMessage({ id: 'enter_password' })}
                  />
                  {touched.password && errors.password && (
                    <FormHelperText error id="helper-text-password-reset">
                      {errors.password}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="confirm-password-reset">{useIntl().formatMessage({ id: 'confirm_password' })}</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.confirmPassword && errors.confirmPassword)}
                    id="confirm-password-reset"
                    type="password"
                    value={values.confirmPassword}
                    name="confirmPassword"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder={useIntl().formatMessage({ id: 'enter_confirm_password' })}
                  />
                  {touched.confirmPassword && errors.confirmPassword && (
                    <FormHelperText error id="helper-text-confirm-password-reset">
                      {errors.confirmPassword}
                    </FormHelperText>
                  )}
                </Stack>
              </Grid>

              {errors.submit && (
                <Grid item xs={12}>
                  <FormHelperText error>{errors.submit}</FormHelperText>
                </Grid>
              )}
              <Grid item xs={12}>
                <AnimateButton>
                  <Button disableElevation disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained" color="primary">
                    Reset Password
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

export default AuthResetPassword;
