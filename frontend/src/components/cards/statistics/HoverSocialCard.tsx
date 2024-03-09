// material-ui
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';

// types
import { GenericCardProps } from 'types/root';

// ===========================|| STATISTICS - HOVER SOCIAL CARD ||=========================== //

interface HoverSocialCardProps extends GenericCardProps {}

const HoverSocialCard = ({ primary, secondary, iconPrimary, color, content }: HoverSocialCardProps) => {
  const IconPrimary = iconPrimary!;
  const primaryIcon = iconPrimary ? <IconPrimary variant="Bold" size={52} /> : null;

  return (
    <Card
      elevation={0}
      sx={{
        background: color,
        position: 'relative',
        color: '#fff',
        '&:hover svg': {
          opacity: 1,
          transform: 'scale(1.1)'
        }
      }}
    >
      <CardContent>
        <Box
          sx={{
            position: 'absolute',
            right: 15,
            top: 25,
            color: '#fff',
            '& svg': {
              opacity: 0.4,
              transition: 'all .3s ease-in-out'
            }
          }}
        >
          {content || primaryIcon}
        </Box>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Typography variant="h3" color="inherit">
              {secondary}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography color="inherit">{primary}</Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default HoverSocialCard;
