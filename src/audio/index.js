import { getIsProcessing, transitionManager } from "../transition";
import { readSetting, saveSetting } from "../helpers";

const clickEffect = "./audio/click.mp3";
const hoverEffect = "./audio/hover.mp3";

function playEffect(src) {
  const audio = new Audio(src);
  audio.volume = 0.5;
  audio.play();
}

export function startRadio() {
  const radio = document.querySelector(".diamondCityRadio");
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

let isRadioEnabled = false;

function updateRadioButtons() {
  const radioButtons = Array.from(document.querySelectorAll(".radioButton"));
  const label = `[${isRadioEnabled ? "Enabled" : "Disabled"}]`;

  radioButtons.forEach((button) => (button.textContent = label));
}

function toggleRadio() {
  transitionManager(() => {
    isRadioEnabled = !isRadioEnabled;
    saveSetting("radio", isRadioEnabled);
    updateRadioButtons();

    if (isRadioEnabled) startRadio();
    else document.querySelector(".diamondCityRadio").pause();
  });
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

export function initSfx() {
  Array.from(document.querySelectorAll("button, a")).forEach((elem) => {
    elem.addEventListener("mouseenter", () => {
      if (getIsProcessing()) return;
      playEffect(hoverEffect);
    });

    if (elem.tagName === "BUTTON") {
      elem.addEventListener("click", () => {
        playEffect(clickEffect);
      });
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Tab") playEffect(hoverEffect);
  });

  window.addEventListener("hashchange", () => {
    playEffect(clickEffect);
  });
}
