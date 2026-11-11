import * as THREE from 'three';
import { SkillItem } from '../../../data/skillsData';
import { getSkillSvgString } from './svgIconsData';

/**
 * Cache for generated CanvasTextures so each skill texture is created exactly once
 */
const textureCache = new Map<string, THREE.CanvasTexture>();

/**
 * Helper to split long skill names into two lines if needed
 */
function splitSkillName(name: string): string[] {
  if (name.length <= 13) return [name];

  const words = name.split(' ');
  if (words.length === 1) return [name];

  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');
  return [line1, line2];
}

/**
 * Draw base pearl-ivory emblem with luxury bezel and clean typography
 */
function drawEmblemBase(
  ctx: CanvasRenderingContext2D,
  skill: SkillItem,
  svgImg?: HTMLImageElement
) {
  const size = 512;
  const center = size / 2;
  const radius = 236;

  ctx.clearRect(0, 0, size, size);

  // 1. Pearl-white circular base with soft specular gradient
  const grad = ctx.createRadialGradient(
    center - 40,
    center - 50,
    10,
    center,
    center,
    radius
  );
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(0.55, '#FBF9F5');
  grad.addColorStop(0.88, '#F3EFE6');
  grad.addColorStop(1, '#ECE6D9');

  ctx.save();
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // 2. Subtle luxury gold/slate emblem rim
  ctx.lineWidth = 3.5;
  ctx.strokeStyle = '#D4AF37';
  ctx.stroke();

  // Secondary soft inner highlight rim
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.beginPath();
  ctx.arc(center, center, radius - 4, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Official Vector Logo or clean placeholder
  if (svgImg && svgImg.complete && svgImg.naturalWidth > 0) {
    const logoSize = 195;
    const logoX = center - logoSize / 2;
    const logoY = 88;
    ctx.drawImage(svgImg, logoX, logoY, logoSize, logoSize);
  } else {
    // Initial placeholder while SVG image finishes decoding
    ctx.fillStyle = '#64748B';
    ctx.font = 'bold 36px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('</>', center, 185);
  }

  // 4. Technology Title
  ctx.fillStyle = '#0F172A'; // Deep navy
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const lines = splitSkillName(skill.name);
  if (lines.length === 1) {
    ctx.font = 'bold 32px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText(lines[0], center, 350);
  } else {
    ctx.font = 'bold 24px "Plus Jakarta Sans", -apple-system, sans-serif';
    ctx.fillText(lines[0], center, 335);
    ctx.fillText(lines[1], center, 368);
  }

  // 5. Subtle micro category tag below title
  if (skill.tag) {
    ctx.font = 'bold 13px monospace';
    ctx.fillStyle = '#B45309'; // Warm amber
    ctx.fillText(skill.tag.toUpperCase(), center, 408);
  }

  ctx.restore();
}

/**
 * Creates and caches a high-DPI texture for a skill
 */
export function getOrCreateSkillTexture(skill: SkillItem): THREE.CanvasTexture {
  if (textureCache.has(skill.id)) {
    return textureCache.get(skill.id)!;
  }

  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d', { willReadFrequently: false })!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;

  // Render base immediately
  drawEmblemBase(ctx, skill);
  texture.needsUpdate = true;

  // Load SVG markup
  const svgMarkup = getSkillSvgString(skill.id);
  const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const img = new Image();

  img.onload = () => {
    drawEmblemBase(ctx, skill, img);
    texture.needsUpdate = true;
    URL.revokeObjectURL(url);
  };

  img.onerror = () => {
    URL.revokeObjectURL(url);
  };

  img.src = url;

  textureCache.set(skill.id, texture);
  return texture;
}

/**
 * Cleanup helper for memory management
 */
export function clearSkillTextureCache(): void {
  textureCache.forEach((tex) => tex.dispose());
  textureCache.clear();
}

