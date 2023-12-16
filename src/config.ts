import {LoggerOptions, customFields} from './types.js';

export const GET_LIST_DEFAULT_FILTERABLE_FIELDS: customFields = [];
export const GET_LIST_DEFAULT_SORTABLE_FIELDS: customFields = [];
export const DEFAULT_CREATABLE_FIELDS: customFields = {
  exclude: ['id', 'createdAt', 'updatedAt'],
};
export const DEFAULT_UPDATABLE_FIELDS: customFields = {
  exclude: ['id', 'createdAt', 'updatedAt'],
};

export const defaultLogger: LoggerOptions = {
  info: console.log,
  warn: console.warn,
  error: console.error,
};
