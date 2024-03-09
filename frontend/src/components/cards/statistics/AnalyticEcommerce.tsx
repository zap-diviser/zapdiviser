// material-ui
import { Box, Chip, ChipProps, Grid, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { ArrowRight, ArrowUp } from 'iconsax-react';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

interface Props {
  title: string;
  count: string;
  percentage?: number;
  isLoss?: boolean;
  color?: ChipProps['color'];
  extra: string;
}

const AnalyticEcommerce = ({ color = 'primary', title, count, percentage, isLoss, extra }: Props) => (
  <MainCard contentSX={{ p: 2.25 }}>
    <Stack spacing={0.5}>
      <Typography variant="h6" color="textSecondary">
        {title}
      </Typography>
      <Grid container alignItems="center">
        <Grid item>
          <Typography variant="h4" color="inherit">
            {count}
          </Typography>
        </Grid>
        {percentage && (
          <Grid item>
            <Chip
              variant="combined"
              color={color}
              icon={
                <>
                  {!isLoss && <ArrowUp style={{ transform: 'rotate(45deg)' }} />}
                  {isLoss && <ArrowRight style={{ transform: 'rotate(45deg)' }} />}
                </>
              }
              label={`${percentage}%`}
              sx={{ ml: 1.25, pl: 1, borderRadius: 1 }}
              size="small"
            />
          </Grid>
        )}
      </Grid>
    </Stack>
    <Box sx={{ pt: 2.25 }}>
      <Typography variant="caption" color="textSecondary">
        You made an extra{' '}
        <Typography component="span" variant="caption" sx={{ color: `${color || 'primary'}.main` }}>
          {extra}
        </Typography>{' '}
        this year
      </Typography>
    </Box>
  </MainCard>
);

export default AnalyticEcommerce;
