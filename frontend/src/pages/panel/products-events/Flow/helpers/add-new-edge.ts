export default function addNewEdge(node: any, index: number, list: Array<any>) {
  console.log('node', node);
  return {
    id: `${node.id}-${list[index + 1]?.id}`,
    source: `${node?.id}`,
    target: `${list[index + 1]?.id}`
  };
}
