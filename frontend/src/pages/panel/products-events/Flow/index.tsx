import { useCallback, useEffect } from 'react';
import ReactFlow, { Background, Controls, addEdge, useEdgesState, useNodesState } from 'reactflow';

import 'reactflow/dist/style.css';
import AddNew from './flow-types/add-new';
import { Message } from './flow-types/message';
import { useProductControllerFindOne } from 'hooks/api/zapdiviserComponents';
import { useParams } from 'react-router';
import addNewCard from './helpers/add-new-card';
import addNewEdge from './helpers/add-new-edge';
import { Delay } from './flow-types/delay';
import { File } from './flow-types/file';

const nodeTypes = {
  add_new: AddNew,
  message: Message,
  delay: Delay,
  file: File
};

export default function Flow() {
  const { product_id, flow_name } = useParams();

  const { data } = useProductControllerFindOne({
    pathParams: {
      id: product_id as string
    }
  });

  const [nodesState, setNodesState] = useNodesState<any>([]);

  const [edges, setEdges] = useEdgesState<any>([]);

  const convertNodesAndEdges = useCallback(function convertNodesAndEdges(oldNodes: any[], edges: any[]) {
    const nodes = oldNodes.filter((node: any) => !node.id?.includes('add-new')).map(addNewCard);

    const nodesWithPlus = nodes.reduce((prev, current, index, data) => {
      const itemId = current.id;
      const nextItemId = data[index + 1]?.id;

      const plusButton = addNewCard(
        {
          id: `add-new-from-${itemId}-to-${nextItemId}`,
          type: 'add_new',
          sort: current.data.sort + 1,
          data: { label: '+' },
          position: {
            x: current.type === 'delay' ? current.position.x + 332 : current.position.x + 402,
            y: 297
          }
        },
        index
      );

      prev.push(current);
      prev.push(plusButton);

      return prev;
    }, [] as any);

    if (nodesWithPlus.length === 0) {
      nodesWithPlus.push(
        addNewCard(
          {
            id: `add-new-from-start-to-end`,
            type: 'add_new',
            sort: 0,
            data: { label: '+' },
            position: {
              x: 450,
              y: 250
            }
          },
          0
        )
      );
    }

    const edgesConverted = nodesWithPlus.map(addNewEdge);

    return { nodesConverted: nodesWithPlus, edgesConverted };
  }, []);

  useEffect(() => {
    const nodes = (data?.flows?.find((x) => x.name === flow_name)?.events as []) || [];

    const nodesSorted = nodes.sort((a: any, b: any) => a.sort - b.sort);
    const { nodesConverted, edgesConverted } = convertNodesAndEdges(nodesSorted, edges);
    setNodesState(nodesConverted);
    setEdges(edgesConverted as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, flow_name]);

  const onConnect = useCallback((params: any) => setEdges((es) => addEdge(params, es)), [setEdges]);

  return (
    <div style={{ width: '100%', height: '80vh', boxShadow: '0px 0px 5px 0px rgba(0,0,0,0.55)', marginLeft: '30px', borderRadius: '15px' }}>
      <ReactFlow nodes={nodesState} edges={edges} onConnect={onConnect} nodeTypes={nodeTypes}>
        <Controls />
        <Background gap={12} size={1} color="#d8d3d3" />
      </ReactFlow>
    </div>
  );
}
