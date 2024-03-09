import { useMemo } from 'react';

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
  TextField
} from '@mui/material';

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

// import { linksTable } from './linksTable';
// import { linksCollectionService } from 'services/linksCollection';
// import { addLinkCollection, updateLinkCollection } from 'store/reducers/links-collections';
import { LinksTable } from './LinksTable';
import { useRedirectsControllerCreate, useRedirectsControllerCreateLink } from 'hooks/api/zapdiviserComponents';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import { useZapdiviserContext } from 'hooks/api/zapdiviserContext';
import { queryClient } from 'utils/query-client';

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    name: '',
    slug: '',
    links: []
  };

  if (customer) {
    const data = _.merge({}, newCustomer, customer);
    console.log('das', customer);
    return data;
  }

  console.log({
    newCustomer
  });
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

const CustomerSchema = Yup.object().shape({
  name: Yup.string().max(255).required('Título é um campo obrigatório'),
  links: Yup.array().min(1, 'Deve ter pelo menos 1 número cadastrado').required('Número é um campo obrigatório')
});

const AddRedirect = ({ redirect, onCancel, onSucess }: Props) => {
  const { queryKeyFn } = useZapdiviserContext();
  const queryKey = queryKeyFn({ path: '/api/redirects', operationId: 'redirectsControllerFindAll', variables: {} });

  const { mutateAsync: addRedirect } = useRedirectsControllerCreate({
    onSuccess: (data) => {
      queryClient.cancelQueries({
        queryKey
      });

      queryClient.setQueryData(queryKey, (old: any) => {
        return [...old, { ...data, links: [] }];
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKey });
    }
  });
  const { mutateAsync: addRedirectLink } = useRedirectsControllerCreateLink();

  const isCreating = useMemo(() => {
    return !redirect;
  }, [redirect]);

  const initialValues = useMemo(() => {
    return getInitialValues(redirect);
  }, [redirect]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: CustomerSchema,
    onSubmit: async (values: any, { setSubmitting }) => {
      try {
        const savedRedirect = await addRedirect({
          body: {
            name: values.name,
            slug: _.kebabCase(values.name)
          }
        });

        await Promise.all(
          values.links.map(async (link: any) => {
            await addRedirectLink({
              body: {
                link: link.link
              },
              pathParams: {
                id: savedRedirect.id
              }
            });
          })
        );

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

        onSucess();
      } catch (error) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'este slug está inválido! Escolha outro.',
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

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

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
                        helperText={touched.name && errors.name}
                      />
                    </Stack>
                  </Grid>
                </Grid>
                <LinksTable
                  getFieldProps={getFieldProps}
                  initialData={getFieldProps('links').value}
                  isEditing={!isCreating}
                  changeState={(data: any) => setFieldValue('links', data)}
                />
                {touched.links && errors.links && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.links}
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
                  <Button color="error" onClick={onCancel}>
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
