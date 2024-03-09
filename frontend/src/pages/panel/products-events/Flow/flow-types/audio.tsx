import { useTheme, styled, Divider } from '@mui/material';
import { Tooltip } from '@mui/material';
import { Typography } from '@mui/material';
import { useFunnel } from 'contexts/FunnelContext';
import { Handle, Position } from 'reactflow';

const Header = styled('div')(({ theme }) => ({
  width: '100%',
  background: theme.palette.primary.main,
  padding: '10px',
  fontWeight: 'bold',
  color: theme.palette.primary.lighter,
  display: 'flex',
  justifyContent: 'space-around'
}));

const TypeBox = styled('div')(({ theme }) => ({
  width: '100%',
  background: theme.palette.primary.lighter,
  fontWeight: 'bold',
  padding: '10px',
  color: theme.palette.primary.main,
  marginBottom: '10px'
}));

export function Audio({ data }: any) {
  const theme = useTheme();

  const { dispatch } = useFunnel();

  return (
    <>
      <div
        onClick={() =>
          dispatch({
            type: 'OPEN_ADD_NEW_FUNNEL_MODAL',
            payload: {
              data: {
                audio: data?.metadata?.audio,
                id: data?.id
              }
            }
          })
        }
        style={{
          background: '#fff',
          borderRadius: '5px',
          boxShadow: `0px 0px 5px 0px ${theme.palette.primary.main}`,
          width: '300px',
          overflow: 'hidden'
        }}
      >
        <Header>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {data?.sended || 0}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              Enviados
            </Typography>
          </div>
        </Header>
        <Divider />
        <div
          style={{
            padding: '10px'
          }}
        >
          <Tooltip title={data?.metadata?.message}>
            <audio
              controls
              style={{
                width: '100%'
              }}
            >
              <source src={`https://minio-api.zapdiviser.vitordaniel.com/zapdiviser/${data?.metadata?.audio}`} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </Tooltip>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Left}
        style={{
          opacity: 0,
          pointerEvents: 'none'
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        style={{
          opacity: 0,
          pointerEvents: 'none'
        }}
      />
    </>
  );
}
