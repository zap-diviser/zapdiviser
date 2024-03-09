import { createContext, useReducer, ReactElement, useContext } from 'react';

interface IFunnelContext {
  openAddNewFunnelModal: boolean;
  funnelData: any;
  nodes: any[];
}

const initialState: IFunnelContext = {
  openAddNewFunnelModal: false,
  funnelData: null,
  nodes: []
};

const FunnelContext = createContext<
  | (IFunnelContext & {
      dispatch: any;
    })
  | null
>(null);

const FunnelReducer = (state: any, action: any) => {
  switch (action.type) {
    case 'OPEN_ADD_NEW_FUNNEL_MODAL':
      console.log('action', action);
      return {
        ...state,
        openAddNewFunnelModal: true,
        funnelData: action?.payload?.data
      };
    case 'CLOSE_ADD_NEW_FUNNEL_MODAL': {
      return {
        ...state,
        openAddNewFunnelModal: false
      };
    }
    case 'ADD_NEW_FUNNEL_CARD': {
      const { nodes } = state;
      const { data } = action.payload;
      const id = nodes.length + 1;
      const newNode = { id: id.toString(), data, type: 'Message' };
      return {
        ...state,
        nodes: [...nodes, newNode]
      };
    }
    case 'DELETE_FUNNEL_CARD': {
      const { nodes } = state;
      const { id } = action.payload;
      const newNodes = nodes.filter((node: any) => String(node.id) !== String(id));
      return {
        ...state,
        nodes: newNodes
      };
    }
    default:
      return state;
  }
};

export const FunnelProvider = ({ children }: { children: ReactElement }) => {
  const [state, dispatch] = useReducer(FunnelReducer, initialState);

  return (
    <FunnelContext.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
};

export const useFunnel = () => {
  const context = useContext(FunnelContext);

  if (!context) throw new Error('context must be use inside provider');

  return context;
};
