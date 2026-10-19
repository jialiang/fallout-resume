import { initRadio, initSfx } from "./audio";
import { createBlurState } from "./blur";
import { initColor } from "./color";
import { applyFisheye } from "./fisheye";
import { initTransition } from "./transition";

applyFisheye();
createBlurState();
initTransition();
initColor();
initRadio();
initSfx();

const isValidHash = document.getElementById(location.hash.slice(1));
if (location.hash && !isValidHash) location.replace("#");
