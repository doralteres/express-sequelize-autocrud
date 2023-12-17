import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import supertest from 'supertest';
import {crudApp, seedDb, testDb} from '../index.js';

describe('getOne route', () => {
  const sequelize = testDb();
  beforeAll(async () => {
    await sequelize.sync();
    await seedDb(sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('get existed id', async () => {
    const resp = await supertest(
      crudApp(sequelize, {users: {model: 'users', operations: {getOne: {}}}})
    ).get('/users/1');
    expect(resp.statusCode).toBe(200);
    expect(resp.body.id).toBe(1);
  });

  test('get not-existed id', async () => {
    const resp = await supertest(
      crudApp(sequelize, {users: {model: 'users', operations: {getOne: {}}}})
    ).get('/users/123');
    expect(resp.statusCode).toBe(404);
  });

  test('get with include', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {model: 'users', operations: {getOne: {include: 'tasks'}}},
      })
    ).get('/users/1');
    expect(resp.statusCode).toBe(200);
    expect(resp.body.id).toBe(1);
    expect(resp.body).toHaveProperty('tasks');
    expect(resp.body.tasks[0].id).toBe(1);
  });

  test('custom middleware function', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getOne: {
              middleware: (req, res) => {
                res.json({
                  fromMiddleware: true,
                  resourceId: req.params.resourceId,
                });
              },
            },
          },
        },
      })
    ).get('/users/1');
    expect(resp.statusCode).toBe(200);
    expect(resp.body.fromMiddleware).toBe(true);
    expect(resp.body.resourceId).toBe('1');
  });

  test('sequelize wrong config', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getOne: {
              attributes: ['a', 'b'],
            },
          },
        },
      })
    ).get('/users/2');
    expect(resp.statusCode).toBe(500);
    expect(resp.body).toHaveProperty('message');
  });
});
