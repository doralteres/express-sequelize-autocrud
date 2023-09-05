import {NextFunction, Request, Response} from 'express';
import {customFields} from '../types';
import {isIncludeExcludeMatchCriteria} from './config';

export const checkBodyFields = (bodyFields: customFields = []) => {
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
        .send(`Can't use [${problematicFields.join(', ')}] in body`);
    } else {
      next();
    }
  };
};
