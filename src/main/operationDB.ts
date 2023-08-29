import path from 'path';
import { promises as fs } from 'fs';
import * as isDev from 'electron-is-dev';
import { IColumn, IColumnItem, IDataBase } from '../interfaces/db.interfaces';

const dbPath = isDev
  ? path.join(__dirname, 'db.json')
  : path.join(process.resourcesPath, 'src', 'main', 'db.json');

async function readDataBase() {
  const rawData = await fs.readFile(dbPath, 'utf8');
  return JSON.parse(rawData);
}

async function saveDatabase(data: JSON) {
  const dataString = JSON.stringify(data, null, 2);
  await fs.writeFile(dbPath, dataString);
}

export async function addColumnsToDataBase(column: IColumn): Promise<void> {
  const data = await readDataBase();
  column.column = column.column?.toUpperCase();
  data.columns.push(column);
  await saveDatabase(data);
}

export async function getColumns(): Promise<IColumn[]> {
  const data = await readDataBase();
  return data.columns;
}

export async function getAllDataBase(): Promise<IDataBase> {
  const data = await readDataBase();
  return data;
}

export async function deleteColumn(id: number): Promise<IDataBase> {
  const data = await readDataBase();
  data.columns = data.columns.filter((column: IColumn) => column.id !== id);

  const filterRows = data.rows.filter(
    (row: IColumnItem) => row.columnId !== id
  );
  data.rows = filterRows;
  await saveDatabase(data);
  const dataBase = await getAllDataBase();
  return dataBase;
}

export async function updateColumn(column: IColumn): Promise<IColumn[]> {
  const data = await readDataBase();
  data.columns = data.columns.map((item: IColumn) => {
    if (item.id === column.id) {
      item.column = column.column;
      return item;
    }
    return item;
  });
  await saveDatabase(data);
  const columns = await getColumns();
  return columns;
}

export async function getColumnItems(): Promise<IColumnItem[]> {
  const data = await readDataBase();
  return data.rows;
}

export async function addColumnItemToDataBase(
  columnItem: IColumnItem
): Promise<IColumnItem[]> {
  columnItem.name = columnItem.name?.toUpperCase();
  const data = await readDataBase();
  data.rows.push(columnItem);
  await saveDatabase(data);
  const itens = await getColumnItems();
  return itens;
}

export async function deleteColumnItem(id: number): Promise<IColumnItem[]> {
  const data = await readDataBase();
  data.rows = data.rows.filter((row: IColumnItem) => row.id !== id);
  await saveDatabase(data);
  const itens = await getColumnItems();
  return itens;
}

export async function getDateInitialFromDataBase(): Promise<string> {
  const data = await readDataBase();
  return data.initialDate;
}

export async function getDateFinalFromDataBase(): Promise<string> {
  const data = await readDataBase();
  return data.finalDate;
}

export async function addDateInitialToDataBase(date: string): Promise<string> {
  const data = await readDataBase();
  data.initialDate = date;
  await saveDatabase(data);
  const newDate = await getDateInitialFromDataBase();
  return newDate;
}

export async function addDateFinalToDataBase(date: string): Promise<string> {
  const data = await readDataBase();
  data.finalDate = date;
  await saveDatabase(data);
  const newDate = await getDateFinalFromDataBase();
  return newDate;
}

export async function resetDataBase(): Promise<IDataBase> {
  const data = await readDataBase();
  data.columns = [];
  data.rows = [];
  data.initialDate = '';
  data.finalDate = '';
  data.dates = [];
  await saveDatabase(data);
  const datBase = await getAllDataBase();
  return datBase;
}

export async function moveItemDown(id: number): Promise<IColumnItem[]> {
  const data = await readDataBase();
  const index = data.rows.findIndex((item: IColumnItem) => item.id === id);

  const nextItemIndex = data.rows
    .slice(index + 1)
    .findIndex(
      (item: IColumnItem) => item.columnId === data.rows[index].columnId
    );
  if (nextItemIndex === -1) {
    const itens = await getColumnItems();
    return itens;
  }

  const item = data.rows[index];
  const actualNextIndex = index + 1 + nextItemIndex;
  data.rows[index] = data.rows[actualNextIndex];
  data.rows[actualNextIndex] = item;

  await saveDatabase(data);
  const itens = await getColumnItems();
  return itens;
}

export async function moveItemUp(id: number): Promise<IColumnItem[]> {
  const data = await readDataBase();
  const index = data.rows.findIndex((item: IColumnItem) => item.id === id);

  const prevItemIndex = data.rows
    .slice(0, index)
    .reverse()
    .findIndex(
      (item: IColumnItem) => item.columnId === data.rows[index].columnId
    );
  if (prevItemIndex === -1) {
    const itens = await getColumnItems();
    return itens;
  }

  const item = data.rows[index];
  const actualPrevIndex = index - 1 - prevItemIndex;
  data.rows[index] = data.rows[actualPrevIndex];
  data.rows[actualPrevIndex] = item;

  await saveDatabase(data);
  const itens = await getColumnItems();
  return itens;
}

export async function getAllDates(): Promise<string[]> {
  const data = await readDataBase();
  return data.dates;
}

export async function addDatesToDataBase(dates: string[]): Promise<string[]> {
  const data = await readDataBase();
  data.dates = dates;
  await saveDatabase(data);
  const allDates = await getAllDates();
  return allDates;
}
