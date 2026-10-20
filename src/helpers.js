export function wait(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

// Includes both ends.
export function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom(items) {
  return items[randomInteger(0, items.length - 1)];
}

export function readSetting(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function saveSetting(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
}
