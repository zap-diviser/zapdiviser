import { useMemo } from 'react';

import { PopupTransition } from 'components/@extended/Transitions';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputLabel, Stack, TextField } from '@mui/material';

import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import { useProductControllerCreate, useProductControllerUpdate } from 'hooks/api/zapdiviserComponents';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { Dialog } from '@mui/material';
import { useZapdiviserContext } from 'hooks/api/zapdiviserContext';
import { queryClient } from 'utils/query-client';

const getInitialValues = (product: FormikValues | null) => {
  const newProduct = {
    name: ''
  };

  if (product) {
    return _.merge({}, newProduct, product);
  }
  return newProduct;
};

// ==============================|| CUSTOMER - ADD / EDIT ||============================== //

export interface Props {
  product?: any;
  isOpen: boolean;
  onClose: () => void;
}

const ProductSchema = Yup.object().shape({
  name: Yup.string().max(255).required('Título é um campo obrigatório')
});

const AddOrEditProduct = ({ product, isOpen, onClose }: Props) => {
  const initialValues = useMemo(() => {
    return getInitialValues(product);
  }, [product]);

  const { queryKeyFn } = useZapdiviserContext();

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const { mutateAsync: createProduct } = useProductControllerCreate({
    onSuccess: (data) => {
      const queryKey = queryKeyFn({ path: '/api/product', operationId: 'productControllerFindAll', variables: {} });

      queryClient.cancelQueries({
        queryKey
      });

      queryClient.setQueryData(queryKey, (old: any) => {
        return [...old, { ...data, links: [] }];
      });
    }
  });

  const { mutateAsync: updateProduct } = useProductControllerUpdate({
    onSuccess: (data) => {
      const queryKey = queryKeyFn({ path: '/api/product', operationId: 'productControllerFindAll', variables: {} });

      queryClient.cancelQueries({
        queryKey
      });

      queryClient.setQueryData(queryKey, (old: any) => {
        return old.map((item: any) => {
          if (item.id === data.id) {
            return data;
          }
          return item;
        });
      });
    }
  });
  const handleAddProduct = async (values: any) => {
    try {
      await createProduct({
        body: {
          name: values.name
        }
      });
      dispatch(
        openSnackbar({
          open: true,
          message: 'Produto adicionado com sucesso.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      handleClose();
    } catch (error) {
      console.log(error);
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
    }
  };

  const handleEditProduct = async (values: any) => {
    try {
      await updateProduct({
        pathParams: {
          id: product.id
        },
        body: {
          name: values.name
        }
      });
      dispatch(
        openSnackbar({
          open: true,
          message: 'Produto editado com sucesso.',
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: false
        })
      );
      handleClose();
    } catch (error) {
      console.log(error);
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
    }
  };

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: ProductSchema,
    onSubmit: async (values, { setSubmitting }) => {
      console.log(values);
      if (product) {
        await handleEditProduct(values);
      } else {
        await handleAddProduct(values);
      }
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, resetForm } = formik;

  return (
    <Dialog
      maxWidth="sm"
      TransitionComponent={PopupTransition}
      keepMounted
      fullWidth
      onClose={handleClose}
      open={isOpen}
      sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
      aria-describedby="alert-dialog-slide-description"
    >
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <DialogTitle>{product ? 'Editar Produtor' : 'Adicionar Produto'}</DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 2.5 }}>
            <Grid container spacing={3} justifyContent={'center'}>
              <Grid item xs={12} md={10} alignItems={'center'} justifyContent={'center'} display={'flex'} flexDirection={'column'}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Stack spacing={1.25}>
                      <InputLabel htmlFor="product-name">Título</InputLabel>
                      <TextField
                        fullWidth
                        id="product-name"
                        placeholder="Insira um título"
                        {...getFieldProps('name')}
                        error={Boolean(touched.name && errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2.5 }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item></Grid>
              <Grid item>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button color="error" onClick={handleClose}>
                    Cancelar
                  </Button>
                  <Button type="submit" variant="contained" disabled={isSubmitting}>
                    {product ? 'Editar' : 'Adicionar'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </DialogActions>
        </Form>
      </FormikProvider>
    </Dialog>
  );
};

export default AddOrEditProduct;
