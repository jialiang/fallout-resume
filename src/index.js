import { initSfx, pauseHum, playStatic, preloadAudio, restartHum } from "./audio";
import { createBlurState } from "./blur";
import { getIsBeforeBootup, getIsBootingUp, runBootup } from "./bootup";
import { initColor } from "./color";
import { applyFisheye } from "./fisheye";
import { enterHolotape, initHolotape } from "./holotape";
import { initNavigation, navigate } from "./navigation";
import { getIsRadioEnabled, initRadio, pauseRadio, resumeRadio } from "./radio";
import { initScrollbar } from "./scrollbar";

async function bootUp() {
  if (getIsBootingUp()) return;

  pauseRadio();
  pauseHum();

  await runBootup();

  restartHum();

  // Leaving early (with Back) ends the boot-up without moving the user on.
  if (location.hash === "#bootup") navigate("#mainmenu");

  await playStatic();
  resumeRadio();
}

function onEnterSection(hash) {
  if (hash === "#bootup") bootUp();
  if (hash === "#holotape") enterHolotape();
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
        preloadAudio();
      };

      observer.observe({ type: "paint", buffered: true });

      backupTimer = setTimeout(start, 1000);
      return;
    }
  }

  preloadAudio();
}

applyFisheye();
createBlurState();
initHolotape();
initColor();
initRadio();
initSfx();
initNavigation(onEnterSection);
initScrollbar();
restoreRadio();

window.addEventListener("load", preloadAudioAfterPaint);
