import { Button } from 'antd';
import { useGlobalDispatch } from 'renderer/Context/GlobalContext';

function ButtonResetDB() {
  const dispatch = useGlobalDispatch();

  const resetDB = async () => {
    const response = await window.electron.ipcRenderer.resetDatabase();
    dispatch({ type: 'GET_ALL_DATA', payload: response });
    window.location.reload();
  };

  return (
    <Button size="large" type="primary" danger onClick={resetDB}>
      Limpar Banco de Dados
    </Button>
  );
}

export default ButtonResetDB;
