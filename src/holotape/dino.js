import { createSprite, drawSprite, gameHeight, placeBoxes } from "./stage";

const dinoX = 50;
// The sprite is 47 units tall and runs 10 units above the bottom edge.
const groundY = gameHeight - 47 - 10;

const gravity = 0.6;
const jumpVelocity = -10;
// Letting go of jump early slows the rise to this (negative is upwards), but
// only once the dino has risen past minJumpY.
const releasedJumpVelocity = -5;
const minJumpY = groundY - 30;
// Above this the dino starts falling even with jump still held.
const maxJumpY = 30;
// Pressing down mid-jump makes the dino fall this many times faster.
const dropMultiplier = 3;

const runFrameDuration = 1000 / 12;
const duckFrameDuration = 1000 / 8;

// Hitboxes, laid out as described at placeBoxes.
const runningBoxes = [
  [22, 0, 17, 16],
  [1, 18, 30, 9],
  [10, 35, 14, 8],
  [1, 24, 29, 5],
  [5, 30, 21, 4],
  [9, 34, 15, 4],
];
// Chromium's ducking box is 55 wide, but its quick first check used the
// standing width, so only the part within that ever hit. Clipped to match.
const duckingBoxes = [[1, 18, 41, 25]];

let sprite = null;
let y = groundY;
let velocity = 0;
let animationTime = 0;

let isJumping = false;
let isPastMinJump = false;
let isDropping = false;
let isDucking = false;
let isDuckHeld = false;
let isCrashed = false;

export function startJump(speed) {
  if (isJumping || isDucking) return;

  isJumping = true;
  isPastMinJump = false;
  isDropping = false;
  velocity = jumpVelocity - speed / 10;
}

export function endJump() {
  if (isPastMinJump && velocity < releasedJumpVelocity) velocity = releasedJumpVelocity;
}

export function pressDuck() {
  isDuckHeld = true;

  if (!isJumping) {
    isDucking = true;
    return;
  }

  isDropping = true;
  velocity = 1;
}

export function releaseDuck() {
  isDuckHeld = false;
  isDropping = false;
  isDucking = false;
}

export function crashDino() {
  isCrashed = true;
  isDucking = false;
}

function land() {
  y = groundY;
  velocity = 0;
  isJumping = false;
  isDropping = false;
  isDucking = isDuckHeld;
}

export function updateDino(elapsed, framesElapsed) {
  animationTime += elapsed;
  if (!isJumping) return;

  y += velocity * (isDropping ? dropMultiplier : 1) * framesElapsed;
  velocity += gravity * framesElapsed;

  if (y < minJumpY || isDropping) isPastMinJump = true;
  if (y < maxJumpY || isDropping) endJump();
  if (y > groundY) land();
}

export function getDinoBoxes() {
  return placeBoxes(isDucking ? duckingBoxes : runningBoxes, dinoX, y);
}

function getSpriteName(isStanding) {
  if (isCrashed) return "dinoCrashed";
  if (isStanding || isJumping) return "dinoStanding";

  const frameDuration = isDucking ? duckFrameDuration : runFrameDuration;
  const frame = (Math.floor(animationTime / frameDuration) % 2) + 1;

  return isDucking ? `dinoDucking${frame}` : `dinoRunning${frame}`;
}

export function drawDino(isStanding) {
  drawSprite(sprite, getSpriteName(isStanding), dinoX, y);
}

export function resetDino() {
  releaseDuck();
  land();
  isCrashed = false;
  animationTime = 0;
}

export function initDino(layer) {
  sprite = createSprite(layer, "holotapeDino");
}
