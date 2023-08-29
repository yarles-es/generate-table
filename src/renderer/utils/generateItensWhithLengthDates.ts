import { IColumnItem, IItens } from 'interfaces/db.interfaces';

const generateItensWhithLengthDates = (
  lengthDates: number,
  itens: IColumnItem[],
  columnId: number
): IItens[] => {
  const names = itens.map((item) => item.name);
  const itensWithLengthDates = [];

  while (itensWithLengthDates.length < lengthDates) {
    itensWithLengthDates.push(...names);
  }

  const currentItens = itensWithLengthDates.slice(0, lengthDates);
  const itensWithColumnId = currentItens.map((item, index) => ({
    id: index,
    name: item,
    columnId,
  }));

  return itensWithColumnId;
};

export default generateItensWhithLengthDates;
