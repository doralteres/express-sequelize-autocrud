/* eslint-disable @typescript-eslint/no-explicit-any */
import {NextFunction, Request, Response} from 'express';
import type {
  customFields,
  expressCrudProps,
  expressFunc,
  sequelizePropOrFunc,
} from '../types.js';

export const getFieldValue = async <T = any>(
  field: sequelizePropOrFunc<T>,
  req: Request,
  res: Response
): Promise<T> => (typeof field !== 'function' ? field : await field(req, res));

export const isIncludeExcludeMatchCriteria = async (
  includeExcludeFields: customFields,
  fieldToTest: string | string[],
  req: Request,
  res: Response
) => {
  const fields = await getFieldValue(includeExcludeFields, req, res);
  const toTest = Array.isArray(fieldToTest) ? fieldToTest : [fieldToTest];
  if ('include' in fields || Array.isArray(fields)) {
    const includables = Array.isArray(fields) ? fields : fields.include;
    const problematicFields = toTest.filter(f => includables.indexOf(f) === -1);
    return {result: problematicFields.length === 0, problematicFields};
  } else {
    const problematicFields = toTest.filter(
      f => fields.exclude.indexOf(f) !== -1
    );
    return {result: problematicFields.length === 0, problematicFields};
  }
};

export const buildOptionsFromConfig = async <T extends {[prop: string]: any}>(
  config: expressCrudProps<T>,
  req: Request,
  res: Response
): Promise<T> => {
  const newConfig = config as T;
  for (const key in config) {
    newConfig[key] = await getFieldValue(config[key], req, res);
  }
  return newConfig;
};

export const runCustomMiddleware = (middleware?: expressFunc) => {
  return middleware
    ? middleware
    : (req: Request, res: Response, next: NextFunction) => {
        next();
      };
};
