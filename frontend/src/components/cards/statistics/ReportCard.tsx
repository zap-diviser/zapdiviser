// material-ui
import { Grid, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';
import { GenericCardProps } from 'types/root';

// ==============================|| STATISTICS - REPORT CARD ||============================== //

interface ReportCardProps extends GenericCardProps {}

const ReportCard = ({ primary, secondary, iconPrimary, color, content }: ReportCardProps) => {
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary size={44} color={color} /> : null;

  return (
    <MainCard>
      <Grid container justifyContent="space-between" alignItems="center">
        <Grid item>
          <Stack spacing={0.25}>
            <Typography variant="h3">{primary}</Typography>
            <Typography variant="body1" color="text.secondary">
              {secondary}
            </Typography>
          </Stack>
        </Grid>
        <Grid item>{content || primaryIcon}</Grid>
      </Grid>
    </MainCard>
  );
};

export default ReportCard;
