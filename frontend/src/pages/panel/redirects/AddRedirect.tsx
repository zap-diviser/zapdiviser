import { useCallback, useMemo } from 'react';

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  FormHelperText,
  InputLabel,
  Stack,
  TextField,
  InputAdornment
} from '@mui/material';

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import { LinksTable } from './LinksTable';
import {
  useRedirectsControllerCreate,
  useRedirectsControllerCreateLink,
  useRedirectsControllerRemoveLink,
  useRedirectsControllerUpdate
} from 'hooks/api/zapdiviserComponents';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import { useZapdiviserContext } from 'hooks/api/zapdiviserContext';
import { queryClient } from 'utils/query-client';
import { formatSlug } from 'utils/formatSlug';
import axiosServices from 'utils/axios';

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    name: '',
    slug: '',
    links: []
  };

  if (customer) {
    const data = _.merge({}, newCustomer, customer);
    return data;
  }

  return newCustomer;
};

// ==============================|| CUSTOMER - ADD / EDIT ||============================== //

export interface Props {
  redirect: {
    id: string;
    name: string;
    slug: string;
  } | null;
  onCancel: () => void;
  onSucess: () => void;
}

const AddRedirect = ({ redirect, onCancel, onSucess }: Props) => {
  const { queryKeyFn } = useZapdiviserContext();
  const queryKey = queryKeyFn({ path: '/api/redirects', operationId: 'redirectsControllerFindAll', variables: {} });

  const { mutateAsync: addRedirect } = useRedirectsControllerCreate({
    onSuccess: (data: any) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        return [...old, { ...data }];
      });
    }
  });

  const { mutateAsync: addLink } = useRedirectsControllerCreateLink({
    onSuccess: (data: any) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        return old.map((item: any) => {
          if (item.id === redirect?.id) {
            return {
              ...item,
              links: [...item.links, data[0]]
            };
          }
          return item;
        });
      });
    }
  });

  const { mutateAsync: deletedLink } = useRedirectsControllerRemoveLink({
    onSuccess: (data: any) => {
      console.log('redirect id - ', redirect?.id);

      queryClient.setQueryData(queryKey, (old: any) => {
        return old.map((item: any) => {
          if (item.id === redirect?.id) {
            return {
              ...item,
              links: item.links.filter((link: any) => link.id !== data[0].id)
            };
          }
          return item;
        });
      });
    }
  });

  const { mutateAsync: updateRedirect } = useRedirectsControllerUpdate({
    onSuccess: (data: any) => {
      queryClient.setQueryData(queryKey, (old: any) => {
        return old.map((item: any) => {
          if (item.id === redirect?.id) {
            return { ...item, ...data };
          }
          return item;
        });
      });
    }
  });

  const isCreating = useMemo(() => {
    return !redirect;
  }, [redirect]);

  const initialValues = useMemo(() => {
    return getInitialValues(redirect);
  }, [redirect]);

  const CustomerSchema = Yup.object().shape({
    name: Yup.string().max(255).required('Título é um campo obrigatório'),
    links: Yup.array().min(1, 'Deve ter pelo menos 1 número cadastrado').required('Número é um campo obrigatório'),
    slug: Yup.string().max(255).required('Slug é um campo obrigatório')
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validateOnBlur: false,
    validationSchema: CustomerSchema,
    onSubmit: async (values: any, { setSubmitting }) => {
      try {
        if (values.slug !== initialValues.slug) {
          const res = await axiosServices.get(`/redirects/slug-available/${values.slug}`);

          const isValid = res.data.available;

          if (!isValid) {
            setErrors({ slug: 'Este slug está indisponível' });
            return;
          }
        }

        if (isCreating) {
          (await addRedirect({
            body: {
              name: values.name,
              slug: values.slug,
              links: values.links
            }
          })) as any;

          dispatch(
            openSnackbar({
              open: true,
              message: 'Link adicionado com sucesso.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        } else {
          const ghostLinks = values.links.filter((link: any) => link.isGhost);

          for (const link of ghostLinks) {
            await addLink({
              pathParams: {
                id: redirect?.id as string
              },
              body: {
                link: link.link
              }
            });
          }

          const deletedLinks = values.links.filter((link: any) => link.isDeleted);

          for (const link of deletedLinks) {
            await deletedLink({
              pathParams: {
                linkId: link.id
              }
            });
          }

          //check if redirect changed
          if (values.name !== initialValues.name || values.slug !== initialValues.slug) {
            await updateRedirect({
              pathParams: {
                id: redirect?.id as string
              },
              body: {
                name: values.name,
                slug: values.slug
              }
            });
          }
        }

        onSucess();
      } catch (error) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Erro ao adicionar link.',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue, setFieldError, setErrors, resetForm } = formik;

  const onChangeSlug = useCallback(
    async (e: any) => {
      const slug = formatSlug(e.target.value);
      await setFieldValue('slug', slug);
      if (slug === initialValues.slug) return;

      const res = await axiosServices.get(`/redirects/slug-available/${slug}`);

      const isValid = res.data.available;

      if (!isValid) {
        setErrors({
          ...errors,
          slug: 'Este slug está indisponível'
        });
      }
    },
    [setFieldValue, initialValues.slug, setFieldError, setErrors]
  );

  const onClose = useCallback(() => {
    onCancel();
    resetForm();
  }, [onCancel]);

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{redirect ? 'Editar Campanha' : 'Adicionar Campanha'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3} justifyContent={'center'}>
              <Grid item xs={12} md={10}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="name">Título</InputLabel>
                      <TextField
                        fullWidth
                        id="name"
                        placeholder="Insira um nome para a campanha de links"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && (errors.name as string)}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="customer-slug">Slug</InputLabel>

                    <TextField
                      fullWidth
                      id="customer-slug"
                      placeholder="meu-site"
                      {...getFieldProps('slug')}
                      value={getFieldProps('slug').value}
                      onChange={(e) => {
                        onChangeSlug(e);
                      }}
                      style={{
                        marginTop: 5
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment
                            position="start"
                            style={{
                              marginLeft: 10,
                              marginRight: 0,
                              paddingRight: 0
                            }}
                          >
                            https://redirect.zapdiviser.com/
                          </InputAdornment>
                        )
                      }}
                      error={Boolean(touched.slug && errors.slug)}
                      helperText={touched.slug && errors.slug && 'Este slug está indisponível'}
                    />
                  </Stack>
                </Grid>
                <LinksTable
                  getFieldProps={getFieldProps}
                  initialData={getFieldProps('links').value}
                  isEditing={!isCreating}
                  changeState={(data: any) => {
                    setFieldValue('links', data);
                  }}
                />
                {touched.links && errors.links && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.links as string}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item></Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={onClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {redirect ? 'Editar' : 'Adicionar'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </FormikProvider>
    </>
  );
};

export default AddRedirect;
