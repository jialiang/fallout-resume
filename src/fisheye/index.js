// Matched to the screen opening in pipboy.png.
// Fisheye effect similar to CRT monitors.
// X = x * (1 + sideCurve * y * y)
// Y = y * (1 + topBottomCurve * x * x)
const sideCurve = 0.1;
const topBottomCurve = 0.13;

let mapAspect = 0;
let mapUrl = "";

// Red and green say how far to shift the sample along x and y (128 means no shift).
// One of shareX or shareY is always 1.0 and the other <=1.0 relative strength to the larger one.
// Written as uncompressed BMP takes 2ms, encoding canvas to PNG took 17ms
function createFisheyeMap(size, shareX, shareY) {
  const headerSize = 54;
  // BMP rows are padded to a multiple of 4 bytes.
  const rowSize = Math.ceil((size * 3) / 4) * 4;
  const buffer = new ArrayBuffer(headerSize + rowSize * size);
  const header = new DataView(buffer);
  // Clamped like canvas pixel data, so fractions round instead of truncating.
  const bytes = new Uint8ClampedArray(buffer);

  header.setUint16(0, 0x4d42, true); // "BM"
  header.setUint32(2, buffer.byteLength, true);
  header.setUint32(10, headerSize, true);
  header.setUint32(14, 40, true); // Size of the info header
  header.setInt32(18, size, true);
  header.setInt32(22, size, true);
  header.setUint16(26, 1, true); // Colour planes
  header.setUint16(28, 24, true); // Bits per pixel

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const nx = ((x + 0.5) / size) * 2 - 1;
      const ny = ((y + 0.5) / size) * 2 - 1;
      // Rows run bottom to top and each pixel is stored blue, green, red.
      const index = headerSize + (size - 1 - y) * rowSize + x * 3;

      bytes[index + 1] = 128 + 127 * shareY * ny * nx * nx;
      bytes[index + 2] = 128 + 127 * shareX * nx * ny * ny;
    }
  }

  return URL.createObjectURL(new Blob([buffer], { type: "image/bmp" }));
}

function updateFisheye() {
  const main = document.querySelector("main");
  const fisheyeMap = document.querySelector(".fisheyeMap");
  const fisheyeDisplacement = document.querySelector("#fisheye feDisplacementMap");

  // Twice the largest shift (at the corners) on each axis, since the map can
  // shift by at most half the scale either way.
  const reachX = sideCurve * main.offsetWidth;
  const reachY = topBottomCurve * main.offsetHeight;
  // Turns the map's colours into pixels.
  const scale = Math.max(reachX, reachY);

  fisheyeDisplacement.setAttribute("scale", scale);

  // The map only depends on the screen's shape, so it's kept while that holds.
  const aspect = Math.round((main.offsetWidth / main.offsetHeight) * 100);
  if (aspect === mapAspect) return;

  const previousUrl = mapUrl;

  mapAspect = aspect;
  mapUrl = createFisheyeMap(256, reachX / scale, reachY / scale);
  fisheyeMap.setAttribute("href", mapUrl);

  // Frees the replaced map, which would otherwise stay in memory.
  if (previousUrl) URL.revokeObjectURL(previousUrl);
}

// SVG filters on HTML break on Safari engine, potentially leaving text blank.
// Chromium browsers also claim AppleWebKit, but only they add "Chrome/".
function getIsSafariEngine() {
  const userAgent = navigator.userAgent;
  return /AppleWebKit\//.test(userAgent) && !/Chrome\//.test(userAgent);
}

// Before Chrome 83, the filter drew at the wrong scale whenever
// the device pixel ratio wasn't 1 (high-DPI screens or page zoom),
// leaving the text clipped and doubled.
function getIsOldChrome() {
  const chromeVersion = navigator.userAgent.match(/Chrome\/(\d+)/);
  return chromeVersion !== null && Number(chromeVersion[1]) < 83;
}

export function applyFisheye() {
  if (getIsSafariEngine() || getIsOldChrome()) return;

  const main = document.querySelector("main");
  main.classList.add("fisheye");

  if (window.ResizeObserver) {
    new ResizeObserver(updateFisheye).observe(main);
    return;
  }

  updateFisheye();
  window.addEventListener("resize", updateFisheye);
}
