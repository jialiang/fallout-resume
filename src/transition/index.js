import { blurSection } from "../blur";

let isTransitioning = false;

export function getIsTransitioning() {
  return isTransitioning;
}

export function getSection(hash = location.hash) {
  return document.getElementById(hash.slice(1)) || document.querySelector("#start");
}

export const blurOut = (section = getSection(), isImmediate) =>
  blurSection(section, isImmediate ? 20 : 0, 20);

export const blurIn = (section = getSection(), isImmediate) =>
  blurSection(section, isImmediate ? 0 : 20, 0);

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
