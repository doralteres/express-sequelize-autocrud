import {describe, expect, test} from 'vitest';
import {getPath, findVal, getSequelizeErrorMessage} from '../src/utils.js';

describe('utils test', () => {
  describe('getPath', () => {
    test('path without slash', () => {
      const text = 'abcd';
      expect(getPath(text)).toBe(`/${text}`);
    });

    test('path with slash', () => {
      const text = '/abcd';
      expect(getPath(text)).toBe(text);
    });
  });

  describe('findVal', () => {
    test('regular object', () => {
      const obj = {
        first: 'hello',
        second: 'world',
      };
      expect(findVal(obj, 'second')).toBe(obj.second);
    });

    test('complex object', () => {
      const obj = {
        third: {
          body: {first: 'hello', second: 'world'},
        },
      };
      expect(findVal(obj, 'second')).toBe(obj.third.body.second);
    });

    test('non key object', () => {
      const obj = {};
      expect(findVal(obj, 'second')).toBe(undefined);
    });

    test('non object', () => {
      const obj = 'bla';
      expect(findVal(obj, 'second')).toBe(undefined);
    });
  });

  describe('getSequelizeErrorMessage', () => {
    test('regular error message', () => {
      const msg = {message: 'test error'};
      expect(getSequelizeErrorMessage(msg)).toStrictEqual({
        success: false,
        message: [msg.message],
      });
    });

    test('regular error message with original', () => {
      const msg = {original: {message: 'test error'}};
      expect(getSequelizeErrorMessage(msg)).toStrictEqual({
        success: false,
        message: [msg.original.message],
      });
    });

    test('not found error message', () => {
      const msg = {another: 'test error'};
      expect(getSequelizeErrorMessage(msg)).toStrictEqual({
        success: false,
        message: ['Internal Server Error'],
      });
    });
  });
});
