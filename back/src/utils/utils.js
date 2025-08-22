/**
 * 공통 Utils
 */

// 로깅
const log = (...args) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] `, ...args);
}

const utils = {
  isEmpty: (value) => {
    if (value == null) return true;
    if (typeof value === 'string' || Array.isArray(value)) {
      return value.length === 0;
    }
    if (typeof value === 'object') {
      return Object.keys(value).length === 0;
    }
    return false;
  }
}

module.exports = {
    log,
    utils
};