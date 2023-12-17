import {afterAll, beforeAll, describe, expect, test} from 'vitest';
import supertest from 'supertest';
import {crudApp, seedDb, testDb} from '../index.js';
import {Op} from 'sequelize';

describe('getList route', () => {
  const sequelize = testDb();
  beforeAll(async () => {
    await sequelize.sync();
    await seedDb(sequelize);
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test('simple get list', async () => {
    const resp = await supertest(
      crudApp(sequelize, {users: {model: 'users', operations: {getList: {}}}})
    ).get('/users');
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBe(2);
  });

  test('simple get list with sequelize options', async () => {
    // @ts-expect-error TODO: check why it have a type issue
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {
              include: 'tasks',
              order: [['id', 'DESC']],
              // @ts-expect-error TODO: check why it have a type issue
              where: {id: {[Op.lt]: 5}},
            },
          },
        },
      })
    ).get('/users');
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBe(2);
    expect(resp.body[0]).toHaveProperty('tasks');
    expect(resp.body[0].id).toBe(2);
  });

  test('get list with pagination', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {
              pagination: true,
              limit: 1,
            },
          },
        },
      })
    ).get('/users');
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBe(1);
    expect(resp.headers).toHaveProperty('content-range');
    expect(resp.headers['content-range']).toBe('users 0-1/2');
  });

  test('get list with pagination and headers', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {
              pagination: true,
              limit: 1,
            },
          },
        },
      })
    )
      .get('/users')
      .query({_start: 1});
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBe(1);
    expect(resp.headers).toHaveProperty('content-range');
    expect(resp.headers['content-range']).toBe('users 1-2/2');
  });

  test('get list with pagination out of range', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {
              pagination: true,
              limit: 1,
            },
          },
        },
      })
    )
      .get('/users')
      .query({_start: 200, _end: 1000});
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBe(0);
    expect(resp.headers).toHaveProperty('content-range');
    expect(resp.headers['content-range']).toBe('users 0-0/0');
  });

  test('get list with filterable fields (empty)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {},
          },
        },
      })
    )
      .get('/users')
      .query({username: 'doralteres'});
    expect(resp.statusCode).toBe(400);
  });

  test('get list with filterable fields (allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {filterableFields: ['username']},
          },
        },
      })
    )
      .get('/users')
      .query({username: 'doralteres'});
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBe(1);
    expect(resp.body[0].username).toBe('doralteres');
  });

  test('get list with filterable fields (not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {filterableFields: ['birthday']},
          },
        },
      })
    )
      .get('/users')
      .query({username: 'doralteres'});
    expect(resp.statusCode).toBe(400);
  });

  test('get list with sortable fields (empty)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {},
          },
        },
      })
    )
      .get('/users')
      .query({_sort: 'username', _order: 'ASC'});
    expect(resp.statusCode).toBe(400);
  });

  test('get list with sortable fields (allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {sortableFields: ['username']},
          },
        },
      })
    )
      .get('/users')
      .query({_sort: 'username', _order: 'ASC'});
    expect(resp.statusCode).toBe(200);
    expect(resp.body.length).toBe(2);
    expect(resp.body[1].username).toBe('doralteres');
  });

  test('get list with sortable fields (not-allowed)', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {sortableFields: ['birthday']},
          },
        },
      })
    )
      .get('/users')
      .query({_sort: 'username', _order: 'ASC'});
    expect(resp.statusCode).toBe(400);
  });

  test('sequelize wrong config', async () => {
    const resp = await supertest(
      crudApp(sequelize, {
        users: {
          model: 'users',
          operations: {
            getList: {order: [['ajaja', 'agag']]},
          },
        },
      })
    ).get('/users');
    expect(resp.statusCode).toBe(500);
    expect(resp.body).toHaveProperty('message');
  });
});
