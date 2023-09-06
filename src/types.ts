import {NextFunction, Request, Response} from 'express';
import {
  Attributes,
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
  //   customFunc?: expressFunc;
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
    > {}

export interface createOptions
  extends operationFieldCore,
    expressCrudProps<CreateOptions<unknown>> {
  creatableFields?: customFields;
}

export interface updateOptions
  extends operationFieldCore,
    expressCrudProps<Omit<UpdateOptions<unknown>, 'where'>> {
  updatableFields?: customFields;
}

export interface deleteOptions
  extends operationFieldCore,
    expressCrudProps<Omit<DestroyOptions<unknown>, 'where'>> {}

type operationsType = {
  getList?: getListOptions;
  getOne?: getOneOptions;
  create?: createOptions;
  update?: updateOptions;
  delete?: deleteOptions;
};

export type sequelizeCrudConfigModel = {
  model: modelType;
  operations: operationsType;
};

export type sequelizeCrudConfig = {
  [basepath: string]: sequelizeCrudConfigModel;
};
