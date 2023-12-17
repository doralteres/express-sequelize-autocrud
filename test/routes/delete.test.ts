import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import supertest from 'supertest';
import {crudApp, seedDb, testDb} from '../index.js';

describe('delete route', () => {
  const sequelize = testDb();
  beforeAll(async () => {
    await sequelize.sync();
    await seedDb(sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('delete existed id', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {model: 'users', operations: {delete: {}}},
      })
    ).delete('/users/2');
    expect(resp.statusCode).toBe(201);
    expect(resp.body.affectedCount).toBe(1);
  });

  test('delete not-existed id', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {model: 'users', operations: {delete: {}}},
      })
    ).delete('/users/4');
    expect(resp.statusCode).toBe(201);
    expect(resp.body.affectedCount).toBe(0);
  });

  test('sequelize wrong config', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            delete: {
              middleware: (req, res, next) => {
                delete req.params.resourceId;
                next();
              },
            },
          },
        },
      })
    ).delete('/users/456');
    expect(resp.statusCode).toBe(500);
    expect(resp.body).toHaveProperty('message');
  });
});
