import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import supertest from 'supertest';
import {crudApp, seedDb, testDb} from '../index.js';

describe('custom route', () => {
  const sequelize = testDb();
  beforeAll(async () => {
    await sequelize.sync();
    await seedDb(sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('get request', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            custom: router => {
              router.get('/custom', (req, res) => {
                res.json({message: 'custom'});
              });
            },
          },
        },
      })
    ).get('/users/custom');
    expect(resp.statusCode).toBe(200);
    expect(resp.body.message).toBe('custom');
  });

  test('post request', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            custom: router => {
              router.post('/custom', (req, res) => {
                res.status(201).json({message: 'custom'});
              });
            },
          },
        },
      })
    ).post('/users/custom');
    expect(resp.statusCode).toBe(201);
    expect(resp.body.message).toBe('custom');
  });
});
