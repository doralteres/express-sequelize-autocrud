import {NextFunction, Request, Response} from 'express';
import {isIncludeExcludeMatchCriteria} from './config.js';
import {crudError} from '../utils.js';
import type {customFields} from '../types.js';

export const checkBodyFields = (bodyFields: customFields) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const toTest = Object.keys(req.body);
    const {result, problematicFields} = await isIncludeExcludeMatchCriteria(
      bodyFields,
      toTest,
      req,
      res
    );
    if (!result) {
      res
        .status(400)
        .json(crudError(`Can't use [${problematicFields.join(', ')}] in body`));
    } else {
      next();
    }
  };
};
