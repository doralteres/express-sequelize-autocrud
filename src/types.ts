import type {NextFunction, Request, Response, Router} from 'express';
import type {
  Attributes,
  BulkCreateOptions,
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  Model,
  ModelCtor,
  NonNullFindOptions,
  UpdateOptions,
} from 'sequelize';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type modelType = ModelCtor<Model<any, any>> | string;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type pureModelType = ModelCtor<Model<any, any>>;

export type expressFunc = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type sequelizeFunc<T> = (req: Request, res: Response) => Promise<T> | T;

export type sequelizePropOrFunc<T> = T extends unknown
  ? T | sequelizeFunc<T>
  : never;

export type expressCrudProps<T> = {
  [key in keyof T]: sequelizePropOrFunc<T[key]>;
};

type customFieldCore = {include: string[]} | {exclude: string[]} | string[];

export type customFields = sequelizePropOrFunc<customFieldCore>;

interface operationFieldCore {
  middleware?: expressFunc;
}

interface getListCore {
  filterableFields?: customFields;
  sortableFields?: customFields;
}

interface getListOptionsWithPagination
  extends operationFieldCore,
    getListCore,
    expressCrudProps<Omit<FindAndCountOptions<unknown>, 'group' | 'offset'>> {
  pagination: true;
}

interface getListOptionsWithOutPagination
  extends operationFieldCore,
    getListCore,
    expressCrudProps<FindOptions<unknown>> {
  pagination?: false;
}

export type getListOptions =
  | getListOptionsWithPagination
  | getListOptionsWithOutPagination;

export interface getOneOptions
  extends operationFieldCore,
    expressCrudProps<
      Omit<NonNullFindOptions<Attributes<Model>>, 'where' | 'rejectOnEmpty'>
    > {
  byField?: string;
}

export interface createOptions
  extends operationFieldCore,
    expressCrudProps<Omit<CreateOptions<unknown>, 'transaction'>> {
  creatableFields?: customFields;
}

export interface bulkCreateOptions
  extends operationFieldCore,
    expressCrudProps<Omit<BulkCreateOptions<unknown>, 'transaction'>> {
  creatableFields?: customFields;
  path?: string;
}

export interface updateOptions
  extends operationFieldCore,
    expressCrudProps<Omit<UpdateOptions<unknown>, 'where' | 'transaction'>> {
  updatableFields?: customFields;
  byField?: string;
}

export interface deleteOptions
  extends operationFieldCore,
    expressCrudProps<Omit<DestroyOptions<unknown>, 'where' | 'transaction'>> {
  byField?: string;
}

type customRoutesFunc = (router: Router) => void;

type operationsType = {
  getList?: getListOptions;
  getOne?: getOneOptions;
  create?: createOptions;
  bulkCreate?: bulkCreateOptions;
  update?: updateOptions;
  delete?: deleteOptions;
  custom?: customRoutesFunc;
};

export type sequelizeCrudConfigModel = {
  model: modelType;
  operations: operationsType;
};

export type sequelizeCrudConfig = {
  [basepath: string]: sequelizeCrudConfigModel;
};

type logFunc = (msg: unknown) => void;

export type LoggerOptions = {
  info: logFunc;
  warn: logFunc;
  error: logFunc;
};

export type sequelizeCrudOptions = {
  logging?: LoggerOptions;
};
