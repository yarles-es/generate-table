/* eslint-disable no-console */
/* eslint-disable react-hooks/exhaustive-deps */
import { Alert, Button } from 'antd';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { IColumn, IItens } from 'interfaces/db.interfaces';
import { useEffect, useState } from 'react';
import generateItensWhithLengthDates from 'renderer/utils/generateItensWhithLengthDates';
import './style.css';

declare module 'jspdf' {
  export interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
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
  const [error, setError] = useState<string>('');

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

  const resetVisionTableAndDates = async () => {
    await window.electron.ipcRenderer.addDates([]);
    visionTable();
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

  const validateInitialDateBiggerFinalDate = (dates: string[]) => {
    if (dates.length === 0) {
      setError(
        'Não há datas cadastradas, volte e verifique se data inicial é menor que a data final e se o intervalo entre elas possui alguma sexta-feira'
      );
    }
  };

  useEffect(() => {
    const test = async () => {
      const [columns, dates, itens] = await Promise.all([
        getColumns(),
        getDates(),
        getItens(),
      ]);
      validateInitialDateBiggerFinalDate(dates);
      organizationItensWhithColumn({ columns, dates, itens });
      setDataColumns(columns);
      setDataDate(dates);
      setDataItens(itens);
    };
    test();
  }, []);

  const exportToPDF = () => {
    // eslint-disable-next-line new-cap
    const pdf = new jsPDF();
    pdf.autoTable({
      html: '#tableToExport',
      theme: 'striped',
      startY: 10,
      styles: { fontSize: 5 },
      bodyStyles: { fontSize: 5 },
    });
    pdf.save(
      `tabela-plantão-${dataDate[0]}-a-${dataDate[dataDate.length - 1]}.pdf`
    );
  };

  if (!dataColumns.length || !dataItens.length) {
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
      <Button type="primary" onClick={resetVisionTableAndDates}>
        Voltar
      </Button>
      {error ? (
        <Alert showIcon message={error} type="error" />
      ) : (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Button
            type="dashed"
            style={{ marginTop: '20px' }}
            onClick={exportToPDF}
          >
            Exportar para PDF
          </Button>
          {objectItensWhithLengthDates.length > 0 && (
            <table id="tableToExport" className="table-planting">
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
      )}
    </div>
  );
}

export default TablePlanting;
