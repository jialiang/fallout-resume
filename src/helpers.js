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

// Reads a changed setting aloud, such as "Text Color: Cyan".
export function announceSetting(labelId, value) {
  const label = document.getElementById(labelId).textContent;
  document.querySelector(".settingStatus").textContent = `${label} ${value}`;
}

export function readSetting(key, isTabScoped) {
  try {
    return (isTabScoped ? sessionStorage : localStorage).getItem(key);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export function saveSetting(key, value, isTabScoped) {
  try {
    (isTabScoped ? sessionStorage : localStorage).setItem(key, value);
  } catch (error) {
    console.error(error);
  }
}
