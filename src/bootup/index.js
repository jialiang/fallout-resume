const fallbackDuration = 4500;

let isBootingUp = false;

export function getIsBootingUp() {
  return isBootingUp;
}

export function getIsBeforeBootup() {
  return !location.hash || location.hash === "#start" || location.hash === "#bootup";
}

export function runBootup() {
  isBootingUp = true;

  const randoms = document.querySelector(".randoms");
  const bootupSection = document.querySelector("#bootup");
  const bootupAudio = document.querySelector(".bootupAudio");

  randoms.innerHTML = "";
  bootupAudio.play();

  Array.from(document.querySelectorAll("section")).forEach((section) => (section.scrollTop = 0));

  const bootupInterval = setInterval(() => {
    requestAnimationFrame(() => {
      const div = document.createElement("div");
      div.textContent = Math.random();

      randoms.appendChild(div);
      bootupSection.scrollTop = bootupSection.scrollHeight;
    });
  }, 50);

  return new Promise((resolve) => {
    let hasFinished = false;

    const finish = () => {
      if (hasFinished) return;
      hasFinished = true;
      isBootingUp = false;

      clearInterval(bootupInterval);
      randoms.innerHTML = "";

      bootupAudio.pause();
      bootupAudio.currentTime = 0;

      window.removeEventListener("hashchange", finish);
      resolve();
    };

    bootupAudio.onended = finish;
    setTimeout(finish, fallbackDuration);
    window.addEventListener("hashchange", finish);
  });
}
