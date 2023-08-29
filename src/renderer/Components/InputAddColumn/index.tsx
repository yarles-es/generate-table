import React from 'react';
import { Input, Space } from 'antd';
import { useGlobalDispatch } from 'renderer/Context/GlobalContext';

const { Search } = Input;

function InputAddColumn() {
  const dispatch = useGlobalDispatch();
  const [value, setValue] = React.useState('');

  const handleChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setValue(target.value);
  };

  const onSearch = async (valueInput: string) => {
    if (valueInput) {
      const column = await window.electron.ipcRenderer.getColumns();
      const lastIdColumn = column[column.length - 1]?.id;
      const newColumn = {
        id: lastIdColumn ? lastIdColumn + 1 : 1,
        column: valueInput,
      };
      const columns = await window.electron.ipcRenderer.addColumn(newColumn);
      dispatch({ type: 'ADD_COLUMN', payload: columns });
      setValue('');
    }
  };

  return (
    <Space direction="vertical">
      <Search
        value={value}
        onChange={handleChange}
        placeholder="Nome da coluna"
        enterButton="Criar"
        size="large"
        onSearch={onSearch}
      />
    </Space>
  );
}

export default InputAddColumn;
