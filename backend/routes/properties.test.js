const request = require('supertest');
const express = require('express');
const pool = require('../db');
const propertiesRouter = require('./properties');

jest.mock('../db');

const app = express();
app.use(express.json());
app.use('/api/properties', propertiesRouter);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET /api/properties', () => {
  test('returns paginated results with default limit/offset', async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 2 }]])
      .mockResolvedValueOnce([[{ id: 1, L_ListingID: '111' }, { id: 2, L_ListingID: '222' }]]);

    const res = await request(app).get('/api/properties');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.limit).toBe(20);
    expect(res.body.offset).toBe(0);
    expect(res.body.results).toHaveLength(2);
  });

  test('applies city filter correctly', async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([[{ id: 1, L_ListingID: '111', L_City: 'Beverly Hills' }]]);

    const res = await request(app).get('/api/properties?city=Beverly Hills');

    expect(res.status).toBe(200);
    expect(res.body.total).toBe(1);
    // Confirm the query included a WHERE clause with the city param
    const dataQueryCall = pool.query.mock.calls[1];
    expect(dataQueryCall[0]).toContain('L_City');
    expect(dataQueryCall[1]).toContain('Beverly Hills');
  });

  test('rejects invalid minPrice with 400', async () => {
    const res = await request(app).get('/api/properties?minPrice=abc');

    expect(res.status).toBe(400);
    expect(res.body.error).toBeDefined();
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('rejects limit over 100 with 400', async () => {
    const res = await request(app).get('/api/properties?limit=200');

    expect(res.status).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('returns 500 if database query fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('Connection lost'));

    const res = await request(app).get('/api/properties');

    expect(res.status).toBe(500);
    expect(res.body.error).toBeDefined();
  });

  test('applies beds filter correctly', async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([[{ id: 1, L_ListingID: '111', L_Keyword2: 3 }]]);

    const res = await request(app).get('/api/properties?beds=3');

    expect(res.status).toBe(200);
    const dataQueryCall = pool.query.mock.calls[1];
    expect(dataQueryCall[0]).toContain('L_Keyword2');
    expect(dataQueryCall[1]).toContain(3);
  });

  test('applies baths filter correctly', async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([[{ id: 1, L_ListingID: '111', LM_Dec_3: 2.5 }]]);

    const res = await request(app).get('/api/properties?baths=2.5');

    expect(res.status).toBe(200);
    const dataQueryCall = pool.query.mock.calls[1];
    expect(dataQueryCall[0]).toContain('LM_Dec_3');
    expect(dataQueryCall[1]).toContain(2.5);
  });

  test('applies maxPrice filter correctly', async () => {
    pool.query
      .mockResolvedValueOnce([[{ total: 1 }]])
      .mockResolvedValueOnce([[{ id: 1, L_ListingID: '111', L_SystemPrice: 500000 }]]);

    const res = await request(app).get('/api/properties?maxPrice=500000');

    expect(res.status).toBe(200);
    const dataQueryCall = pool.query.mock.calls[1];
    expect(dataQueryCall[0]).toContain('L_SystemPrice');
  });
});

describe('GET /api/properties/:id', () => {
  test('returns a single property on success', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 1, L_ListingID: '1118422731', L_Address: '1461 Laurel Way' }]]);

    const res = await request(app).get('/api/properties/1118422731');

    expect(res.status).toBe(200);
    expect(res.body.L_ListingID).toBe('1118422731');
  });

  test('returns 404 for a non-existent listing ID', async () => {
    pool.query.mockResolvedValueOnce([[]]);

    const res = await request(app).get('/api/properties/999999999');

    expect(res.status).toBe(404);
    expect(res.body.error).toBeDefined();
  });

  test('returns 400 for a malformed ID', async () => {
    const res = await request(app).get('/api/properties/abc123');

    expect(res.status).toBe(400);
    expect(pool.query).not.toHaveBeenCalled();
  });
});

describe('GET /api/properties/:id/openhouses', () => {
  test('returns open house results for an existing property', async () => {
    pool.query
      .mockResolvedValueOnce([[{ id: 1 }]]) // property exists check
      .mockResolvedValueOnce([[{ id: 1, OpenHouseDate: '2026-01-15' }]]); // open houses

    const res = await request(app).get('/api/properties/1118422731/openhouses');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body).toHaveLength(1);
  });

  test('returns an empty array (not an error) when no open houses exist', async () => {
    pool.query
      .mockResolvedValueOnce([[{ id: 1 }]]) // property exists check
      .mockResolvedValueOnce([[]]); // no open houses

    const res = await request(app).get('/api/properties/1118422731/openhouses');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  test('returns 404 when the property itself does not exist', async () => {
    pool.query.mockResolvedValueOnce([[]]); // property does not exist

    const res = await request(app).get('/api/properties/999999999/openhouses');

    expect(res.status).toBe(404);
  });
});