import { useMemo, useState } from 'react';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack
} from '@mui/material';
import { PopupTransition } from 'components/@extended/Transitions';
import _ from 'lodash';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, FormikValues } from 'formik';
import { useFunnel } from 'contexts/FunnelContext';
import DeleteAlert from 'components/DeleteAlert';
import { Typography } from '@mui/material';
import { Dialog } from '@mui/material';
import {
  useProductControllerCreateFlowEvent,
  useProductControllerDeleteFlowEvent,
  useProductControllerUpdateFlowEvent
} from 'hooks/api/zapdiviserComponents';
import { useParams } from 'react-router';
import { queryKeyFn } from 'hooks/api/zapdiviserContext';
import { queryClient } from 'utils/query-client';
import { openSnackbar } from 'store/reducers/snackbar';
import { dispatch } from 'store';
import defaultError from 'utils/defaultError';
import MessageType from './MessageType';
import DelayType from './DelayType';
import FileType from './FileType';
import WaitForMessageType from './WairForMessageType';

const getInitialValues = (customer: FormikValues | null) => {
  const newCustomer = {
    message: undefined,
    delay: undefined,
    file: undefined,
    file_type: undefined,
    type: 'message'
  };

  if (customer) {
    return _.merge({}, newCustomer, customer);
  }

  return newCustomer;
};

const CustomerSchema = Yup.object().shape({
  type: Yup.string().required('Tipo é um campo obrigatório'),
  delay: Yup.number().when('type', (type, schema) => {
    if (type[0] === 'delay') return schema.required('É necessário informar o tempo de espera');
    return schema;
  }),
  message: Yup.string().when('type', (type, schema) => {
    if (type[0] === 'message') return schema.required('É necessário informar a mensagem');
    return schema;
  }),
  file: Yup.string().when('type', (type, schema) => {
    if (type[0] === 'file') return schema.required('É necessário informar o áudio');
    return schema;
  }),
  wait_for_message: Yup.string().when('type', (type, schema) => {
    return schema;
  })
});

const allTypes = [
  { id: 1, type: 'message', label: 'Mensagem' },
  { id: 2, type: 'delay', label: 'Delay' },
  { id: 3, type: 'file', label: 'Arquivo' },
  { id: 4, type: 'wait_for_message', label: 'Arguardar resposta' }
];

