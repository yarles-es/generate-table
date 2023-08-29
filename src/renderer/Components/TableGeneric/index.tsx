import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { IColumn, IColumnItem } from '../../../interfaces/db.interfaces';
import { useGlobalDispatch } from '../../Context/GlobalContext';

type TypeProps = {
  columns: IColumn[];
  itensColumn: IColumnItem[];
};

type ItemColum = {
  key: number;
  [key: number]: string;
};

function TableGeneric({ columns, itensColumn }: TypeProps) {
  const dispatch = useGlobalDispatch();

  const handleDelete = async (key: number) => {
    const response = await window.electron.ipcRenderer.deleteColumnItem(key);
    dispatch({ type: 'DELETE_COLUMN_ITEM', payload: response });
  };

  const handleDeleteColumn = async (key: number) => {
    const response = await window.electron.ipcRenderer.deleteColumn(key);
    dispatch({ type: 'SET_ALL_DATA_BASE', payload: response });
  };

  const moveItemDown = async (key: number) => {
    const response = await window.electron.ipcRenderer.moveItemDown(key);
    dispatch({ type: 'MOVE_ITEM_DOWN', payload: response });
  };

  const moveItemUp = async (key: number) => {
    const response = await window.electron.ipcRenderer.moveItemUp(key);
    dispatch({ type: 'MOVE_ITEM_UP', payload: response });
  };

  const generateColumnTable = (column: IColumn) => {
    const columnTable: ColumnsType<ItemColum> = [
      {
        title: column.column,
        dataIndex: column.id,
        key: column.id,
      },
    ];
    const deleteColumn: ColumnsType<ItemColum> = [
      {
        title: (
          <div>
            <Button onClick={() => handleDeleteColumn(column.id)}>X</Button>
          </div>
        ),
        key: 'action',
        render: (_, record) => (
          <>
            <button type="button" onClick={() => moveItemUp(record.key)}>
              &#8593;
            </button>
            <button type="button" onClick={() => moveItemDown(record.key)}>
              &#8595;
            </button>
            <button type="button" onClick={() => handleDelete(record.key)}>
              x
            </button>
          </>
        ),
      },
    ];

    return [...columnTable, ...deleteColumn];
  };

  const generateItensTable = (column: IColumn) => {
    const itensTable: ItemColum[] = [];
    itensColumn.forEach((item) => {
      if (item.columnId === column.id) {
        itensTable.push({ key: item.id, [column.id]: item.name });
      }
    });
    return itensTable;
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'baseline',
        flexWrap: 'wrap',
      }}
    >
      {columns.map((column) => (
        <Table
          style={{ margin: 10 }}
          key={column.id}
          columns={generateColumnTable(column)}
          dataSource={generateItensTable(column)}
          pagination={false}
        />
      ))}
    </div>
  );
}

export default TableGeneric;
