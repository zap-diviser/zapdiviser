import { Button, CardMedia, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import avatar from 'assets/images/users/customer-support-1.png';
import AnimateButton from 'components/@extended/AnimateButton';

// ==============================|| DRAWER CONTENT - NAV CARD ||============================== //

const NavCard = () => {
  return (
    <MainCard sx={{ bgcolor: 'secondary.lighter', m: 3 }}>
      <Stack alignItems="center" spacing={2.5}>
        <CardMedia component="img" image={avatar} />
        <Stack alignItems="center">
          <Typography variant="h5">Tire suas dúvidas</Typography>
          <Typography variant="h6" color="secondary">
            pelo whatsapp
          </Typography>
        </Stack>
        <AnimateButton>
          <Button variant="shadow" size="small">
            Entrar em contato
          </Button>
        </AnimateButton>
      </Stack>
    </MainCard>
  );
};
export default NavCard;
