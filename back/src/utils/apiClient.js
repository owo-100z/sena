/**
 * 공통 API 호출 Util
 */

// 로그
const { log } = require('./utils');

// API 호출
const apiClient = async (url, { method = 'GET', params, body, headers } = {}) => {
  let fullUrl = url;
  if (params && method.toUpperCase() === 'GET') {
    const query = new URLSearchParams(params).toString();
    fullUrl += `?${query}`;
  }

  log(`API Request: ${method} ${fullUrl}`);
  if (params) log(`Query Parameters: ${JSON.stringify(params)}`);
  if (body) log(`Request Body: ${JSON.stringify(body)}`);
  if (headers) log(`Request Headers: ${JSON.stringify(headers)}`);

  return fetch(fullUrl, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: method.toUpperCase() !== 'GET' ? JSON.stringify(body) : undefined,
  });
};

module.exports = apiClient;