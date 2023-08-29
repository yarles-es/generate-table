export interface IColumn {
  id: number;
  column: string;
}

export interface IColumnItem {
  id: number;
  name: string;
  columnId: number;
}

export interface IDataBase {
  columns: IColumn[];
  rows: IColumnItem[];
  finalDate: string;
  initialDate: string;
  dates: string[];
}

export type IItens = {
  id: number;
  name: string;
  columnId: number;
};
