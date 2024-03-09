// material-ui
import { CSSObject, useTheme } from '@mui/material/styles';
import { Box } from '@mui/material';

// project-imports
import { ColorProps } from 'types/extended';
import getColors from 'utils/getColors';

// ==============================|| DOT - EXTENDED ||============================== //

interface Props {
  color?: ColorProps;
  size?: number;
  variant?: string;
  sx?: CSSObject;
  componentDiv?: boolean;
}

const Dot = ({ color, size, variant, sx, componentDiv }: Props) => {
  const theme = useTheme();
  const colors = getColors(theme, color || 'primary');
  const { main } = colors;

  return (
    <Box
      component={componentDiv ? 'div' : 'span'}
      sx={{
        width: size || 8,
        height: size || 8,
        borderRadius: '50%',
        bgcolor: variant === 'outlined' ? '' : main,
        ...(variant === 'outlined' && {
          border: `1px solid ${main}`
        }),
        ...sx
      }}
    />
  );
};

export default Dot;
