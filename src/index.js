import { initSfx, pauseHum, playStatic, preloadAudio, restartHum } from "./audio";
import { createBlurState } from "./blur";
import { getIsBeforeBootup, getIsBootingUp, runBootup } from "./bootup";
import { initColor } from "./color";
import { applyFisheye } from "./fisheye";
import { enterHolotape, initHolotape } from "./holotape";
import { initNavigation, navigate } from "./navigation";
import { getIsRadioEnabled, initRadio, pauseRadio, resumeRadio } from "./radio";

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

// Skipped before and during boot-up, which starts the radio itself afterwards
// and on the radio buttons, which are about to switch it off.
function resumeRadioOnFirstInteraction() {
  const interactions = ["click", "keydown", "touchend"];

  const resume = (event) => {
    interactions.forEach((type) => window.removeEventListener(type, resume, true));

    const isRadioButton = event.target.closest && event.target.closest(".radioButton, .radio");

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

applyFisheye();
createBlurState();
initHolotape();
initColor();
initRadio();
initSfx();
initNavigation(onEnterSection);
restoreRadio();

window.addEventListener("load", preloadAudio);
