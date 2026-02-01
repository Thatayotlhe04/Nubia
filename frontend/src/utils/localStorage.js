/**
 * localStorage Utilities
 *
 * Safe wrappers for localStorage operations with error handling.
 * Used for guest mode data persistence.
 */

const NUBIA_PREFIX = 'nubia-';

/**
 * Get an item from localStorage with JSON parsing
 * @param {string} key - Storage key (without prefix)
 * @param {*} defaultValue - Default value if not found
 * @returns {*} Parsed value or default
 */
export function getStorageItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(`${NUBIA_PREFIX}${key}`);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from localStorage [${key}]:`, error);
    return defaultValue;
  }
}

/**
 * Set an item in localStorage with JSON stringification
 * @param {string} key - Storage key (without prefix)
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export function setStorageItem(key, value) {
  try {
    localStorage.setItem(`${NUBIA_PREFIX}${key}`, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage [${key}]:`, error);
    // Handle quota exceeded
    if (error.name === 'QuotaExceededError') {
      console.warn('localStorage quota exceeded');
    }
    return false;
  }
}

/**
 * Remove an item from localStorage
 * @param {string} key - Storage key (without prefix)
 */
export function removeStorageItem(key) {
  try {
    localStorage.removeItem(`${NUBIA_PREFIX}${key}`);
  } catch (error) {
    console.error(`Error removing from localStorage [${key}]:`, error);
  }
}

/**
 * Get all nubia-prefixed items from localStorage
 * @returns {Object} All nubia items as key-value pairs
 */
export function getAllNubiaItems() {
  const items = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(NUBIA_PREFIX)) {
        const cleanKey = key.replace(NUBIA_PREFIX, '');
        items[cleanKey] = getStorageItem(cleanKey);
      }
    }
  } catch (error) {
    console.error('Error reading all localStorage items:', error);
  }
  return items;
}

/**
 * Clear all nubia-prefixed items from localStorage
 * Use with caution - this removes all local data
 */
export function clearAllNubiaItems() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(NUBIA_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
}

// Storage keys used by the app
export const STORAGE_KEYS = {
  NOTES: 'notes',
  UPLOADS: 'uploads',
  REVIEWS: 'reviews',
  LIKED_REVIEWS: 'liked-reviews',
  LAST_SYNC: 'last-sync',
};
