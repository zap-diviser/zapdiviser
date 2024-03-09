import { SyntheticEvent } from 'react';

// material-ui
import { Alert, Button, Fade, Grow, Slide, SlideProps, Stack } from '@mui/material';
import MuiSnackbar from '@mui/material/Snackbar';

// project-imports
import IconButton from './IconButton';
import { dispatch, useSelector } from 'store';

// assets
import { Add } from 'iconsax-react';

import { KeyedObject } from 'types/root';
import { closeSnackbar } from 'store/reducers/snackbar';

// animation function
function TransitionSlideLeft(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

function TransitionSlideUp(props: SlideProps) {
  return <Slide {...props} direction="up" />;
}

function TransitionSlideRight(props: SlideProps) {
  return <Slide {...props} direction="right" />;
}

function TransitionSlideDown(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

function GrowTransition(props: SlideProps) {
  return <Grow {...props} />;
}

// animation options
const animation: KeyedObject = {
  SlideLeft: TransitionSlideLeft,
  SlideUp: TransitionSlideUp,
  SlideRight: TransitionSlideRight,
  SlideDown: TransitionSlideDown,
  Grow: GrowTransition,
  Fade
};

// ==============================|| SNACKBAR ||============================== //

const Snackbar = () => {
  const { actionButton, anchorOrigin, alert, close, message, open, transition, variant } = useSelector((state) => state.snackbar);

  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <>
      {/* default snackbar */}
      {variant === 'default' && (
        <MuiSnackbar
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
          TransitionComponent={animation[transition]}
          action={
            <>
              <Button color="secondary" size="small" onClick={handleClose}>
                UNDO
              </Button>
              <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <Add style={{ transform: 'rotate(45deg)' }} />
              </IconButton>
            </>
          }
        />
      )}

      {/* alert snackbar */}
      {variant === 'alert' && (
        <MuiSnackbar
          TransitionComponent={animation[transition]}
          anchorOrigin={anchorOrigin}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert
            variant={alert.variant}
            color={alert.color}
            action={
              <Stack direction="row" alignItems="center">
                {actionButton !== false && (
                  <Button color={alert.color} size="small" onClick={handleClose}>
                    UNDO
                  </Button>
                )}
                {close !== false && (
                  <IconButton size="small" aria-label="close" variant="contained" color={alert.color} onClick={handleClose}>
                    <Add style={{ transform: 'rotate(45deg)' }} />
                  </IconButton>
                )}
              </Stack>
            }
            sx={{
              ...alert.sx,
              ...(alert.variant === 'outlined' && {
                bgcolor: 'background.default'
              })
            }}
          >
            {message}
          </Alert>
        </MuiSnackbar>
      )}
    </>
  );
};

export default Snackbar;
