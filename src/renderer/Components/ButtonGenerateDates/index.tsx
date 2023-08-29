import { Button } from 'antd';
import { isFriday, addDays, isBefore, parse, format } from 'date-fns';
import {
  useGlobalDispatch,
  useGlobalState,
} from 'renderer/Context/GlobalContext';

type PropTypes = {
  visionTable: () => void;
};

function ButtonGenerateDates({ visionTable }: PropTypes) {
  const state = useGlobalState();
  const dispatch = useGlobalDispatch();

  function stringToDate(dateStr: string): Date {
    return parse(dateStr, 'yyyy-MM-dd', new Date());
  }

  function dateToString(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  function getAllFridaysBetweenDates(
    startDateString: string,
    endDateString: string
  ): string[] {
    const startDate = stringToDate(startDateString);
    const endDate = stringToDate(endDateString);

    const fridays: string[] = [];
    let currentDate = startDate;

    while (
      isBefore(currentDate, endDate) ||
      currentDate.getTime() === endDate.getTime()
    ) {
      if (isFriday(currentDate)) {
        fridays.push(dateToString(new Date(currentDate)));
      }
      currentDate = addDays(currentDate, 1);
    }

    return fridays;
  }

  const validateVisionButton = () => {
    if (
      state.initialDate !== '' &&
      state.finalDate !== '' &&
      state.columns.length > 0 &&
      state.rows.length > 0
    ) {
      return true;
    }
    return false;
  };

  const generateDates = async () => {
    const initialDate = await window.electron.ipcRenderer.getDateInitial();
    const finalDate = await window.electron.ipcRenderer.getDateFinal();
    const dates = getAllFridaysBetweenDates(initialDate, finalDate);
    const newDates = await window.electron.ipcRenderer.addDates(dates);
    dispatch({ type: 'SET_DATES', payload: newDates });
    visionTable();
  };

  return (
    <div>
      {validateVisionButton() ? (
        <Button size="large" type="primary" style={{}} onClick={generateDates}>
          Gerar / Visualizar Tabela
        </Button>
      ) : null}
    </div>
  );
}

export default ButtonGenerateDates;
