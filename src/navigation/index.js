import { getIsBlurred } from "../blur";

import { blurIn, blurOut, getIsTransitioning, getSection, runExclusive } from "../transition";

// Queue blur out for hash change that happen before current transition finishes.
let isEntryPending = false;
let onEnter = () => {};

function runPendingEntry() {
  if (!isEntryPending) return;
  isEntryPending = false;

  if (getIsBlurred(getSection())) enterCurrentSection();
}

// Back and Forward skip the blur out in navigate(), so the previous section is blurred here.
function enterCurrentSection(event) {
  const previousSection = event && getSection(new URL(event.oldURL).hash);
  if (previousSection && previousSection !== getSection()) blurOut(previousSection, true);

  if (getIsTransitioning()) {
    isEntryPending = true;
    return;
  }

  runExclusive(async () => {
    await blurIn();
    onEnter();
  }).then(runPendingEntry);
}

export function navigate(hash) {
  if (location.hash === hash) return;

  runExclusive(async () => {
    await blurOut();
    // The hashchange listener in initNavigation blurs the new section in.
    location.hash = hash;
  }).then(runPendingEntry);
}

export function initNavigation(onEnterSection) {
  onEnter = onEnterSection;

  Array.from(document.querySelectorAll("a[href^='#']")).forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(link.getAttribute("href"));
    });
  });

  window.addEventListener("hashchange", enterCurrentSection);

  const isKnownSection = document.getElementById(location.hash.slice(1));
  if (location.hash && !isKnownSection) location.replace("#");

  // The first section shows straight away: only later moves blur in.
  blurIn(getSection(), true);

  // Waits for the browser to jump to the section named in the URL, which
  // focuses the section and would undo any focus set by entering it.
  requestAnimationFrame(() => onEnter());
}
