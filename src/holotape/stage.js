import { spritePaths } from "./sprites";

// The game is laid out in units of the original 600 by 150 pixel game and the
// SVG's viewBox scales that to whatever size the screen ends up. A narrow
// screen shows less than the full width (see fitScreen).
export const fullWidth = 600;
export const gameHeight = 150;

let visibleWidth = fullWidth;
// Physical screen pixels per game unit (see drawSprite).
let pixelsPerUnit = 1;

// Movement is tuned per frame at 60 frames per second: multiplying by the
// number of such frames that have passed keeps the pace on any refresh rate.
export const frameDuration = 1000 / 60;

const svgNamespace = "http://www.w3.org/2000/svg";

export function getVisibleWidth() {
  return visibleWidth;
}

// How wide the screen would be with the page at its widest (the body's
// max-width follows the viewport height). The section's side padding is a
// share of the body's width, so the screen only gets the rest of any extra.
function getWidestWidth(screen) {
  const body = document.querySelector("body");
  const sectionStyle = getComputedStyle(screen.closest("section"));

  const padding = parseFloat(sectionStyle.paddingLeft) + parseFloat(sectionStyle.paddingRight);
  const widestBodyWidth = parseFloat(getComputedStyle(body).maxWidth);
  const extraBodyWidth = Math.max(0, widestBodyWidth - body.clientWidth);

  return screen.clientWidth + extraBodyWidth * (1 - padding / body.clientWidth);
}

// The widest layout shows the whole game at 4:1. A narrower screen keeps that
// height and shows less of the game's right side until it reaches 2:1, then
// keeps 2:1 and shrinks.
export function fitScreen() {
  // The first is the real screen, the rest are its copies in the blur layers,
  // sized alike so the layers line up with it.
  const screens = Array.from(document.querySelectorAll(".holotapeScreen"));
  let height = 0;

  // A new height can add or remove the section's scrollbar, which changes the
  // width, so it measures again until the width settles.
  for (let pass = 0; pass < 3; pass++) {
    const width = screens[0].clientWidth;
    height = Math.min(width / 2, getWidestWidth(screens[0]) / 4);

    // Replaces the CSS padding that sizes them until this runs.
    screens.forEach((screen) => {
      screen.style.paddingTop = "0";
      screen.style.height = `${height}px`;
    });

    if (screens[0].clientWidth === width) break;
  }

  visibleWidth = Math.min(fullWidth, (screens[0].clientWidth / height) * gameHeight);
  pixelsPerUnit = (height / gameHeight) * window.devicePixelRatio;
  screens[0].querySelector("svg").setAttribute("viewBox", `0 0 ${visibleWidth} ${gameHeight}`);
}

export function createLayer(parent) {
  const layer = document.createElementNS(svgNamespace, "g");
  parent.appendChild(layer);
  return layer;
}

export function createSprite(layer, className) {
  const sprite = document.createElementNS(svgNamespace, "path");
  if (className) sprite.setAttribute("class", className);

  layer.appendChild(sprite);
  return sprite;
}

const snapToPixel = (value) => Math.round(value * pixelsPerUnit) / pixelsPerUnit;

// The SVG's crisp edges snap each edge of the pixel art to a screen pixel.
// Moving sprites in whole screen pixels shifts every edge alike, so the art
// doesn't shimmer as it moves.
export function drawSprite(sprite, name, x, y) {
  const path = spritePaths[name];
  if (sprite.getAttribute("d") !== path) sprite.setAttribute("d", path);

  sprite.setAttribute("transform", `translate(${snapToPixel(x)} ${snapToPixel(y)})`);
}

// Hitboxes are [x, y, width, height]. Each sprite's are measured from its
// top-left corner, so placing them adds the sprite's position plus 1 unit for
// the blank border around every sprite.
export function placeBoxes(boxes, x, y) {
  return boxes.map((box) => [x + 1 + box[0], y + 1 + box[1], box[2], box[3]]);
}

export function isOverlapping(first, second) {
  return (
    first[0] < second[0] + second[2] &&
    first[0] + first[2] > second[0] &&
    first[1] < second[1] + second[3] &&
    first[1] + first[3] > second[1]
  );
}
