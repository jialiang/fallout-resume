import { blurSection } from "../blur";

let isTransitioning = false;

export function getIsTransitioning() {
  return isTransitioning;
}

function getCurrentSection() {
  return document.getElementById(location.hash.slice(1)) || document.querySelector("#start");
}

export const blurOut = () => blurSection(getCurrentSection(), 0, 20);
export const blurIn = () => blurSection(getCurrentSection(), 20, 0);

export async function runExclusive(steps) {
  if (isTransitioning) return;
  isTransitioning = true;

  try {
    await steps();
  } finally {
    isTransitioning = false;
  }
}

export function changeWithTransition(change) {
  return runExclusive(async () => {
    await blurOut();
    change();
    await blurIn();
  });
}
