/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import { Button } from 'antd';
import { IColumn, IItens } from 'interfaces/db.interfaces';
import { useEffect, useState } from 'react';
import generateItensWhithLengthDates from 'renderer/utils/generateItensWhithLengthDates';
import './style.css';

interface IObjectItensWhithColumn {
  idColumn: number;
  nameColumn: string;
  itensWhithLengthDates: IItens[];
}

type organizationItensWhithColumnProps = {
  columns: IColumn[];
  dates: string[];
  itens: IItens[];
};

type PropTypes = {
  visionTable: () => void;
};

function TablePlanting({ visionTable }: PropTypes) {
  const [dataColumns, setDataColumns] = useState<IColumn[]>([]);
  const [dataItens, setDataItens] = useState<IItens[]>([]);
  const [dataDate, setDataDate] = useState<string[]>([]);
  const [objectItensWhithLengthDates, setObjectItensWhithLengthDates] =
    useState<IObjectItensWhithColumn[]>([]);

  const organizationItensWhithColumn = ({
    columns,
    dates,
    itens,
  }: organizationItensWhithColumnProps) => {
    const test = columns.map((column) => {
      const itensFiltered = itens.filter((item) => item.columnId === column.id);
      const newItensWhithLengthDates = generateItensWhithLengthDates(
        dates.length,
        itensFiltered,
        column.id
      );
      return {
        idColumn: column.id,
        nameColumn: column.column,
        itensWhithLengthDates: newItensWhithLengthDates,
      };
    });
    setObjectItensWhithLengthDates(test);
  };

  const getColumns = async (): Promise<IColumn[]> => {
    const currentColumns = await window.electron.ipcRenderer.getColumns();
    return currentColumns;
  };

  const getDates = async (): Promise<string[]> => {
    const dates = await window.electron.ipcRenderer.getDates();
    return dates;
  };

  const getItens = async (): Promise<IItens[]> => {
    const currentItens = await window.electron.ipcRenderer.getColumnItems();
    return currentItens;
  };

  useEffect(() => {
    const test = async () => {
      const [columns, dates, itens] = await Promise.all([
        getColumns(),
        getDates(),
        getItens(),
      ]);
      organizationItensWhithColumn({ columns, dates, itens });
      setDataColumns(columns);
      setDataDate(dates);
      setDataItens(itens);
    };
    test();
  }, []);

  if (!dataColumns.length || !dataDate.length || !dataItens.length) {
    return <h1>Loading...</h1>;
  }
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20px',
      }}
    >
      <Button type="primary" onClick={visionTable}>
        Voltar
      </Button>
      {objectItensWhithLengthDates.length > 0 && (
        <table className="table-planting">
          <thead>
            <tr className="tr-planting">
              {objectItensWhithLengthDates.map((column) => (
                <th key={column.idColumn} className="th-planting">
                  {column.nameColumn}
                </th>
              ))}
              <th className="th-planting">DATAS</th>
            </tr>
          </thead>
          <tbody>
            {dataDate.map((date, index) => (
              <tr key={date} className="tr-planting">
                {objectItensWhithLengthDates.map((column) => (
                  <td key={column.idColumn} className="td-planting">
                    {column.itensWhithLengthDates[index]?.name || '-'}
                  </td>
                ))}
                <td className="td-planting">{date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default TablePlanting;