const AddEventModal = () => {
  const { openAddNewFunnelModal, dispatch: dispatchFunnel, funnelData } = useFunnel();

  const initialValues = useMemo(() => {
    return getInitialValues({
      ...funnelData,
      sort: undefined
    });
  }, [funnelData]);

  const [openDeleteAlert, setOpenDeleteAlert] = useState(false);

  const handleDelete = () => {
    setOpenDeleteAlert(true);
  };

  const onCancel = () => {
    dispatchFunnel({ type: 'CLOSE_ADD_NEW_FUNNEL_MODAL' });
  };

  const { product_id, flow_name } = useParams();

  const { mutateAsync: updateFlowEvent } = useProductControllerUpdateFlowEvent({
    onSuccess: (data: any) => {
      const queryKey = queryKeyFn({
        path: '/api/product/{id}',
        operationId: 'productControllerFindOne',
        variables: {
          pathParams: {
            id: product_id as string
          }
        }
      });

      queryClient.cancelQueries({
        queryKey
      });

      const newFlows = (queryClient.getQueryData(queryKey) as any)?.flows?.map((flow: any) => {
        if (flow.id === data.product_flow_id) {
          return { ...flow, events: flow.events.map((event: any) => (event.id === data.id ? data : event)) };
        }
        return flow;
      });

      queryClient.setQueryData(queryKey, (old: any) => {
        return { ...old, flows: newFlows };
      });
    },
    onError: defaultError
  });

  const { mutateAsync: deleteFlowEvent } = useProductControllerDeleteFlowEvent({
    onSuccess: (data: any) => {
      const queryKey = queryKeyFn({
        path: '/api/product/{id}',
        operationId: 'productControllerFindOne',
        variables: {
          pathParams: {
            id: product_id as string
          }
        }
      });

      queryClient.cancelQueries({
        queryKey
      });

      const newFlows = (queryClient.getQueryData(queryKey) as any)?.flows?.map((flow: any) => {
        if (flow.id === data.product_flow_id) {
          return {
            ...flow,
            events: flow.events
              .filter((event: any) => event.id !== data.id)
              .map((event: any) => {
                if (event.sort > data.sort) {
                  return { ...event, sort: event.sort - 1 };
                }
                return event;
              })
          };
        }
        return flow;
      });

      queryClient.setQueryData(queryKey, (old: any) => {
        return { ...old, flows: newFlows };
      });
    },
    onError: defaultError
  });

  const { mutateAsync: createProductFlowEvent } = useProductControllerCreateFlowEvent({
    onSuccess: (data: any) => {
      const queryKey = queryKeyFn({
        path: '/api/product/{id}',
        operationId: 'productControllerFindOne',
        variables: {
          pathParams: {
            id: product_id as string
          }
        }
      });

      queryClient.cancelQueries({
        queryKey
      });

      const product = queryClient.getQueryData(queryKey) as any;

      let newFlows: any = [];

      const flowExistsInProduct = product.flows.find((flow: any) => flow.id === data.id);

      if (flowExistsInProduct) {
        newFlows = product.flows.map((flow: any) => {
          if (flow.id === data.id) {
            return {
              ...flow,
              events: data.events
            };
          }
          return flow;
        });
      } else {
        newFlows = [...product.flows, data];
      }

      queryClient.setQueryData(queryKey, (old: any) => {
        return { ...old, flows: newFlows };
      });
    },
    onError: defaultError
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: CustomerSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { type, ...pre_metadata } = values;

      let metadata = {};

      switch (type) {
        case 'message':
          metadata = { message: pre_metadata.message };
          break;
        case 'delay':
          metadata = { delay: pre_metadata.delay };
          break;
        case 'file':
          metadata = { file: pre_metadata.file, file_type: pre_metadata.file_type };
          break;
        case 'wait_for_message':
          metadata = {};
          break;
        default:
          break;
      }

      if (funnelData.isNew) {
        await createProductFlowEvent({
          body: {
            type,
            metadata,
            sort: funnelData.sort,
            product_id: product_id as string,
            flow_name: flow_name as any
          }
        });
        dispatch(
          openSnackbar({
            open: true,
            message: 'Evento adicionado com sucesso.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      } else {
        await updateFlowEvent({
          pathParams: {
            id: funnelData?.id
          },
          body: {
            type,
            metadata
          }
        });
        dispatch(
          openSnackbar({
            open: true,
            message: 'Evento atualizado com sucesso.',
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: false
          })
        );
      }

      resetForm();
      onCancel();
    }
  });

  const { errors, touched, handleSubmit, isSubmitting, getFieldProps, resetForm, setFieldValue } = formik;

  return (
    <>
      <DeleteAlert
        sx={{
          zIndex: 1600
        }}
        title={
          <>
            <Typography variant="h4" align="center">
              Tem certeza que deseja deletar?
            </Typography>
            <Typography align="center">Ao deletar este evento deixará de realizar esta ação.</Typography>
          </>
        }
        open={openDeleteAlert}
        onClose={() => {
          setOpenDeleteAlert(false);
        }}
        onConfirm={async () => {
          try {
            await deleteFlowEvent({
              pathParams: {
                id: funnelData?.id
              }
            });
            dispatch(
              openSnackbar({
                open: true,
                message: 'Evento deletado com sucesso.',
                variant: 'alert',
                alert: {
                  color: 'success'
                },
                close: false
              })
            );
            resetForm();
            onCancel();
          } catch (e) {
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

          onCancel();
          setOpenDeleteAlert(false);
        }}
      />
      <Dialog
        maxWidth="sm"
        TransitionComponent={PopupTransition}
        keepMounted
        fullWidth
        onClose={() => dispatch({ type: 'CLOSE_ADD_NEW_FUNNEL_MODAL' })}
        open={openAddNewFunnelModal && !openDeleteAlert}
        sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
        aria-describedby="alert-dialog-slide-description"
      >
        <FormikProvider value={formik}>
          <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
            <DialogTitle>{funnelData ? 'Editar Funil' : 'Adicionar Funil'}</DialogTitle>
            <Divider />
            <DialogContent sx={{ p: 2.5 }}>
              <Grid container spacing={3} justifyContent={'center'}>
                <Grid item xs={12} md={10}>
                  <Stack spacing={1.25}>
                    <InputLabel htmlFor="message">Tipo</InputLabel>
                    <FormControl sx={{ m: 1, minWidth: 120 }}>
                      <Select {...getFieldProps('type')}>
                        {allTypes.map((column) => {
                          return (
                            <MenuItem key={column.id} value={column.type}>
                              {column.label}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                  </Stack>
                </Grid>
                {formik.values.type === 'message' ? (
                  <MessageType getFieldProps={getFieldProps} touched={touched} errors={errors} />
                ) : formik.values.type === 'delay' ? (
                  <DelayType getFieldProps={getFieldProps} touched={touched} errors={errors} />
                ) : formik.values.type === 'file' ? (
                  <FileType setFieldValue={setFieldValue} getFieldProps={getFieldProps} touched={touched} errors={errors} />
                ) : (
                  <WaitForMessageType />
                )}
              </Grid>
            </DialogContent>
            <Divider />
            <DialogActions sx={{ p: 2.5 }}>
              <Grid container justifyContent="space-between" alignItems="center">
                <Grid item>
                  {funnelData && (
                    <Button color="error" variant="contained" onClick={handleDelete}>
                      Deletar
                    </Button>
                  )}
                </Grid>
                <Grid item>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Button color="error" onClick={onCancel}>
                      Cancelar
                    </Button>
                    <Button type="submit" variant="contained" disabled={isSubmitting} onClick={() => console.log("Teste")}>
                      {funnelData ? 'Editar' : 'Adicionar'}
                    </Button>
                  </Stack>
                </Grid>
              </Grid>
            </DialogActions>
          </Form>
        </FormikProvider>
      </Dialog>
    </>
  );
};

export default AddEventModal;
