import { CircularProgress } from '@mui/material';
import { Grid, Stack, InputLabel, FormHelperText, Button } from '@mui/material';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { useProductControllerCreateMediaPressignedUrl } from 'hooks/api/zapdiviserComponents';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router';

export default function AudioType({
  getFieldProps,
  touched,
  errors,
  setFieldValue
}: {
  getFieldProps: any;
  touched: any;
  errors: any;
  setFieldValue: any;
}) {
  const audioValue = getFieldProps('audio')?.value || undefined;

  const [loading, setLoading] = useState(false);

  const { product_id } = useParams();

  const { mutateAsync: createUrl } = useProductControllerCreateMediaPressignedUrl();

  const getAudioSource = (audio: any) => {
    if (audio instanceof File) {
      return URL.createObjectURL(audio);
    }

    if (audio instanceof String) {
      return audio as string;
    }
  };

  const uploadAudio = async (audio: any) => {
    setLoading(true);
    const { upload_url, id } = (await createUrl({
      pathParams: {
        productId: product_id as string
      }
    })) as any;

    const formData = new FormData();
    formData.append('file', audio);

    await fetch(upload_url, {
      method: 'PUT',
      body: audio
    });

    setFieldValue('audio', id);

    setLoading(false);
  };

  const AudioComponent = useCallback(() => {
    if (loading) {
      return (
        <Stack
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <CircularProgress />
        </Stack>
      );
    }

    if (audioValue) {
      return (
        <Grid container alignItems={'center'}>
          <Grid xs={9} item>
            <audio
              controls
              style={{
                width: '100%'
              }}
            >
              <source src={`https://minio-api.zapdiviser.vitordaniel.com/zapdiviser/${audioValue}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Grid>
          <Grid xs={3} item justifyContent={'center'} alignItems={'center'} display={'flex'}>
            <Button variant="contained" color="error" onClick={() => setFieldValue('audio', undefined)}>
              Deletar
            </Button>
          </Grid>
        </Grid>
      );
    }

    return (
      <SingleFileUpload
        setFieldValue={(name: string, files: File[]) => {
          uploadAudio(files[0]);
        }}
        file={audioValue}
        error={touched.audio && !!errors.audio}
      />
    );
  }, [loading, audioValue]);

  return (
    <Grid item xs={12} md={10}>
      <Stack spacing={1.25}>
        <InputLabel htmlFor="audio">{'Audio'}</InputLabel>
        {<AudioComponent />}
        {touched.audio && errors.audio && (
          <FormHelperText error id="standard-weight-helper-text-password-login">
            {errors.files}
          </FormHelperText>
        )}
      </Stack>
    </Grid>
  );
}
