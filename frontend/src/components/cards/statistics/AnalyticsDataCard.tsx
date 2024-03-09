// material-ui
import { Box, Chip, ChipProps, Stack, Typography } from '@mui/material';

// project-imports
import MainCard from 'components/MainCard';

// assets
import { TrendDown, TrendUp } from 'iconsax-react';

// ==============================|| STATISTICS - ECOMMERCE CARD  ||============================== //

interface Props {
  title: string;
  count: string;
  percentage?: number;
  isLoss?: boolean;
  color?: ChipProps['color'];
  children: any;
}

const AnalyticsDataCard = ({ color = 'primary', title, count, percentage, isLoss, children }: Props) => (
  <MainCard content={false}>
    <Box sx={{ p: 2.25 }}>
      <Stack spacing={0.5}>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Stack direction="row" alignItems="center">
          <Typography variant="h4" color="inherit">
            {count}
          </Typography>
          {percentage && (
            <Chip
              variant="combined"
              color={color}
              icon={
                <>
                  {!isLoss && <TrendUp variant="Bold" />}
                  {isLoss && <TrendDown variant="Bold" />}
                </>
              }
              label={`${percentage}%`}
              sx={{ ml: 1.25, pl: 0.5, borderRadius: 1 }}
              size="small"
            />
          )}
        </Stack>
      </Stack>
    </Box>
    {children}
  </MainCard>
);

export default AnalyticsDataCard;
