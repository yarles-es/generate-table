import { useEffect, useState } from 'react';
import ButtonGenerateDates from 'renderer/Components/ButtonGenerateDates';
import ButtonResetDB from 'renderer/Components/ButtonResetDB';
import FormAddItemInColumn from 'renderer/Components/FormAddItemInColumn';
import Header from 'renderer/Components/Header';
import InputAddColumn from 'renderer/Components/InputAddColumn';
import InputAddDate from 'renderer/Components/InputAddInitialDate';
import TableGeneric from 'renderer/Components/TableGeneric';
import TablePlanting from 'renderer/Components/TablePlanting';
import {
  useGlobalDispatch,
  useGlobalState,
} from 'renderer/Context/GlobalContext';

function HomePage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [visionTable, setVisionTable] = useState<boolean>(false);
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();
  const getDataBase = async () => {
    const response = await window.electron.ipcRenderer.getAllDataBase();
    dispatch({ type: 'SET_ALL_DATA_BASE', payload: response });
  };

  useEffect(() => {
    getDataBase();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 'auto',
      }}
    >
      <Header />

      {state.columns.length > 0 &&
      state.rows.length > 0 &&
      state.dates.length > 0 &&
      visionTable ? (
        <TablePlanting visionTable={() => setVisionTable(!visionTable)} />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            margin: 'auto',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              marginBottom: 10,
              marginTop: 20,
            }}
          >
            <InputAddColumn />
            <FormAddItemInColumn />
          </div>
          <h3
            style={{
              fontFamily: 'Arial',
              color: '#333',
            }}
          >
            Padrao de inicio de plantão setado para sexta-feira
          </h3>
          <div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <InputAddDate
                label="Data inicial"
                action="SET_DATE_INITIAL"
                value={state.initialDate}
              />
              <InputAddDate
                label="Data final"
                action="SET_DATE_FINAL"
                value={state.finalDate}
              />
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 10,
            }}
          >
            <ButtonGenerateDates
              visionTable={() => setVisionTable(!visionTable)}
            />
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 10,
              marginTop: 10,
            }}
          >
            <ButtonResetDB />
          </div>
          {state.columns.length > 0 ? (
            <TableGeneric columns={state.columns} itensColumn={state.rows} />
          ) : null}
        </div>
      )}
    </div>
  );
}

export default HomePage;
