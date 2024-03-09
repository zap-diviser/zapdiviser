// material-ui
import { Button, ButtonProps } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ==============================|| AUTHENTICATION - CARD ||============================== //

const AuthSocButton = ({ children, ...other }: ButtonProps) => {
  const theme = useTheme();
  return (
    <Button
      variant="outlined"
      fullWidth
      sx={{
        backgroundColor: theme.palette.secondary[100],
        borderColor: theme.palette.secondary[200],
        color: theme.palette.secondary.main,
        '&:hover,&:focus': {
          backgroundColor: theme.palette.secondary[100],
          borderColor: theme.palette.primary.main
        }
      }}
      {...other}
    >
      {children}
    </Button>
  );
};

export default AuthSocButton;
