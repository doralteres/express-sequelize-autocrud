/* eslint-disable @typescript-eslint/no-explicit-any */
import {FindAndCountOptions} from 'sequelize';
import {customFields} from '../types';
import {NextFunction, Request, Response} from 'express';
import {isIncludeExcludeMatchCriteria} from './config';
import {crudError} from '../utils';

export const buildOptionsFromQueryParams = (
  q: Record<string, any>,
  maxLimit?: number
): FindAndCountOptions<unknown> => {
  const {_sort, _order, _start, _end, ...where} = q;
  const queryLimit = _end
    ? parseInt(_end) - (parseInt(_start) || 0)
    : undefined;
  return {
    where,
    limit:
      queryLimit && (!maxLimit || maxLimit >= queryLimit)
        ? queryLimit
        : maxLimit,
    offset: parseInt(_start) || 0,
    order: _sort ? [[_sort, _order || 'DESC']] : undefined,
  };
};

export const checkFilterableFields = (filterableFields: customFields = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {_sort, _order, _start, _end, ...where} = req.query;
    if (
      where &&
      !(
        await isIncludeExcludeMatchCriteria(
          filterableFields,
          Object.keys(where),
          req,
          res
        )
      ).result
    ) {
      res
        .status(400)
        .json(
          crudError(`Can't filter by fields [${Object.keys(where).join(', ')}]`)
        );
    } else {
      next();
    }
  };
};

export const checkSortableFields = (sortableFields: customFields = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {_sort} = req.query;
    if (
      _sort &&
      !(
        await isIncludeExcludeMatchCriteria(
          sortableFields,
          _sort.toString(),
          req,
          res
        )
      ).result
    ) {
      res.status(400).json(crudError(`Can't sort by field [${_sort}]`));
    } else {
      next();
    }
  };
};
