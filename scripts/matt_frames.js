/**
 * matt_frames.js
 *
 * Background removal for project.mp4 character video.
 *
 * Background: uniform neutral grey, achromatic (~RGB 215,215,215)
 * Method: Boundary flood-fill from all 4 edges.
 *
 * BG candidate pixel: avg(R,G,B) >= 185 AND maxChannelDiff <= 18
 *
 * This conservatively preserves the warm-toned desk legs, skin, clothing
 * while correctly removing the achromatic studio background.
 *
 * Outputs RGBA PNG frames to frames_matted/
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

const inDir = path.join(ROOT, 'frames_raw');
const outDir = path.join(ROOT, 'frames_matted');
fs.mkdirSync(outDir, { recursive: true });

/** Returns true if pixel is likely background (achromatic studio grey) */
function isBgCandidate(r, g, b) {
  const avg = (r + g + b) / 3;
  const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
  return avg >= 185 && maxDiff <= 18;
}

async function mattFrame(inputPath, outputPath) {
  const { data, info } = await sharp(inputPath)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height } = info;
  const channels = info.channels; // 3 for RGB

  // Output RGBA buffer
  const rgba = Buffer.alloc(width * height * 4);
  // Visited = background (to be made transparent)
  const visited = new Uint8Array(width * height);

  // BFS queue — stored as flat [x, y, x, y, ...] using typed array for speed
  const queueX = new Int16Array(width * height);
  const queueY = new Int16Array(width * height);
  let head = 0, tail = 0;

  function tryEnqueue(x, y) {
    const pi = y * width + x;
    if (visited[pi]) return;
    const i = pi * channels;
    if (isBgCandidate(data[i], data[i + 1], data[i + 2])) {
      visited[pi] = 1;
      queueX[tail] = x;
      queueY[tail] = y;
      tail++;
    }
  }

  // Seed from all 4 edges
  for (let x = 0; x < width; x++) {
    tryEnqueue(x, 0);
    tryEnqueue(x, height - 1);
  }
  for (let y = 1; y < height - 1; y++) {
    tryEnqueue(0, y);
    tryEnqueue(width - 1, y);
  }

  // 4-connected flood fill
  while (head < tail) {
    const x = queueX[head];
    const y = queueY[head];
    head++;

    if (x > 0)         tryEnqueue(x - 1, y);
    if (x < width - 1) tryEnqueue(x + 1, y);
    if (y > 0)         tryEnqueue(x, y - 1);
    if (y < height - 1) tryEnqueue(x, y + 1);
  }

  // Build RGBA output — background pixels → alpha=0
  for (let p = 0; p < width * height; p++) {
    const si = p * channels;
    const di = p * 4;
    rgba[di]     = data[si];
    rgba[di + 1] = data[si + 1];
    rgba[di + 2] = data[si + 2];
    rgba[di + 3] = visited[p] ? 0 : 255;
  }

  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .png({ compressionLevel: 1 })  // fast write, lossless
    .toFile(outputPath);
}

async function main() {
  const files = fs.readdirSync(inDir)
    .filter(f => f.endsWith('.png'))
    .sort();

  if (files.length === 0) {
    console.error('No PNG files found in', inDir);
    process.exit(1);
  }

  console.log(`Processing ${files.length} frames...`);
  const startTime = Date.now();

  for (let i = 0; i < files.length; i++) {
    const inPath = path.join(inDir, files[i]);
    const outPath = path.join(outDir, files[i]);
    await mattFrame(inPath, outPath);

    if ((i + 1) % 10 === 0 || i === files.length - 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const remaining = (((Date.now() - startTime) / (i + 1)) * (files.length - i - 1) / 1000).toFixed(0);
      process.stdout.write(`\r  ${i + 1}/${files.length} frames | ${elapsed}s elapsed | ~${remaining}s remaining  `);
    }
  }

  console.log('\nAll frames matted successfully!');
  console.log(`Output: ${outDir}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});

