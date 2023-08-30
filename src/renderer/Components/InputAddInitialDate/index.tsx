import { DatePicker, DatePickerProps, Space } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import { useEffect, useState } from 'react';
import { useGlobalDispatch } from 'renderer/Context/GlobalContext';

type PropTypes = {
  label: string;
  action: string;
  value: string;
};

function InputAddDate({ label, action, value }: PropTypes) {
  const dispatch = useGlobalDispatch();

  const generateValue = (dateString: string) => {
    if (dateString) {
      const newDate = dayjs(dateString, 'DD-MM-YYYY');
      return newDate;
    }
    return undefined;
  };

  const [valueDate, setValueDate] = useState<dayjs.Dayjs | undefined>(
    generateValue(value)
  );

  useEffect(() => {
    if (value) {
      setValueDate(generateValue(value));
    }
  }, [value]);

  const onChange: DatePickerProps['onChange'] = async (date, dateString) => {
    if (dateString) {
      if (action === 'SET_DATE_FINAL') {
        const dateFinal = await window.electron.ipcRenderer.addDateFinal(
          dateString
        );
        dispatch({ type: 'SET_DATE_FINAL', payload: dateFinal });
      } else {
        const dateInitial = await window.electron.ipcRenderer.addDateInitial(
          dateString
        );
        dispatch({ type: action, payload: dateInitial });
      }
    }
  };

  return (
    <Space
      style={{
        marginRight: 20,
      }}
      direction="vertical"
    >
      <DatePicker
        format="DD/MM/YYYY"
        value={valueDate}
        placeholder={label}
        onChange={onChange}
      />
    </Space>
  );
}

export default InputAddDate;
