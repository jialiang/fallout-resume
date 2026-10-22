import { getCurrentSection } from "../transition";

function updateThumb() {
  const section = getCurrentSection();
  const track = document.querySelector(".scrollbar");
  const thumb = document.querySelector(".scrollbarThumb");
  const visibleShare = section.clientHeight / section.scrollHeight;

  track.hidden = visibleShare >= 1;
  if (track.hidden) return;

  const thumbHeight = track.clientHeight * visibleShare;
  const scrollRange = section.scrollHeight - section.clientHeight;
  const scrolledShare = Math.min(section.scrollTop / scrollRange, 1);
  const offset = scrolledShare * (track.clientHeight - thumbHeight);

  thumb.style.height = `${thumbHeight}px`;
  thumb.style.transform = `translateY(${offset}px)`;
}

export function initScrollbar() {
  const main = document.querySelector("main");

  // Scroll events don't bubble, but a capturing listener still sees them.
  main.addEventListener("scroll", updateThumb, true);
  window.addEventListener("hashchange", updateThumb);
  window.addEventListener("resize", updateThumb);
  // The web font can change how tall the content is once it loads.
  window.addEventListener("load", updateThumb);

  // Measuring now would force a layout before the web font arrives, which
  // the font then throws away. The first frame lays out the page anyway.
  requestAnimationFrame(updateThumb);
}
