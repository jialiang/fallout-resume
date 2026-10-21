import { clearBlur, getIsBlurred } from "../blur";
import {
  blurIn,
  blurOut,
  getCurrentSection,
  getIsTransitioning,
  runExclusive,
} from "../transition";

// Queue blur out for hash change that happen before current transition finishes.
let isEntryPending = false;
let onEnter = () => {};

function runPendingEntry() {
  if (!isEntryPending) return;
  isEntryPending = false;

  if (getIsBlurred(getCurrentSection())) enterCurrentSection();
}

function enterCurrentSection() {
  if (getIsTransitioning()) {
    isEntryPending = true;
    return;
  }

  runExclusive(async () => {
    await blurIn();
    onEnter(location.hash);
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
  clearBlur(getCurrentSection());
  onEnter(location.hash);
}
