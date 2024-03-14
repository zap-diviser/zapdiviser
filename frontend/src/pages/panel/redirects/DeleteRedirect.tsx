// material-ui
import { Button, Dialog, DialogContent, Stack, Typography } from '@mui/material';

// project-imports
import Avatar from 'components/@extended/Avatar';
import { PopupTransition } from 'components/@extended/Transitions';
import { useRedirectsControllerRemove } from 'hooks/api/zapdiviserComponents';
import { queryKeyFn } from 'hooks/api/zapdiviserContext';

// assets
import { Trash } from 'iconsax-react';
import { queryClient } from 'utils/query-client';

// types
interface Props {
  id: string;
  title: string;
  open: boolean;
  handleClose: (status: boolean) => void;
}

export default function DeleteRedirect({ title, open, handleClose, id }: Props) {
  const queryKey = queryKeyFn({ path: '/api/redirects', operationId: 'redirectsControllerFindAll', variables: {} });

  console.log('data = ', id);

  const { mutateAsync: removeRedirect } = useRedirectsControllerRemove({
    onSuccess: () => {
      queryClient.setQueryData(queryKey, (old: any) => {
        return old.filter((item: any) => item.id !== id);
      });
    }
  });

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      keepMounted
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
            <Typography variant="h4" align="center">
              Tem certeza que deseja deletar?
            </Typography>
            <Typography align="center">
              Ao deletar
              <Typography variant="subtitle1" component="span">
                {' '}
                "{title}"{' '}
              </Typography>
              os redirecionamentos deixarão de funcionar.
            </Typography>
          </Stack>

          <Stack direction="row" spacing={2} sx={{ width: 1 }}>
            <Button fullWidth onClick={() => handleClose(false)} color="secondary" variant="outlined">
              Cancelar
            </Button>
            <Button
              fullWidth
              color="error"
              variant="contained"
              onClick={() => {
                removeRedirect({
                  pathParams: {
                    id: id
                  }
                });
                handleClose(true);
              }}
              autoFocus
            >
              Deletar
            </Button>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}