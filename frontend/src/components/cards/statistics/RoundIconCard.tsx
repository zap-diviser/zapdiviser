// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import Avatar from 'components/@extended/Avatar';

// types
import { GenericCardProps } from 'types/root';

// ============================|| STATISTICS - ROUND ICON CARD ||============================ //

interface Props {
  primary: string;
  secondary: string;
  content: string;
  iconPrimary: GenericCardProps['iconPrimary'];
  color: string;
  bgcolor: string;
}

const RoundIconCard = ({ primary, secondary, content, iconPrimary, color, bgcolor }: Props) => {
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary /> : null;

  return (
    <MainCard>
      <Grid container alignItems="center" spacing={0} justifyContent="space-between">
        <Grid item>
          <Stack spacing={1}>
            <Typography variant="h5" color="inherit">
              {primary}
            </Typography>
            <Typography variant="h4">{secondary}</Typography>
            <Typography variant="subtitle2" color="inherit">
              {content}
            </Typography>
          </Stack>
        </Grid>
        <Grid item>
          <Avatar variant="rounded" sx={{ bgcolor, color }} size="lg">
            {primaryIcon}
          </Avatar>
        </Grid>
      </Grid>
    </MainCard>
  );
};

export default RoundIconCard;
