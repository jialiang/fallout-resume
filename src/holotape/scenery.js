import { pickRandom, randomInteger } from "../helpers";
import { createLayer, createSprite, drawSprite, fullWidth, getVisibleWidth } from "./stage";

const groundTop = 127;
const groundVariants = ["groundFlat", "groundBumpy"];

const maxClouds = 6;
const cloudWidth = 46;
const cloudChance = 0.5;
const minCloudGap = 100;
const maxCloudGap = 400;
const highestCloudTop = 30;
const lowestCloudTop = 71;
// Clouds drift 1 unit per frame whatever the speed, as Chromium's do.
const cloudSpeed = 1;

let cloudLayer = null;
let clouds = [];

// The ground is two full-width strips side by side, scrolled together.
// Whenever the first one leaves the screen they swap places and the incoming
// strip picks a new variant.
let groundX = 0;
let groundStrips = [];

function addCloud() {
  clouds.push({
    x: getVisibleWidth(),
    top: randomInteger(highestCloudTop, lowestCloudTop),
    gap: randomInteger(minCloudGap, maxCloudGap),
    sprite: createSprite(cloudLayer, "holotapeCloud"),
  });
}

function updateClouds(framesElapsed) {
  clouds.forEach((cloud) => (cloud.x -= cloudSpeed * framesElapsed));

  clouds
    .filter((cloud) => cloud.x + cloudWidth <= 0)
    .forEach((cloud) => cloudLayer.removeChild(cloud.sprite));

  clouds = clouds.filter((cloud) => cloud.x + cloudWidth > 0);

  const last = clouds[clouds.length - 1];
  if (!last) return addCloud();

  const hasRoom = getVisibleWidth() - last.x > last.gap;
  const isAllowed = clouds.length < maxClouds && Math.random() < cloudChance;

  if (hasRoom && isAllowed) addCloud();
}

function updateGround(speed, framesElapsed) {
  groundX -= speed * framesElapsed;
  if (groundX > -fullWidth) return;

  groundX += fullWidth;
  groundStrips.push(groundStrips.shift());
  groundStrips[1].variant = pickRandom(groundVariants);
}

export function updateScenery(speed, framesElapsed) {
  updateGround(speed, framesElapsed);
  updateClouds(framesElapsed);
}

export function drawScenery() {
  groundStrips.forEach((strip, index) =>
    drawSprite(strip.sprite, strip.variant, groundX + index * fullWidth, groundTop)
  );

  clouds.forEach((cloud) => drawSprite(cloud.sprite, "cloud", cloud.x, cloud.top));
}

export function resetScenery() {
  groundX = 0;
}

export function initScenery(parent) {
  cloudLayer = createLayer(parent);

  const groundLayer = createLayer(parent);
  groundStrips = groundVariants.map((variant) => ({
    variant,
    sprite: createSprite(groundLayer),
  }));
}
