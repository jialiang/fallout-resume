import { changeWithTransition } from "../transition";
import { readSetting, saveSetting } from "../helpers";

let isRadioEnabled = false;

function getRadio() {
  return document.querySelector(".diamondCityRadio");
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

    return playing.then(() => true).catch(() => false);
  };

  if (radio.readyState >= 1) return Promise.resolve(play());

  return new Promise((resolve) => {
    radio.onloadedmetadata = () => resolve(play());
    radio.load();
  });
}

function updateRadioButtons() {
  const radioButtons = Array.from(document.querySelectorAll(".radioButton"));
  const label = `[${isRadioEnabled ? "Enabled" : "Disabled"}]`;

  radioButtons.forEach((button) => (button.textContent = label));
}

function toggleRadio() {
  changeWithTransition(() => {
    isRadioEnabled = !isRadioEnabled;
    saveSetting("radio", isRadioEnabled);
    updateRadioButtons();

    if (isRadioEnabled) startRadio();
    else pauseRadio();
  });
}

export function pauseRadio() {
  getRadio().pause();
}

export function getIsRadioEnabled() {
  return isRadioEnabled;
}

export async function resumeRadio() {
  return isRadioEnabled && startRadio();
}

export function initRadio() {
  isRadioEnabled = readSetting("radio") === "true";
  updateRadioButtons();

  const radioButton = document.querySelector(".radioButton");
  radioButton.addEventListener("click", toggleRadio);
}
