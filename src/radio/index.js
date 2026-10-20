import { changeWithTransition } from "../transition";
import { readSetting, saveSetting } from "../helpers";

let isRadioEnabled = false;

function getRadio() {
  return document.querySelector(".diamondCityRadio");
}

// Joins the broadcast where it would be if it had been playing since midnight.
function startRadio() {
  const radio = getRadio();

  const metadataLoaded = () => {
    const midnight = new Date().setHours(0, 0, 0, 0);
    const secondsSinceMidnight = (Date.now() - midnight) / 1000;

    radio.currentTime = secondsSinceMidnight % radio.duration;
    radio.volume = 0.5;
    radio.loop = true;
    radio.play();
  };

  if (radio.readyState < 1) {
    radio.load();
    radio.onloadedmetadata = metadataLoaded;
    return;
  }

  metadataLoaded();
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

export function resumeRadio() {
  if (isRadioEnabled) startRadio();
}

export function initRadio() {
  isRadioEnabled = readSetting("radio") === "true";
  updateRadioButtons();

  const radioButton = document.querySelector(".radioButton");
  radioButton.addEventListener("click", toggleRadio);
}
