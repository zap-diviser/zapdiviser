import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';

export default function defaultError(error: any) {
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
