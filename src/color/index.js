import { changeWithTransition } from "../transition";
import { readSetting, saveSetting } from "../helpers";

const textColors = ["Lime", "Cyan", "Orange", "White"];

let currentColor = textColors[0];

function applyColor(color) {
  const main = document.querySelector("main");
  // Includes the copies inside the blur layers, so they don't show a stale label.
  const textColorButtons = Array.from(document.querySelectorAll(".textColorButton"));

  main.classList.remove(currentColor);
  main.classList.add(color);
  textColorButtons.forEach((button) => (button.textContent = `[${color}]`));

  currentColor = color;
  saveSetting("textColor", color);
}

function cycleColor() {
  const nextIndex = (textColors.indexOf(currentColor) + 1) % textColors.length;
  changeWithTransition(() => applyColor(textColors[nextIndex]));
}

export function initColor() {
  const savedColor = readSetting("textColor");
  if (textColors.includes(savedColor)) applyColor(savedColor);

  const textColorButton = document.querySelector(".textColorButton");
  textColorButton.addEventListener("click", cycleColor);
}
