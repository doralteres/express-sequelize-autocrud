import {Sequelize} from 'sequelize';
import type {modelType} from './types.js';

export const getModel = (sequelize: Sequelize, model: modelType) =>
  typeof model === 'string' ? sequelize.model(model) : model;

export const getPath = (path: string) =>
  path.startsWith('/') ? path : `/${path}`;

export const findVal = (object: unknown, key: string): unknown => {
  if (typeof object === 'object') {
    if (object && key in object) {
      // @ts-expect-error we know 'key' exist at this point.
      return object[key];
    }
    for (const k in object) {
      // @ts-expect-error we know 'k' exist at this point.
      const val = object[k];
      if (typeof val === 'object') {
        const res = findVal(val, key);
        if (res) {
          return res;
        }
      }
    }
    return undefined;
  } else {
    return undefined;
  }
};

const getSequelizeErrorMessageCore = (error: unknown) => {
  const original = findVal(error, 'original');
  if (original && typeof original === 'object' && 'message' in original) {
    return original.message;
  }
  return findVal(error, 'message') || 'Internal Server Error';
};

export const crudError = (message: unknown) => ({
  success: false,
  message,
});

export const getSequelizeErrorMessage = (error: unknown) => {
  const message = getSequelizeErrorMessageCore(error);
  return crudError(typeof message === 'string' ? message.split('\n') : message);
};
