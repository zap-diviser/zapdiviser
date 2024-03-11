import { PopupTransition } from 'components/@extended/Transitions';
import { Button, DialogActions, DialogContent, DialogTitle, Divider, Grid, LinearProgress, Stack, useTheme } from '@mui/material';

import { Dialog } from '@mui/material';
import { Typography } from '@mui/material';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { queryKeyFn } from 'hooks/api/zapdiviserContext';
import { queryClient } from 'utils/query-client';
import { QRCodeSVG } from 'qrcode.react';
import { io } from 'socket.io-client';
import { useWhatsappControllerCreate } from 'hooks/api/zapdiviserComponents';

export interface Props {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const QRWhatsapp = ({ isOpen, onClose, data }: Props) => {
  const theme = useTheme();

  const [qrCode, setQrCode] = useState<null | string>(null);

  useEffect(() => {
    if (data?.qrCode) {
      setQrCode(data.qrCode);
    }
  }, [data]);

  const { mutateAsync } = useWhatsappControllerCreate({});

  useEffect(() => {
    // @ts-ignore
    const socket = io('%VITE_BACKEND_URL%');

    (async () => {
      if (data?.id) {
        console.log('instanceId', data.id);
        socket.emit('createWhatsapp', { instanceId: data.id });
      } else {
        const data = await mutateAsync({});
        console.log('instanceId', data.instanceId);
        socket.emit('createWhatsapp', { instanceId: data.id });

        const queryKey = queryKeyFn({ path: '/api/whatsapp', operationId: 'whatsappControllerFindAll', variables: {} });

        queryClient.cancelQueries({
          queryKey
        });

        queryClient.setQueryData(queryKey, (old: any) => {
          return [...old, data];
        });
      }
    })();

    socket.on('qr', (data: string) => {
      console.log('qr', data);
      setQrCode(data);
    });

    socket.on('whatsapp-connecting', () => {
      setQrCode(null);
    });

    socket.on('whatsapp-connected', (data) => {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Whatsapp criado com sucesso',
          variant: 'alert',
          alert: {
            color: 'success'
          }
        })
      );

      const queryKey = queryKeyFn({ path: '/api/whatsapp', operationId: 'whatsappControllerFindAll', variables: {} });

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

      onClose();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Dialog
      maxWidth="sm"
      TransitionComponent={PopupTransition}
      keepMounted
      fullWidth
      onClose={onClose}
      open={isOpen}
      sx={{ '& .MuiDialog-paper': { p: 0 }, transition: 'transform 225ms' }}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Adicionar Whatsapp</DialogTitle>
      <Divider />
      <DialogContent sx={{ p: 2.5 }}>
        {qrCode ? (
          <Grid container textAlign={'center'} alignItems={'center'} justifyContent={'center'} flexDirection={'column'}>
            <Grid
              item
              xs={12}
              alignItems={'center'}
              justifyContent={'center'}
              sx={{
                textAlign: 'center',
                marginBottom: '35px'
              }}
            >
              <Typography variant="subtitle1" sx={{ fontSize: '30px' }}>
                Leia o QR CODE com o seu celular
              </Typography>
            </Grid>
            <Grid
              sx={{
                boxShadow: `0px 0px 5px 0px ${theme.palette.primary.main}`
              }}
            >
              <MainCard>
                <QRCodeSVG value={qrCode} level="H" width={300} height={300} />
              </MainCard>
            </Grid>
            <Grid xs={6}>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', marginTop: '35px', color: theme.palette.grey[800] }}>
                Abra o whatsapp no seu celular, toque nas 3 bolinhas no canto superior direito, selecione a opção "Aparelhos conectados",
                toque em conectar e escaneie o qr code
              </Typography>
            </Grid>
          </Grid>
        ) : (
          <LinearProgress
            sx={{
              my: 10,
              mx: 10
            }}
          />
        )}
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
            </Stack>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default QRWhatsapp;
