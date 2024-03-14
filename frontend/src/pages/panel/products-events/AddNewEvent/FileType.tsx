import { CircularProgress, Link, Typography } from '@mui/material';
import { Grid, Stack, InputLabel, FormHelperText, Button } from '@mui/material';
import SingleFileUpload from 'components/third-party/dropzone/SingleFile';
import { useProductControllerCreateMediaUploadUrl } from 'hooks/api/zapdiviserComponents';
import { Document } from 'iconsax-react';
import { useCallback, useState } from 'react';
import { useParams } from 'react-router';

const allowedTypes = ['audio', 'image', 'video', 'document'];

export default function FileType({
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
  const fileValue = getFieldProps('file')?.value || undefined;
  const fileType = getFieldProps('file_type')?.value || undefined;

  const [loading, setLoading] = useState(false);

  const { product_id } = useParams();

  const { mutateAsync: createUrl } = useProductControllerCreateMediaUploadUrl();

  const uploadFile = async (file: any) => {
    const fileType = allowedTypes.find((type) => file.type.includes(type)) || 'document';

    setLoading(true);
    const { upload_url, id } = (await createUrl({
      pathParams: {
        productId: product_id as string
      }
    })) as any;

    const formData = new FormData();
    formData.append('file', file);

    await fetch(upload_url, {
      method: 'PUT',
      body: file
    });

    setFieldValue('file', id);
    setFieldValue('file_type', fileType);

    setLoading(false);
  };

  const FileComponent = useCallback(() => {
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

    if (!fileValue) {
      return (
        <SingleFileUpload
          setFieldValue={(name: string, files: File[]) => {
            uploadFile(files[0]);
          }}
          file={fileValue}
          error={touched.file && !!errors.audio}
        />
      );
    }

    switch (fileType) {
      case 'audio': {
        return (
          <Grid container alignItems={'center'}>
            <Grid xs={9} item>
              <audio
                controls
                style={{
                  width: '100%'
                }}
              >
                <source src={`https://minio-api.zapdiviser.vitordaniel.com/zapdiviser/${fileValue}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </Grid>
            <Grid xs={3} item justifyContent={'center'} alignItems={'center'} display={'flex'}>
              <Button variant="outlined" color="error" onClick={() => setFieldValue('file', undefined)}>
                Deletar Arquivo
              </Button>
            </Grid>
          </Grid>
        );
      }
      case 'image': {
        return (
          <>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
              }}
            >
              <img
                style={{
                  width: '300px',
                  marginBottom: '20px'
                }}
                src={`https://minio-api.zapdiviser.vitordaniel.com/zapdiviser/${fileValue}`}
                alt="image"
              />

              <Button variant="outlined" color="error" onClick={() => setFieldValue('file', undefined)}>
                Deletar Arquivo
              </Button>
            </div>
          </>
        );
      }
      case 'video': {
        return (
          <video
            controls
            style={{
              width: '100%'
            }}
          >
            <source src={`https://minio-api.zapdiviser.vitordaniel.com/zapdiviser/${fileValue}`} type="video/mp4" />
            Your browser does not support the video element.
          </video>
        );
      }
      case 'document': {
        return (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div
              style={{
                display: 'flex'
              }}
            >
              <Typography>
                <Link
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  href={`https://minio-api.zapdiviser.vitordaniel.com/zapdiviser/${fileValue}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Document
                    width="100%"
                    height="100%"
                    style={{
                      marginRight: '10px'
                    }}
                  />
                  {'Arquivo Salvo Com Sucesso! Abrir Documento'}
                </Link>
              </Typography>
            </div>

            <Button variant="outlined" color="error" onClick={() => setFieldValue('file', undefined)}>
              Deletar Arquivo
            </Button>
          </div>
        );
      }
    }
  }, [loading, fileValue, fileType]);

  return (
    <Grid item xs={12} md={10}>
      <Stack spacing={1.25}>
        <InputLabel htmlFor="file">{'Arquivo'}</InputLabel>
        {<FileComponent />}
        {touched.file && errors.file && (
          <FormHelperText error id="standard-weight-helper-text-password-login">
            {errors.file}
          </FormHelperText>
        )}
      </Stack>
    </Grid>
  );
}
