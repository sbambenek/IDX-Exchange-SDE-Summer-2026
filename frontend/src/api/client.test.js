import { fetchProperties, fetchPropertyDetail } from './client';

beforeEach(() => {
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('fetchProperties returns parsed JSON on success', async () => {
  const mockData = { total: 2, limit: 20, offset: 0, results: [{ id: 1 }, { id: 2 }] };
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => mockData
  });

  const data = await fetchProperties();

  expect(data).toEqual(mockData);
  expect(global.fetch).toHaveBeenCalledWith('/api/properties');
});

test('fetchProperties includes query params in the request URL', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ total: 0, limit: 20, offset: 0, results: [] })
  });

  await fetchProperties({ city: 'Beverly Hills', minPrice: '300000' });

  expect(global.fetch).toHaveBeenCalledWith(
    '/api/properties?city=Beverly+Hills&minPrice=300000'
  );
});

test('fetchProperties throws a meaningful error when the response is not ok', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: false,
    status: 400,
    json: async () => ({ error: 'minPrice must be a number' })
  });

  await expect(fetchProperties({ minPrice: 'abc' })).rejects.toThrow(
    'minPrice must be a number'
  );
});

test('fetchPropertyDetail requests the correct URL', async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ id: 1, L_ListingID: '12345' })
  });

  await fetchPropertyDetail('12345');

  expect(global.fetch).toHaveBeenCalledWith('/api/properties/12345');
});