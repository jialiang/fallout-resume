import { resumeRadio } from "../audio";
import { blurSection } from "../blur";

let processing = false;

export function getIsProcessing() {
  return processing;
}

export function transitionManager(action, postAction, skipBlur, skipUnblur) {
  if (processing) return;

  processing = true;

  const release = () => {
    processing = false;
  };

  const getCurrentSection = () =>
    document.getElementById(location.hash.slice(1)) || document.querySelector("#start");

  Promise.resolve()
    .then(() => {
      if (!skipBlur) return blurSection(getCurrentSection(), 0, 20);
      return Promise.resolve();
    })
    .then(() => {
      if (action) action();

      if (!skipUnblur) return blurSection(getCurrentSection(), 20, 0);
      return Promise.resolve();
    })
    .then(() => {
      if (postAction) postAction();
    })
    // Passed as both handlers so a failed step can't lock out later transitions.
    .then(release, release);
}

let isBootingUp = false;

function initBootup() {
  if (isBootingUp) return;
  isBootingUp = true;

  const radio = document.querySelector(".diamondCityRadio");
  radio.pause();

  const randoms = document.querySelector(".randoms");
  randoms.innerHTML = "";

  const bootupSection = document.querySelector("#bootup");
  const bootupAudio = document.querySelector(".bootupAudio");
  const hum = document.querySelector(".humAudio");

  hum.pause();
  bootupAudio.play();

  const bootupInterval = setInterval(() => {
    requestAnimationFrame(() => {
      const div = document.createElement("div");

      div.textContent = Math.random();

      randoms.appendChild(div);
      bootupSection.scrollTop = bootupSection.scrollHeight;
    });
  }, 50);

  let hasEnded = false;

  const end = () => {
    if (hasEnded) return;
    hasEnded = true;

    clearInterval(bootupInterval);
    randoms.innerHTML = "";

    bootupAudio.pause();
    bootupAudio.currentTime = 0;

    hum.currentTime = 0;
    hum.volume = 0.15;
    hum.play();

    if (location.hash === "#bootup") {
      const mainmenuButton = document.querySelector(".mainmenuButton");
      mainmenuButton.click();
    }

    const staticAudio = document.querySelector(".staticAudio");

    staticAudio.onended = () => {
      resumeRadio();
    };

    staticAudio.play();
    window.removeEventListener("hashchange", end);

    isBootingUp = false;
  };

  bootupAudio.onended = end;
  setTimeout(end, 4500);
  window.addEventListener("hashchange", end);
}

export function initTransition() {
  Array.from(document.querySelectorAll("a[href^='#']")).forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();

      const href = a.getAttribute("href");

      transitionManager(
        () => {
          location.hash = href;
        },
        null,
        false,
        true
      );
    });
  });

  window.addEventListener("hashchange", () => {
    const postAction = location.hash === "#bootup" ? initBootup : null;

    transitionManager(null, postAction, true, false);
  });

  transitionManager(null, location.hash === "#bootup" ? initBootup : null, true, false);
}
