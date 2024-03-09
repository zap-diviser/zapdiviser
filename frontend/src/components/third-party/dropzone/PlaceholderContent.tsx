// material-ui
import { Typography, Stack, CardMedia } from '@mui/material';

// assets
import { Camera } from 'iconsax-react';
import UploadCover from 'assets/images/upload/file.jpg';

// types
import { DropzopType } from 'types/dropzone';

// ==============================|| UPLOAD - PLACEHOLDER ||============================== //

export default function PlaceholderContent({ type }: { type?: string }) {
  return (
    <>
      {type !== DropzopType.standard && (
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          direction={{ xs: 'column', md: 'row' }}
          sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
        >
          <CardMedia component="img" image={UploadCover} sx={{ width: 120, marginLeft: 2 }} />
          <Stack sx={{ p: 3 }} spacing={1}>
            <Typography variant="h5">Arraste e Solte ou Selecione Arquivos</Typography>

            <Typography color="secondary">
              Solte os arquivos aqui ou clique&nbsp;
              <Typography component="span" color="primary" sx={{ textDecoration: 'underline' }}>
                aqui
              </Typography>
            </Typography>
          </Stack>
        </Stack>
      )}
      {type === DropzopType.standard && (
        <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
          <Camera style={{ fontSize: '32px' }} />
        </Stack>
      )}
    </>
  );
}
