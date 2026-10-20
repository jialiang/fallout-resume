import { blurIn, blurOut, runExclusive } from "../transition";

export function navigate(hash) {
  if (location.hash === hash) return;

  runExclusive(async () => {
    await blurOut();
    // The hashchange listener in initNavigation blurs the new section in.
    location.hash = hash;
  });
}

export function initNavigation(onEnterSection) {
  const enterCurrentSection = () =>
    runExclusive(async () => {
      await blurIn();
      onEnterSection(location.hash);
    });

  Array.from(document.querySelectorAll("a[href^='#']")).forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      navigate(link.getAttribute("href"));
    });
  });

  window.addEventListener("hashchange", enterCurrentSection);

  const isKnownSection = document.getElementById(location.hash.slice(1));
  if (location.hash && !isKnownSection) location.replace("#");

  enterCurrentSection();
}
