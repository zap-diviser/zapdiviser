import { useState, useMemo, useCallback } from 'react';

// material-ui
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Stack,
  Switch,
  TextField,
  Typography,
  InputAdornment,
  Badge
} from '@mui/material';

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';

import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

import { NumbersTable } from './NumbersTable';
import { linksCollectionService } from 'services/linksCollection';
import { addLinkCollection, updateLinkCollection } from 'store/reducers/links-collections';
import { formatSlug } from 'utils/formatSlug';
import { useAuth } from 'contexts/AuthContext';
import { useBuyModal } from 'contexts/BuyModalContext';

// require.context('assets/images/users', true);

// constant
const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    title: '',
    type_of_draw: '',
    slug: '',
    show_lead_page: false,
    is_active: true,
    numbers: []
  };

  if (customer) {
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const allStatus = [
  {
    name: 'Sequencial',
    value: 'sequential'
  },
  {
    name: 'Aleatório',
    value: 'random'
  }
];

// ==============================|| CUSTOMER - ADD / EDIT ||============================== //

export interface Props {
  customer?: any;
  onCancel: () => void;
}

const CustomerSchema = Yup.object().shape({
  title: Yup.string().max(255).required('Título é um campo obrigatório'),
  type_of_draw: Yup.string().required('Tipo de Sorteio é um campo obrigatório'),
  numbers: Yup.array().min(1, 'Deve ter pelo menos 1 número cadastrado').required('Número é um campo obrigatório')
});

const AddLink = ({ customer, onCancel }: Props) => {
  const isCreating = useMemo(() => {
    return !customer;
  }, [customer]);

  const initialValues = useMemo(() => {
    return getInitialValues(customer);
  }, [customer]);

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: CustomerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (slugIsInvalid) {
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
          return;
        }
        if (isCreating) {
          const data = await linksCollectionService.create(values);
          dispatch(addLinkCollection(data));

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
          const data = await linksCollectionService.update(customer.id, {
            ...values,
            id: undefined,
            deleted_at: undefined,
            created_at: undefined,
            updated_at: undefined,
            redirects: undefined,
            user_id: undefined
          });
          dispatch(updateLinkCollection(data));
          dispatch(
            openSnackbar({
              open: true,
              message: 'Link atualizado com sucesso.',
              variant: 'alert',
              alert: {
                color: 'success'
              },
              close: false
            })
          );
        }
        setSubmitting(false);
        onCancel();
      } catch (error) {
        console.error(error);
        dispatch(
          openSnackbar({
            open: true,
            message: 'Algo deu errado!',
            variant: 'alert',
            alert: {
              color: 'error'
            },
            close: false
          })
        );
        setSubmitting(false);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, setFieldValue } = formik;

  const [slugIsInvalid, setSlugIsInvalid] = useState(false);

  const onChangeSlug = useCallback(
    async (e: any) => {
      const slug = formatSlug(e.target.value);
      await setFieldValue('slug', slug);
      if (slug === initialValues.slug) return;
      const isValid = await linksCollectionService.checkLinkIsValid(slug);
      if (!isValid) {
        setSlugIsInvalid(true);
      } else {
        setSlugIsInvalid(false);
      }
    },
    [setFieldValue, initialValues.slug]
  );

  const { userIsPremium } = useAuth();
  const { handleOpen } = useBuyModal();

  return (
    <>
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{customer ? 'Editar Link de Whatsapp' : 'Novo Link de Whatsapp'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3} justifyContent={'center'}>
              <Grid item xs={12} md={10}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="customer-title">Título</InputLabel>
                      <TextField
                        fullWidth
                        id="customer-title"
                        placeholder="Insira um título"
                        {...getFieldProps('title')}
                        error={Boolean(touched.title && errors.title)}
                        helperText={touched.title && errors.title}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25} onClick={(e) => !userIsPremium && handleOpen()}>
                      <div
                        style={
                          userIsPremium
                            ? {}
                            : {
                                pointerEvents: 'none'
                              }
                        }
                      >
                        <InputLabel htmlFor="customer-slug">
                          Slug
                          {!userIsPremium && <Badge badgeContent="Premium" color="info" sx={{ ml: 4.5 }} />}
                        </InputLabel>

                        <TextField
                          fullWidth
                          id="customer-slug"
                          placeholder="meu-site"
                          {...getFieldProps('slug')}
                          value={userIsPremium ? getFieldProps('slug').value : `3ifas38f0-n (Url de Exemplo)`}
                          onChange={(e) => {
                            onChangeSlug(e);
                          }}
                          style={{
                            marginTop: 5
                          }}
                          // on={(e) => !userIsPremium && handleOpen()}
                          disabled={!userIsPremium}
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
                                zapdiviser.com
                              </InputAdornment>
                            )
                          }}
                          error={slugIsInvalid}
                          helperText={slugIsInvalid && 'Este slug está indisponível'}
                        />
                      </div>
                    </Stack>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="customer-type_of_draw">Tipo de Sorteio</InputLabel>
                      <FormControl fullWidth>
                        <Select
                          id="type_of_draw"
                          displayEmpty
                          {...getFieldProps('type_of_draw')}
                          onChange={(event: SelectChangeEvent<string>) => setFieldValue('type_of_draw', event.target.value as string)}
                          input={<OutlinedInput id="select-column-hiding" placeholder="Sort by" />}
                          renderValue={(selected) => {
                            if (!selected) {
                              return <Typography variant="subtitle1">Selecione o tipo</Typography>;
                            }

                            return (
                              <Typography variant="subtitle2">
                                {allStatus.find((column: any) => column.value === selected)?.name}
                              </Typography>
                            );
                          }}
                        >
                          {allStatus.map((column: any) => (
                            <MenuItem key={column.value} value={column.value}>
                              <ListItemText primary={column.name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      {touched.type_of_draw && errors.type_of_draw && (
                        <FormHelperText error id="standard-weight-helper-text-email-login" sx={{ pl: 1.75 }}>
                          {errors.type_of_draw}
                        </FormHelperText>
                      )}
                    </Stack>
                  </Grid>
                  <Grid item xs={12} marginTop={2} onClick={(e) => !userIsPremium && handleOpen()}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack spacing={0.5}>
                        <Typography variant="subtitle1">
                          Exibir página de captura de Lead
                          {!userIsPremium && <Badge badgeContent="Premium" color="info" sx={{ ml: 4.5 }} />}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          Captura o número de whatsapp do Lead antes de Redirecionar
                        </Typography>
                      </Stack>

                      {(() => {
                        const props = getFieldProps('show_lead_page');
                        return (
                          <FormControlLabel
                            control={<Switch checked={props.value} {...props} disabled={!userIsPremium} sx={{ mt: 0 }} />}
                            label=""
                            labelPlacement="start"
                          />
                        );
                      })()}
                    </Stack>
                    {customer && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                          <Stack spacing={0.5}>
                            <Typography variant="subtitle1">Status do Link</Typography>
                            <Typography variant="caption" color="textSecondary">
                              Ativado / Desativado
                            </Typography>
                          </Stack>
                          {(() => {
                            const props = getFieldProps('is_active');
                            return (
                              <FormControlLabel
                                control={<Switch checked={props.value} {...getFieldProps('is_active')} sx={{ mt: 0 }} />}
                                label=""
                                labelPlacement="start"
                              />
                            );
                          })()}
                        </Stack>
                      </>
                    )}
                  </Grid>
                </Grid>
                <NumbersTable
                  getFieldProps={getFieldProps}
                  initialData={getFieldProps('numbers').value}
                  isEditing={!isCreating}
                  changeState={(data: any) => setFieldValue('numbers', data)}
                />
                {touched.numbers && errors.numbers && (
                  <FormHelperText error id="standard-weight-helper-text-email-login">
                    {errors.numbers}
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
                    {customer ? 'Editar' : 'Adicionar'}
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

export default AddLink;
