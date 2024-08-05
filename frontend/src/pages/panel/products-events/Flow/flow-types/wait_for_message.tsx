import { useTheme, styled } from '@mui/material';
import { useFunnel } from 'contexts/FunnelContext';
import { Message } from 'iconsax-react';
import { Handle, Position } from 'reactflow';

const TypeBox = styled('div')(({ theme }) => ({
  width: '100%',
  background: theme.palette.primary.lighter,
  padding: '10px',
  fontWeight: 'bold',
  color: theme.palette.primary.main
}));


export function WaitForMessage({ data }: any) {
  const { dispatch } = useFunnel();
  const theme = useTheme();

  return (
    <>
      <div
        onClick={() =>
          dispatch({
            type: 'OPEN_ADD_NEW_FUNNEL_MODAL',
            payload: {
              data: {
                type: 'wait_for_message',
                id: data?.id
              }
            }
          })
        }
        style={{
          background: '#fff',
          borderRadius: '5px',
          boxShadow: `0px 0px 5px 0px ${theme.palette.primary.main}`,
          minWidth: '200px',
          overflow: 'hidden',
          paddingBottom: '0'
        }}
      >
        <div>
          <TypeBox>
            <Message size={14} />
            <span
              style={{
                marginLeft: '10px'
              }}
            >
              Esperar por receber uma mensagem
            </span>
          </TypeBox>
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
