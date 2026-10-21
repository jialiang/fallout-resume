import { getIsTransitioning } from "../transition";

const clickEffect = "./audio/click.mp3";
const hoverEffect = "./audio/hover.mp3";

function playEffect(src) {
  const audio = new Audio(src);
  audio.volume = 0.5;
  audio.play();
}

export function pauseHum() {
  document.querySelector(".humAudio").pause();
}

export function restartHum() {
  const hum = document.querySelector(".humAudio");

  hum.currentTime = 0;
  hum.volume = 0.15;
  hum.play();
}

export function playStatic() {
  const staticAudio = document.querySelector(".staticAudio");

  return new Promise((resolve) => {
    staticAudio.onended = resolve;
    staticAudio.play();
  });
}

// Once the page has loaded, warm the cache so audio plays without fetch delay.
// The radio is a large file, so it only fetches metadata.
export function preloadAudio() {
  [clickEffect, hoverEffect].forEach((src) => new Audio(src));

  document.querySelectorAll(".humAudio, .bootupAudio, .staticAudio").forEach((audio) => {
    if (!audio.paused) return;

    audio.preload = "auto";
    audio.load();
  });

  const radio = document.querySelector(".mojaveMusicRadio");
  if (!radio.paused) return;

  radio.preload = "metadata";
  radio.load();
}

export function initSfx() {
  Array.from(document.querySelectorAll("button, a")).forEach((elem) => {
    elem.addEventListener("mouseenter", () => {
      if (getIsTransitioning()) return;
      playEffect(hoverEffect);
    });

    if (elem.tagName === "BUTTON") {
      elem.addEventListener("click", () => {
        playEffect(clickEffect);
      });
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Tab") playEffect(hoverEffect);
  });

  window.addEventListener("hashchange", () => {
    playEffect(clickEffect);
  });
}
