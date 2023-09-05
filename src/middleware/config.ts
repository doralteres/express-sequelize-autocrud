/* eslint-disable @typescript-eslint/no-explicit-any */
import {Request, Response} from 'express';
import {customFields, expressCrudProps, sequelizePropOrFunc} from '../types';

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
    return toTest.filter(f => includables.indexOf(f) === -1).length === 0;
  } else {
    return toTest.filter(f => fields.exclude.indexOf(f) !== -1).length === 0;
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
