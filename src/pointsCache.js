// eslint-disable-next-line no-unused-vars
const [a, month, b, year] = (new Date()).toString().split(' ');
const uncachedKey = `${month}-01-${year}`;

const CACHE_KEY = 'point-cache';

let currentCacheVal;

function ensureCache() {
  if (currentCacheVal) {
    return;
  }

  try {
    currentCacheVal = JSON.parse(localStorage.getItem(CACHE_KEY));
  } catch (e) {}

  currentCacheVal = currentCacheVal || {};
}

export function getCached(key) {
  ensureCache();

  // This is for our current month, don use cache
  // TODO: could optimize further by storing some of the data for the month
  if (key === uncachedKey) {
    return undefined;
  }

  return currentCacheVal[key] || undefined;
}

export function setCached(key, value) {
  // This is for our current month, don use cache
  if (key === uncachedKey) {
    return;
  }

  currentCacheVal[key] = value;
  localStorage.setItem(CACHE_KEY, JSON.stringify(currentCacheVal));
}