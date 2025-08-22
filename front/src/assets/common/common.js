const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const comm = {
  log: (...args) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}]: `, ...args);
  },
  api: async (url, { method = 'GET', params, body, headers } = {}) => {
    // 기본 URL 설정
    let fullUrl = apiBaseUrl + url;

    // GET 방식이면 params를 쿼리스트링으로 변환
    if (params && method.toUpperCase() === 'GET') {
      const query = new URLSearchParams(params).toString();
      fullUrl += `?${query}`;
    }

    comm.log(`API Request: ${method} ${fullUrl}`);
    if (params && method.toUpperCase() === 'GET') comm.log(`Query Parameters: ${JSON.stringify(params)}`);
    if (body && method.toUpperCase() !== 'GET') comm.log(`Request Body: ${JSON.stringify(body)}`);
    if (headers) comm.log(`Request Headers: ${JSON.stringify(headers)}`);

    try {
      const res = await fetch(fullUrl, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: method.toUpperCase() !== 'GET' ? JSON.stringify(body) : undefined,
      });

      const data = await res.json(); // fetch 성공 시 데이터

      return {
        status: res.ok ? 'success' : 'fail', // HTTP 상태 기준
        data,
      };
    } catch (e) {
      comm.log(`API Error: ${e}`);
      return { status: 'error', error: e.message };
    }
  },
}

export const utils = {
  formatDate: (date) => {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD format
  },
  isEmpty: (obj) => {
    if (obj === null || obj === undefined) return true;
    if (typeof obj === "object") {
      return Object.keys(obj).length === 0;
    }
    return false;
  },
}