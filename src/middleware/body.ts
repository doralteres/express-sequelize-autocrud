import type {NextFunction, Request, Response} from 'express';
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

export const checkBodyArrayFields = (bodyFields: customFields) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!Array.isArray(req.body)) {
      res
        .status(400)
        .json({success: false, message: 'Request body does not an array!'});
      return;
    }
    const results = await Promise.all(
      req.body.map(body =>
        isIncludeExcludeMatchCriteria(bodyFields, Object.keys(body), req, res)
      )
    );
    const filteredResults = results.filter(r => !r.result);
    if (filteredResults.length > 0) {
      res
        .status(400)
        .json(
          crudError(
            `Can't use [${filteredResults[0].problematicFields.join(', ')}] in body`
          )
        );
    } else {
      next();
    }
  };
};
