import sharp from "sharp";
import { readdir, stat, mkdir } from "fs/promises";
import { join } from "path";

const PUBLIC_DIR = join(process.cwd(), "public");
const OPTIMIZED_DIR = join(PUBLIC_DIR, "optimized");

const HEAVY_IMAGES = [
  "header_images.png",
  "food.png",
  "laundry.png",
  "marketplace.png",
  "delivery.png",
];

async function ensureDir(dir) {
  try {
    await stat(dir);
  } catch {
    await mkdir(dir, { recursive: true });
  }
}

async function convertToWebP(input, output, quality = 80) {
  const inputInfo = await sharp(input).metadata();
  await sharp(input).webp({ quality, effort: 4 }).toFile(output);
  const outputInfo = await sharp(output).metadata();
  const inputSize = (await stat(input)).size;
  const outputSize = (await stat(output)).size;
  const reduction = ((1 - outputSize / inputSize) * 100).toFixed(1);
  console.log(
    `  ${input.split("/").pop()}: ${(inputSize / 1024 / 1024).toFixed(1)}MB → ${(outputSize / 1024 / 1024).toFixed(1)}MB (${reduction}% smaller)`
  );
}

async function main() {
  console.log("Converting heavy PNGs to WebP...\n");
  await ensureDir(OPTIMIZED_DIR);

  for (const file of HEAVY_IMAGES) {
    const inputPath = join(PUBLIC_DIR, file);
    const outputPath = join(OPTIMIZED_DIR, file.replace(".png", ".webp"));
    try {
      await convertToWebP(inputPath, outputPath);
    } catch (err) {
      console.error(`  Failed to convert ${file}: ${err.message}`);
    }
  }

  console.log("\nDone! Optimized images in /public/optimized/");
  console.log(
    "\nUpdate imports to use /optimized/*.webp"
  );
}

main().catch(console.error);
