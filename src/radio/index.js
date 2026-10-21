import { getIsBeforeBootup } from "../bootup";
import { changeWithTransition } from "../transition";
import { readSetting, saveSetting } from "../helpers";

const isTabScoped = true;

let isRadioEnabled = false;
let cancelPendingStart = null;

function getRadio() {
  return document.querySelector(".mojaveMusicRadio");
}

function setIsBuffering(isBuffering) {
  document.querySelector(".radio").classList.toggle("buffering", isBuffering);
}

// Joins the broadcast where it would be if it had been playing since midnight.
// Resolves to whether the browser let it play.
function startRadio() {
  const radio = getRadio();

  const play = () => {
    const midnight = new Date().setHours(0, 0, 0, 0);
    const secondsSinceMidnight = (Date.now() - midnight) / 1000;

    radio.currentTime = secondsSinceMidnight % radio.duration;
    radio.volume = 0.5;
    radio.loop = true;

    // Edge 16 returns nothing here instead of a promise.
    const playing = radio.play();
    if (!playing) return true;

    // A blocked play fires no media event, so the flicker is cleared here.
    return playing
      .then(() => true)
      .catch(() => {
        setIsBuffering(false);
        return false;
      });
  };

  if (radio.readyState >= 1) return Promise.resolve(play());

  // The media events only start once play() is called, after the metadata.
  setIsBuffering(true);

  return new Promise((resolve) => {
    cancelPendingStart = () => {
      radio.onloadedmetadata = null;
      resolve(false);
    };

    radio.onloadedmetadata = () => {
      cancelPendingStart = null;
      resolve(play());
    };

    radio.load();
  });
}

function updateRadioButtons() {
  const radioButtons = Array.from(document.querySelectorAll(".radioButton"));
  const label = `[${isRadioEnabled ? "Enabled" : "Disabled"}]`;

  radioButtons.forEach((button) => (button.textContent = label));

  const frameButton = document.querySelector(".radio");
  frameButton.classList.toggle("enabled", isRadioEnabled);
  frameButton.setAttribute("aria-pressed", isRadioEnabled);
}

// Before boot-up only the setting changes: boot-up starts the radio itself.
function setRadioEnabled(isEnabled) {
  isRadioEnabled = isEnabled;
  saveSetting("radio", isRadioEnabled, isTabScoped);
  updateRadioButtons();

  if (!isRadioEnabled) pauseRadio();
  else if (!getIsBeforeBootup()) startRadio();
}

function toggleRadio() {
  changeWithTransition(() => setRadioEnabled(!isRadioEnabled));
}

// Also drops a start still waiting on the metadata
export function pauseRadio() {
  if (cancelPendingStart) cancelPendingStart();
  cancelPendingStart = null;

  getRadio().pause();
  setIsBuffering(false);
}

export function getIsRadioEnabled() {
  return isRadioEnabled;
}

export async function resumeRadio() {
  return isRadioEnabled && startRadio();
}

export function initRadio() {
  isRadioEnabled = readSetting("radio", isTabScoped) === "true";
  updateRadioButtons();

  const radioButton = document.querySelector(".radioButton");
  radioButton.addEventListener("click", toggleRadio);

  // On the frame rather than the screen, so it switches without a blur.
  const frameButton = document.querySelector(".radio");
  frameButton.addEventListener("click", () => setRadioEnabled(!isRadioEnabled));

  const radio = getRadio();
  radio.addEventListener("waiting", () => setIsBuffering(true));

  ["playing", "pause", "error"].forEach((type) => {
    radio.addEventListener(type, () => setIsBuffering(false));
  });
}
