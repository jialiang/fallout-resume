import { readSetting, saveSetting } from "../helpers";
import { holotapeMessages } from "../strings";

import {
  createLayer,
  fitScreen,
  frameDuration,
  fullWidth,
  getVisibleWidth,
  isOverlapping,
} from "./stage";

import {
  crashDino,
  drawDino,
  endJump,
  getDinoBoxes,
  initDino,
  pressDuck,
  releaseDuck,
  resetDino,
  startJump,
  updateDino,
} from "./dino";

import {
  drawObstacles,
  getObstacleBoxes,
  initObstacles,
  resetObstacles,
  updateObstacles,
} from "./obstacles";

import { drawScenery, initScenery, resetScenery, updateScenery } from "./scenery";

const startSpeed = 6;
// A screen showing less than the full width gives less warning, so it starts
// at its share of startSpeed times this (never above startSpeed).
const narrowSpeedMultiplier = 1.2;
const maxSpeed = 13;
const acceleration = 0.001;
// Obstacles only start coming once the run is this old.
const clearTime = 3000;
// Jump can't restart for this long after a crash, so a held key doesn't.
const restartDelay = 750;
// Turns distance in game units into points.
const pointsPerUnit = 0.025;
// Caps one frame's step, so a stalled tab doesn't teleport everything.
const maxElapsed = 100;

const jumpKeys = [" ", "Spacebar", "ArrowUp", "Up"];
const duckKeys = ["ArrowDown", "Down"];

// One of "ready", "running", "paused" or "crashed".
let state = "ready";
let speed = startSpeed;
let distance = 0;
let runningTime = 0;
let crashTime = 0;
let highScore = 0;

let lastFrameTime = null;
let frameRequest = 0;
let shownScore = null;

function getGameArea() {
  return document.querySelector(".holotapeGame");
}

// Includes the copies inside the blur layers, so they don't show stale text.
function showText(className, text) {
  const elements = Array.from(document.querySelectorAll(`.${className}`));
  elements.forEach((element) => (element.textContent = text));
}

const formatScore = (score) => `0000${Math.min(score, 99999)}`.slice(-5);

function getScore() {
  return Math.round(distance * pointsPerUnit);
}

function draw() {
  drawScenery();
  drawObstacles();
  drawDino(state === "ready");

  const score = getScore();
  if (score === shownScore) return;

  shownScore = score;
  showText("holotapeScore", formatScore(score));
}

function isDinoHit() {
  const obstacleBoxes = getObstacleBoxes();

  return getDinoBoxes().some((dinoBox) =>
    obstacleBoxes.some((obstacleBox) => isOverlapping(dinoBox, obstacleBox))
  );
}

function crash() {
  state = "crashed";
  crashTime = Date.now();
  crashDino();

  const score = getScore();
  showText("holotapeStatus", holotapeMessages.crashed(score));

  if (score <= highScore) return;

  highScore = score;
  saveSetting("holotapeHighScore", highScore);
  showText("holotapeHighScore", formatScore(highScore));
}

function step(elapsed, framesElapsed) {
  runningTime += elapsed;

  updateDino(elapsed, framesElapsed);
  updateScenery(speed, framesElapsed);
  if (runningTime > clearTime) updateObstacles(speed, elapsed, framesElapsed);

  if (isDinoHit()) {
    crash();
    return;
  }

  distance += speed * framesElapsed;
  speed = Math.min(speed + acceleration * framesElapsed, maxSpeed);
}

function tick(time) {
  const elapsed = Math.min(time - (lastFrameTime || time), maxElapsed);
  lastFrameTime = time;

  step(elapsed, elapsed / frameDuration);
  draw();

  if (state === "running") frameRequest = requestAnimationFrame(tick);
}

function run() {
  state = "running";
  lastFrameTime = null;
  showText("holotapeStatus", holotapeMessages.running);

  frameRequest = requestAnimationFrame(tick);
}

function getStartSpeed() {
  const narrowSpeed = (startSpeed * getVisibleWidth() * narrowSpeedMultiplier) / fullWidth;
  return Math.min(startSpeed, narrowSpeed);
}

function restart() {
  speed = getStartSpeed();
  distance = 0;
  runningTime = 0;

  resetDino();
  resetObstacles();
  resetScenery();
  run();
}

// Keys let go while the game had no focus never reach it, so nothing is
// left held down.
function pause() {
  if (state !== "running") return;

  state = "paused";
  cancelAnimationFrame(frameRequest);

  endJump();
  releaseDuck();
  showText("holotapeStatus", holotapeMessages.paused);
}

// Switching apps or locking a phone hides the page without always blurring
// the game area first.
function pauseIfHidden() {
  if (document.hidden) pause();
}

function restartAfterDelay() {
  if (Date.now() - crashTime < restartDelay) return;
  restart();
}

function pressJump() {
  if (state === "paused") return run();
  if (state === "crashed") return restartAfterDelay();

  if (state === "ready") {
    speed = getStartSpeed();
    run();
  }

  startJump(speed);
}

function onKeyDown(event) {
  if (event.key === "Enter" && state === "crashed") restart();

  const isJumpKey = jumpKeys.includes(event.key);
  const isDuckKey = duckKeys.includes(event.key);
  if (!isJumpKey && !isDuckKey) return;

  // Stops the keys from scrolling the page as well.
  event.preventDefault();

  if (isJumpKey) pressJump();
  if (isDuckKey && state === "running") pressDuck();
}

function onKeyUp(event) {
  if (jumpKeys.includes(event.key)) endJump();
  if (duckKeys.includes(event.key)) releaseDuck();
}

// Outside a run a touch may be a scroll, so starting is left to onClick.
// preventDefault stops a jump from also scrolling or firing mouse events,
// but it also blocks focus, hence focus().
function onTouchStart(event) {
  if (state !== "running") return;

  event.preventDefault();
  getGameArea().focus();
  pressJump();
}

// Jumps on press, not click, so letting go mid-rise can cut it short.
function onMouseDown(event) {
  if (event.button === 0 && state === "running") pressJump();
}

// Starts, resumes or restarts the game.
function onClick() {
  if (state !== "running") pressJump();
}

// Fits again in case the layout shifted (a late font, say) without a resize.
export function enterHolotape() {
  fitScreen();
}

export function initHolotape() {
  const gameArea = getGameArea();
  const svg = gameArea.querySelector("svg");

  initScenery(createLayer(svg));
  initObstacles(createLayer(svg));
  initDino(createLayer(svg));

  highScore = Number(readSetting("holotapeHighScore")) || 0;
  showText("holotapeHighScore", formatScore(highScore));
  showText("holotapeStatus", holotapeMessages.ready);
  draw();

  gameArea.addEventListener("keydown", onKeyDown);
  gameArea.addEventListener("keyup", onKeyUp);
  gameArea.addEventListener("mousedown", onMouseDown);
  gameArea.addEventListener("mouseup", endJump);
  gameArea.addEventListener("click", onClick);
  gameArea.addEventListener("touchstart", onTouchStart);
  gameArea.addEventListener("touchend", endJump);
  gameArea.addEventListener("blur", pause);

  window.addEventListener("hashchange", pause);
  document.addEventListener("visibilitychange", pauseIfHidden);
  window.addEventListener("resize", fitScreen);

  if (window.ResizeObserver) {
    new ResizeObserver(fitScreen).observe(svg.closest(".holotapeScreen"));
    return;
  }

  fitScreen();
  window.addEventListener("load", fitScreen);
}
