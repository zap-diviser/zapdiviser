// material-ui
import { Button, Dialog, DialogContent, Stack } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';

// assets
import { Trash } from 'iconsax-react';

// types
interface Props {
  title: any;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  sx?: any;
}

// ==============================|| CUSTOMER - DELETE ||============================== //

export default function DeleteAlert({ title, open, onClose, onConfirm, sx }: Props) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      keepMounted
      sx={sx || {}}
      TransitionComponent={PopupTransition}
      maxWidth="xs"
      aria-labelledby="column-delete-title"
      aria-describedby="column-delete-description"
    >
      <DialogContent sx={{ mt: 2, my: 1 }}>
        <Stack alignItems="center" spacing={3.5}>
          <Avatar color="error" sx={{ width: 72, height: 72, fontSize: '1.75rem' }}>
            <Trash variant="Bold" />
          </Avatar>
          <Stack spacing={2}>
            {title}
            {/* <Typography variant="h4" align="center">
              Tem certeza que deseja deletar?
            </Typography>
            <Typography align="center">
              Ao deletar
              <Typography variant="subtitle1" component="span">
                {' '}
                "{title}"{' '}
              </Typography>
              o link deixará de redirecionar para este número.
            </Typography> */}
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={onClose} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button fullWidth color="error" variant="contained" onClick={onConfirm} autoFocus>
              Deletar
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
