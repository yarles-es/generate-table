import React, {
  createContext,
  useReducer,
  useContext,
  ReactNode,
  Dispatch,
} from 'react';
import { IDataBase } from '../../interfaces/db.interfaces';

const initialState: IDataBase = {
  columns: [],
  rows: [],
  initialDate: '',
  finalDate: '',
  dates: [],
};

type Action = {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any;
};

const globalReducer = (state: IDataBase, action: Action) => {
  switch (action.type) {
    case 'SET_ALL_DATA_BASE':
      return {
        ...state,
        columns: [...action.payload.columns],
        rows: [...action.payload.rows],
        initialDate: action.payload.initialDate,
        finalDate: action.payload.finalDate,
        dates: [...action.payload.dates],
      };
    case 'ADD_COLUMN':
      return {
        ...state,
        columns: [...action.payload],
      };
    case 'DELETE_COLUMN_ITEM':
      return {
        ...state,
        rows: [...action.payload],
      };
    case 'ADD_COLUMN_ITEM':
      return {
        ...state,
        rows: [...action.payload],
      };
    case 'SET_DATE_INITIAL':
      return {
        ...state,
        initialDate: action.payload,
      };
    case 'SET_DATE_FINAL':
      return {
        ...state,
        finalDate: action.payload,
      };
    case 'MOVE_ITEM_UP':
      return {
        ...state,
        rows: [...action.payload],
      };
    case 'MOVE_ITEM_DOWN':
      return {
        ...state,
        rows: [...action.payload],
      };
    case 'SET_DATES':
      return {
        ...state,
        dates: [...action.payload],
      };
    default:
      return state;
  }
};

const GlobalStateContext = createContext<IDataBase | undefined>(undefined);
const GlobalDispatchContext = createContext<Dispatch<Action> | undefined>(
  undefined
);

interface Props {
  children: ReactNode;
}

export const GlobalProvider: React.FC<Props> = function MyGlobalProvider({
  children,
}) {
  const [state, dispatch] = useReducer(globalReducer, initialState);

  return (
    <GlobalStateContext.Provider value={state}>
      <GlobalDispatchContext.Provider value={dispatch}>
        {children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = (): IDataBase => {
  const context = useContext(GlobalStateContext);
  if (context === undefined) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }
  return context;
};

export const useGlobalDispatch = (): Dispatch<Action> => {
  const context = useContext(GlobalDispatchContext);
  if (context === undefined) {
    throw new Error('useGlobalDispatch must be used within a GlobalProvider');
  }
  return context;
};
