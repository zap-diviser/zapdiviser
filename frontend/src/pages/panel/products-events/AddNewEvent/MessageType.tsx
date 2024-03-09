import { Grid, TextField, Stack, InputLabel } from '@mui/material';

export default function MessageType({ getFieldProps, touched, errors }: { getFieldProps: any; touched: any; errors: any }) {
  return (
    <Grid item xs={12} md={10}>
      <Stack spacing={1.25}>
        <InputLabel htmlFor="message">Texto</InputLabel>
        <TextField
          fullWidth
          multiline
          rows={3}
          id="message"
          placeholder="Digite sua mensagem aqui"
          {...getFieldProps('message')}
          error={Boolean(touched.message && errors.message)}
          helperText={touched.message && errors.message}
        />
      </Stack>
    </Grid>
  );
}
