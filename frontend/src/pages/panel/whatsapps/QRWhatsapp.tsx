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
import Pusher, { type Options } from 'pusher-js';
import { useWhatsappControllerCreate, useWhatsappControllerCreateWhatsapp } from 'hooks/api/zapdiviserComponents';

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
  const { mutateAsync: createWhatsapp } = useWhatsappControllerCreateWhatsapp({});

  useEffect(() => {
    const options: Options = {
      cluster: 'us2',
      wsHost: window.location.hostname,
      wsPath: '/soketi',
      wsPort: 8080,
      forceTLS: false,
      disableStats: true,
      enabledTransports: ['ws', 'xhr_polling']
    };

    if (window.location.protocol === 'https:') {
      options.forceTLS = true;
      options.wsPort = 443;
    }

    ;(async () => {
      if (data?.id) {
        await createWhatsapp({ pathParams: { id: data.id } });
      } else {
        data = await mutateAsync({});
        await createWhatsapp({ pathParams: { id: data.id } });

        const queryKey = queryKeyFn({ path: '/api/whatsapp', operationId: 'whatsappControllerFindAll', variables: {} });

        queryClient.cancelQueries({
          queryKey
        });

        queryClient.setQueryData(queryKey, (old: any) => {
          return [...old, data];
        });
      }

      console.log(options)

      // @ts-ignore
      const client = new Pusher(import.meta.env.VITE_SOKETI_APP_KEY!, options);
      const channel = client.subscribe(`whatsapp-${data.id}`);

      channel.bind('qr', (data: string) => {
        setQrCode(data);
      });

      channel.bind('whatsapp-connecting', () => {
        setQrCode(null);
      });

      channel.bind('whatsapp-connected', (data: any) => {
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
    })();
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
