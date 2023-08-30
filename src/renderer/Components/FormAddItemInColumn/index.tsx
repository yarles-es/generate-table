import React, { useEffect, useRef, useState } from 'react';
import { Input, Select, Space } from 'antd';
import { useGlobalDispatch, useGlobalState } from '../../Context/GlobalContext';
import { IColumnItem } from '../../../interfaces/db.interfaces';

const { Search } = Input;

function FormAddItemInColumn() {
  const dispatch = useGlobalDispatch();

  const [itemColumn, setItemColumn] = useState<IColumnItem>({
    id: 0,
    columnId: 0,
    name: '',
  });
  const [key, setKey] = useState<number>(0);

  const state = useGlobalState();
  const prevColumnsLength = useRef(state.columns.length);

  useEffect(() => {
    if (state.columns.length === 0 || prevColumnsLength.current > 0) {
      setKey(key + 1);
      setItemColumn({ id: 0, columnId: 0, name: '' });
    }
    prevColumnsLength.current = state.columns.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.columns]);

  const onSearch = async (value: string) => {
    if (value && itemColumn.columnId !== 0) {
      const itensColumn = await window.electron.ipcRenderer.getColumnItems();
      const lastIdRow = itensColumn[itensColumn.length - 1]?.id;
      const newRow = {
        id: lastIdRow ? lastIdRow + 1 : 1,
        columnId: itemColumn.columnId,
        name: value,
      };
      const rows = await window.electron.ipcRenderer.addColumnItem(newRow);
      dispatch({ type: 'ADD_COLUMN_ITEM', payload: rows });
      setItemColumn({ id: 0, columnId: newRow.columnId, name: '' });
    }
  };

  const generateOptions = () => {
    if (!state.columns) return [];
    const options = state.columns.map((column) => {
      return { value: column.id, label: column.column };
    });
    return options;
  };

  const setColumnId = (value: number) => {
    setItemColumn({ ...itemColumn, columnId: value });
  };

  const setName = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setItemColumn({ ...itemColumn, name: target.value });
  };

  return (
    <Space
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
      }}
      direction="horizontal"
    >
      <Select
        key={key}
        onChange={setColumnId}
        style={{ width: 300 }}
        placeholder="Selecione a coluna"
        options={generateOptions()}
        size="large"
      />
      <Search
        style={{ width: 400 }}
        value={itemColumn.name}
        onChange={setName}
        placeholder="Nome do funcionario"
        enterButton="Criar"
        size="large"
        onSearch={onSearch}
      />
    </Space>
  );
}

export default FormAddItemInColumn;
