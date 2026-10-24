const fallbackDuration = 4500;

let isBootingUp = false;

let bootupInterval = 0;
let fallbackTimer = 0;

let resolveBootup = () => {};

export function getIsBootingUp() {
  return isBootingUp;
}

export function getIsBeforeBootup() {
  return !location.hash || location.hash === "#start" || location.hash === "#bootup";
}

export function finishBootup() {
  if (!isBootingUp) return;
  isBootingUp = false;

  clearInterval(bootupInterval);
  clearTimeout(fallbackTimer);

  document.querySelector(".randoms").innerHTML = "";
  document.querySelector(".bootupAudio").pause();

  resolveBootup();
}

export function runBootup() {
  isBootingUp = true;

  const randoms = document.querySelector(".randoms");
  const bootupSection = document.querySelector("#bootup");
  const bootupAudio = document.querySelector(".bootupAudio");

  randoms.innerHTML = "";
  bootupAudio.currentTime = 0;
  bootupAudio.play();

  Array.from(document.querySelectorAll("section")).forEach((section) => (section.scrollTop = 0));

  bootupInterval = setInterval(() => {
    requestAnimationFrame(() => {
      const div = document.createElement("div");
      div.textContent = Math.random();

      randoms.appendChild(div);
      bootupSection.scrollTop = bootupSection.scrollHeight;
    });
  }, 50);

  fallbackTimer = setTimeout(finishBootup, fallbackDuration);
  bootupAudio.onended = finishBootup;

  return new Promise((resolve) => (resolveBootup = resolve));
}

export function initBootup() {
  window.addEventListener("hashchange", finishBootup);
}
