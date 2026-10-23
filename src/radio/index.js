import { playClick } from "../audio";
import { getIsBeforeBootup } from "../bootup";
import { changeWithTransition } from "../transition";
import { readSetting, saveSetting } from "../helpers";

const isTabScoped = true;

let isRadioEnabled = false;
let currentStation = null;
let cancelPendingStart = null;

function getStations() {
  return Array.from(document.querySelectorAll(".radioStation"));
}

function getRadio() {
  return currentStation;
}

function setIsBuffering(isBuffering) {
  document.querySelector(".radio").classList.toggle("buffering", isBuffering);
}

// Where the broadcast is now, as if the station had been playing since midnight.
function getBroadcastPosition(radio) {
  const midnight = new Date().setHours(0, 0, 0, 0);
  const secondsSinceMidnight = (Date.now() - midnight) / 1000;

  return secondsSinceMidnight % radio.duration;
}

// Joins the broadcast where it is now. Resolves to whether the browser let it play.
function startRadio() {
  const radio = getRadio();

  const play = () => {
    radio.currentTime = getBroadcastPosition(radio);
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

  // A station that failed must reload, even if its metadata had loaded before.
  if (radio.readyState >= 1 && !radio.error) return Promise.resolve(play());

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

function updateStationButtons() {
  const stationButtons = Array.from(document.querySelectorAll(".radioStationButton"));
  const label = `[${currentStation.dataset.station}]`;

  stationButtons.forEach((button) => (button.textContent = label));
}

function setStation(station) {
  pauseRadio();

  currentStation = station;
  saveSetting("radioStation", station.dataset.station);
  updateStationButtons();

  if (isRadioEnabled && !getIsBeforeBootup()) startRadio();
}

function cycleStation() {
  const stations = getStations();
  const nextIndex = (stations.indexOf(currentStation) + 1) % stations.length;

  changeWithTransition(() => setStation(stations[nextIndex]));
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

export function preloadRadio() {
  getStations().forEach((station) => {
    if (!station.paused) return;

    station.preload = "metadata";
    station.load();
  });
}

export function initRadio() {
  const stations = getStations();
  const savedStation = readSetting("radioStation");

  isRadioEnabled = readSetting("radio", isTabScoped) === "true";
  currentStation = stations.find((station) => station.dataset.station === savedStation);
  if (!currentStation) currentStation = stations[0];

  updateRadioButtons();
  updateStationButtons();

  const radioButton = document.querySelector(".radioButton");
  radioButton.addEventListener("click", toggleRadio);

  const stationButton = document.querySelector(".radioStationButton");
  stationButton.addEventListener("click", cycleStation);

  // On the frame rather than the screen, so it switches without a blur.
  const frameButton = document.querySelector(".radio");
  frameButton.addEventListener("click", () => setRadioEnabled(!isRadioEnabled));

  // A station left behind still fires its pause, which mustn't clear the new one's flicker.
  stations.forEach((station) => {
    const setIsBufferingIfCurrent = (isBuffering) => () => {
      if (station === currentStation) setIsBuffering(isBuffering);
    };

    station.addEventListener("waiting", setIsBufferingIfCurrent(true));

    ["playing", "pause", "error"].forEach((type) => {
      station.addEventListener(type, setIsBufferingIfCurrent(false));
    });

    station.addEventListener("error", () => {
      if (station !== currentStation || !isRadioEnabled || getIsBeforeBootup()) return;

      playClick();
      setRadioEnabled(false);
    });
  });
}
