export default function addNewCard(data: any, index: number) {
  let position = data.position || {};

  if (!data.position) {
    switch (data.type) {
      case 'delay': {
        position = {
          x: 250 + 550 * index,
          y: 297
        };
        break;
      }
      case 'audio': {
        position = {
          x: 250 + 550 * index,
          y: 245
        };
        break;
      }
      default: {
        position = {
          x: 250 + 550 * index,
          y: 250
        };
        break;
      }
    }
  }

  return {
    id: data.id,
    position,
    data,
    type: data.type
  };
}
