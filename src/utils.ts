import {Sequelize} from 'sequelize';
import {modelType} from './types';

export const getModel = (sequelize: Sequelize, model: modelType) =>
  typeof model === 'string' ? sequelize.model(model) : model;

export const getPath = (path: string) =>
  path.startsWith('/') ? path : `/${path}`;
