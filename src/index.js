import {
  getIsStaticPlaying,
  initSfx,
  pauseHum,
  playStatic,
  preloadAudio,
  restartHum,
} from "./audio";
import { createBlurState } from "./blur";
import { getIsBeforeBootup, getIsBootingUp, initBootup, runBootup } from "./bootup";
import { initColor } from "./color";
import { applyFisheye } from "./fisheye";
import { enterHolotape, initHolotape } from "./holotape";
import { initNavigation, navigate } from "./navigation";
import { getIsRadioEnabled, initRadio, pauseRadio, preloadRadio, resumeRadio } from "./radio";
import { initScrollbar } from "./scrollbar";
import { getSection } from "./transition";

async function bootUp() {
  if (getIsBootingUp()) return;

  pauseRadio();
  pauseHum();

  await runBootup();

  const currentSectionId = getSection().id;

  if (currentSectionId === "start") return;
  if (currentSectionId === "bootup") navigate("#mainmenu");

  restartHum();
  await playStatic();
  resumeRadio();
}

function shutDown() {
  pauseRadio();
  pauseHum();
}

// Boot-up starts the radio itself once its static ends.
function onEnterSection() {
  const currentSectionId = getSection().id;

  if (currentSectionId === "bootup") bootUp();
  if (currentSectionId === "start") shutDown();
  if (currentSectionId === "holotape") enterHolotape();

  if (!getIsStaticPlaying()) restoreRadio();
}

// Skipped before and during boot-up (which starts the radio itself afterwards)
// and on the radio buttons (which are about to switch it off or change station)
function resumeRadioOnFirstInteraction() {
  const interactions = ["click", "keydown", "touchend"];

  const resume = (event) => {
    interactions.forEach((type) => window.removeEventListener(type, resume, true));

    let isRadioButton = false;

    if (event.target.closest) {
      isRadioButton = event.target.closest(".radioButton, .radioStationButton, .radio");
    }

    if (!getIsBeforeBootup() && !isRadioButton && !getIsBootingUp()) resumeRadio();
  };

  interactions.forEach((type) => window.addEventListener(type, resume, true));
}

// Tries to play straight away and waits for an interaction if blocked.
async function restoreRadio() {
  if (getIsBeforeBootup() || !getIsRadioEnabled()) return;

  const isPlaying = await resumeRadio();
  if (!isPlaying) resumeRadioOnFirstInteraction();
}

function preloadAudioAfterPaint() {
  const preload = () => {
    preloadAudio();
    preloadRadio();
  };

  if (window.PerformanceObserver) {
    const entryTypes = PerformanceObserver.supportedEntryTypes || [];

    if (entryTypes.includes("paint")) {
      let backupTimer = 0;

      const observer = new PerformanceObserver((entries) => {
        if (entries.getEntriesByName("first-contentful-paint")[0]) start();
      });

      const start = () => {
        clearTimeout(backupTimer);
        observer.disconnect();
        preload();
      };

      observer.observe({ type: "paint", buffered: true });

      backupTimer = setTimeout(start, 1000);
      return;
    }
  }

  preload();
}

applyFisheye();
createBlurState();
initHolotape();
initColor();
initRadio();
initSfx();
initNavigation(onEnterSection);
initBootup();
initScrollbar();

window.addEventListener("load", preloadAudioAfterPaint);
