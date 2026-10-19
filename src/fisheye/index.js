const fisheyeStrength = 0.025;

function createFisheyeMap(size) {
  const peak = 2 / (3 * Math.sqrt(3));

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d");
  const image = context.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = ((x + 0.5) / size) * 2 - 1;
      const ny = ((y + 0.5) / size) * 2 - 1;

      const pull = (1 - (nx * nx + ny * ny)) / peak;
      const index = (y * size + x) * 4;

      image.data[index] = 128 - nx * pull * 127;
      image.data[index + 1] = 128 - ny * pull * 127;
      image.data[index + 3] = 255;
    }
  }

  context.putImageData(image, 0, 0);
  return canvas.toDataURL();
}

function updateFisheyeScale() {
  const main = document.querySelector("main");
  const fisheyeDisplacement = document.querySelector(".fisheyeDisplacement");

  const shorterSide = Math.min(main.offsetWidth, main.offsetHeight);
  fisheyeDisplacement.setAttribute("scale", shorterSide * fisheyeStrength * 2);
}

export function applyFisheye() {
  const main = document.querySelector("main");
  const fisheyeMap = document.querySelector(".fisheyeMap");

  fisheyeMap.setAttribute("href", createFisheyeMap(256));
  updateFisheyeScale();
  main.style.filter = "url(#fisheye)";

  window.addEventListener("resize", updateFisheyeScale);
}
