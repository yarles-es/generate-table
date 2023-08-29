// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer } from 'electron';
import { IColumn, IColumnItem } from 'interfaces/db.interfaces';

export type Channels =
  | 'read-database-columns'
  | 'add-column'
  | 'delete-column'
  | 'add-column-item'
  | 'read-database-column-items'
  | 'delete-column-item'
  | 'reset-database'
  | 'get-all-database'
  | 'get-date-initial'
  | 'get-date-final'
  | 'add-date-initial'
  | 'add-date-final'
  | 'move-item-down'
  | 'move-item-up'
  | 'add-dates'
  | 'get-dates';

const electronHandler = {
  ipcRenderer: {
    getColumns: async () => {
      return ipcRenderer.invoke('read-database-columns');
    },

    addColumn: async (column: IColumn) => {
      return ipcRenderer.invoke('add-column', column);
    },

    deleteColumn: async (id: number) => {
      return ipcRenderer.invoke('delete-column', id);
    },

    addColumnItem: async (columnItem: IColumnItem) => {
      return ipcRenderer.invoke('add-column-item', columnItem);
    },

    getColumnItems: async () => {
      return ipcRenderer.invoke('read-database-column-items');
    },

    deleteColumnItem: async (id: number) => {
      return ipcRenderer.invoke('delete-column-item', id);
    },

    resetDatabase: async () => {
      return ipcRenderer.invoke('reset-database');
    },

    getAllDataBase: async () => {
      return ipcRenderer.invoke('get-all-database');
    },

    getDateInitial: async () => {
      return ipcRenderer.invoke('get-date-initial');
    },

    getDateFinal: async () => {
      return ipcRenderer.invoke('get-date-final');
    },

    addDateInitial: async (dateInitial: string) => {
      return ipcRenderer.invoke('add-date-initial', dateInitial);
    },

    addDateFinal: async (dateFinal: string) => {
      return ipcRenderer.invoke('add-date-final', dateFinal);
    },

    moveItemDown: async (id: number) => {
      return ipcRenderer.invoke('move-item-down', id);
    },

    moveItemUp: async (id: number) => {
      return ipcRenderer.invoke('move-item-up', id);
    },

    addDates: async (dates: string[]) => {
      return ipcRenderer.invoke('add-dates', dates);
    },

    getDates: async () => {
      return ipcRenderer.invoke('get-dates');
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
