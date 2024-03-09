import { Button } from '@mui/material';
import { useFunnel } from 'contexts/FunnelContext';
import { Handle, Position } from 'reactflow';

export default function AddNew({ data }: any) {
  const { dispatch } = useFunnel();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={() =>
        dispatch({
          type: 'OPEN_ADD_NEW_FUNNEL_MODAL',
          payload: {
            data: {
              sort: data.sort,
              isNew: true
            }
          }
        })
      }
    >
      <Button
        variant="contained"
        color="primary"
        sx={{
          width: '60px',
          height: '60px',
          zoom: 0.7,
          borderRadius: '50%',
          fontSize: '30px',
          fontWeight: 'bold'
        }}
      >
        {data.data.label}
      </Button>
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
    </div>
  );
}
