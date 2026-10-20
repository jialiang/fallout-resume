import { wait } from "../helpers";

const blurValues = [4, 8, 12, 16, 20];
const blurStep = 4;
const blurStepDuration = 50;

const blurs = {};

export function createBlurState() {
  const sections = Array.from(document.querySelectorAll("section"));

  sections.forEach((section) => {
    const content = section.innerHTML;

    blurValues.forEach((value, index) => {
      const div = document.createElement("div");

      div.className = `blur-${value}`;
      div.setAttribute("role", "presentation");
      div.setAttribute("aria-hidden", "true");
      div.innerHTML = content;

      if (index === blurValues.length - 1 && section.id !== "start") {
        div.style.opacity = "1";
      }

      Array.from(div.querySelectorAll("a, button, [tabindex]")).forEach((elem) => {
        elem.setAttribute("aria-hidden", "true");
        elem.setAttribute("tabindex", "-1");
      });

      // Copies keep their markup, so drop IDs that would clash with the original.
      Array.from(div.querySelectorAll("[id]")).forEach((elem) => elem.removeAttribute("id"));

      section.appendChild(div);

      if (blurs[section.id] == null) blurs[section.id] = [];
      blurs[section.id].push(div);
    });
  });
}

function showBlurLevel(section, value) {
  blurs[section.id].forEach((layer) => {
    const isShown = layer.className === `blur-${value}`;
    layer.style.opacity = isShown ? "1" : "";
  });
}

export async function blurSection(section, initialValue, finalValue) {
  const step = finalValue > initialValue ? blurStep : -blurStep;

  for (let value = initialValue + step; value !== finalValue + step; value += step) {
    showBlurLevel(section, value);
    await wait(blurStepDuration);
  }
}
