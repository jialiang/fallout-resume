import { initSfx, pauseHum, playStatic, restartHum } from "./audio";
import { createBlurState } from "./blur";
import { getIsBootingUp, runBootup } from "./bootup";
import { initColor } from "./color";
import { applyFisheye } from "./fisheye";
import { initNavigation, navigate } from "./navigation";
import { initRadio, pauseRadio, resumeRadio } from "./radio";

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
}

applyFisheye();
createBlurState();
initColor();
initRadio();
initSfx();
initNavigation(onEnterSection);
