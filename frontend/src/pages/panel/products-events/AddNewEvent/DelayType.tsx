import { Grid, TextField, Stack, InputLabel } from '@mui/material';

export default function DelayType({ getFieldProps, touched, errors }: { getFieldProps: any; touched: any; errors: any }) {
  return (
    <Grid item xs={12} md={10}>
      <Stack spacing={1.25}>
        <InputLabel htmlFor="delay">
          Esperar até
          <span style={{ color: 'red' }}> *</span>
          <span style={{ color: 'gray' }}> (em segundos)</span>
        </InputLabel>
        <TextField
          fullWidth
          id="delay"
          type="number"
          placeholder="10 Segundos"
          {...getFieldProps('delay')}
          error={Boolean(touched.delay && errors.delay)}
          helperText={touched.delay && errors.delay}
        />
      </Stack>
    </Grid>
  );
}
