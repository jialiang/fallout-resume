import { pickRandom, randomInteger } from "../helpers";
import { createSprite, drawSprite, getVisibleWidth, placeBoxes } from "./stage";

// The smallest gap after an obstacle grows with its width and the speed, plus
// its type's minGap times this. The largest gap is the smallest times 1.5.
const gapMultiplier = 0.6;
const maxGapMultiplier = 1.5;
// No type comes up more than this many times in a row.
const maxRepeats = 2;

// minSpeed: the slowest speed it shows up at.
// groupSpeed: the slowest speed it can come in a group of two or three.
// tops: the heights it can appear at (each is its top edge).
// boxes: hitboxes for a single one, laid out as described at placeBoxes.
const obstacleTypes = [
  {
    name: "smallCactus",
    width: 17,
    tops: [105],
    minSpeed: 0,
    groupSpeed: 4,
    minGap: 120,
    boxes: [
      [0, 7, 5, 27],
      [4, 0, 6, 34],
      [10, 4, 7, 14],
    ],
  },
  {
    name: "largeCactus",
    width: 25,
    tops: [90],
    minSpeed: 0,
    groupSpeed: 7,
    minGap: 120,
    boxes: [
      [0, 12, 7, 38],
      [8, 0, 7, 49],
      [13, 10, 10, 38],
    ],
  },
  {
    name: "pterodactyl",
    width: 46,
    tops: [100, 75, 50],
    minSpeed: 8.5,
    groupSpeed: Infinity,
    minGap: 150,
    // Flies this much faster or slower than the ground scrolls.
    speedOffset: 0.8,
    flapDuration: 1000 / 6,
    boxes: [
      [15, 15, 16, 5],
      [18, 21, 24, 6],
      [2, 14, 4, 3],
      [6, 10, 4, 7],
      [10, 8, 6, 9],
    ],
  },
];

let layer = null;
let obstacles = [];
let recentTypes = [];

function pickType(speed) {
  const isRepeatedTooOften = (type) =>
    recentTypes.length === maxRepeats && recentTypes.every((recent) => recent === type);

  const types = obstacleTypes.filter((type) => speed >= type.minSpeed && !isRepeatedTooOften(type));

  return pickRandom(types);
}

// A group stretches its middle hitbox and moves the last one to its far end.
function getGroupBoxes(type, width) {
  if (width === type.width) return type.boxes;

  const first = type.boxes[0];
  const middle = type.boxes[1];
  const last = type.boxes[2];

  return [
    first,
    [middle[0], middle[1], width - first[2] - last[2], middle[3]],
    [width - last[2], last[1], last[2], last[3]],
  ];
}

function addObstacle(speed) {
  const type = pickType(speed);
  const size = speed < type.groupSpeed ? 1 : randomInteger(1, 3);
  const width = type.width * size;

  const minGap = Math.round(width * speed + type.minGap * gapMultiplier);
  const speedOffset = type.speedOffset ? pickRandom([1, -1]) * type.speedOffset : 0;

  obstacles.push({
    type,
    size,
    width,
    x: getVisibleWidth() + type.width,
    top: pickRandom(type.tops),
    gap: randomInteger(minGap, Math.round(minGap * maxGapMultiplier)),
    boxes: getGroupBoxes(type, width),
    speedOffset,
    animationTime: 0,
    isFollowed: false,
    sprite: createSprite(layer),
  });

  recentTypes = [type].concat(recentTypes).slice(0, maxRepeats);
}

export function updateObstacles(speed, elapsed, framesElapsed) {
  obstacles.forEach((obstacle) => {
    obstacle.x -= (speed + obstacle.speedOffset) * framesElapsed;
    obstacle.animationTime += elapsed;
  });

  obstacles
    .filter((obstacle) => obstacle.x + obstacle.width <= 0)
    .forEach((obstacle) => layer.removeChild(obstacle.sprite));

  obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);

  const last = obstacles[obstacles.length - 1];

  if (!last) {
    addObstacle(speed);
    return;
  }

  if (!last.isFollowed && last.x + last.width + last.gap < getVisibleWidth()) {
    last.isFollowed = true;
    addObstacle(speed);
  }
}

export function getObstacleBoxes() {
  return obstacles.reduce(
    (boxes, obstacle) => boxes.concat(placeBoxes(obstacle.boxes, obstacle.x, obstacle.top)),
    []
  );
}

function getSpriteName(obstacle) {
  const type = obstacle.type;
  if (!type.flapDuration) return `${type.name}${obstacle.size}`;

  const frame = (Math.floor(obstacle.animationTime / type.flapDuration) % 2) + 1;
  return `${type.name}${frame}`;
}

export function drawObstacles() {
  obstacles.forEach((obstacle) =>
    drawSprite(obstacle.sprite, getSpriteName(obstacle), obstacle.x, obstacle.top)
  );
}

export function resetObstacles() {
  obstacles.forEach((obstacle) => layer.removeChild(obstacle.sprite));
  obstacles = [];
  recentTypes = [];
}

export function initObstacles(parent) {
  layer = parent;
}
