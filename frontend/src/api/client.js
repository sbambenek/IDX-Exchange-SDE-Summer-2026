const BASE_URL = '/api';

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.error) {
        message = errorData.error;
      }
    } catch {
    }
    throw new Error(message);
  }
  return response.json();
}

export async function fetchProperties(params = {}) {
  const query = new URLSearchParams(params).toString();
  const url = query ? `${BASE_URL}/properties?${query}` : `${BASE_URL}/properties`;
  const response = await fetch(url);
  return handleResponse(response);
}

export async function fetchPropertyDetail(id) {
  const response = await fetch(`${BASE_URL}/properties/${id}`);
  return handleResponse(response);
}

export async function fetchOpenHouses(id) {
  const response = await fetch(`${BASE_URL}/properties/${id}/openhouses`);
  return handleResponse(response);
}