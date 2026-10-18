import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Create SVG Icon
const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#075B46" />
      <stop offset="100%" stop-color="#054333" />
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCE182" />
      <stop offset="50%" stop-color="#E6B84A" />
      <stop offset="100%" stop-color="#C29424" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.3" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="512" height="512" rx="112" fill="url(#bg)" />

  <!-- Outer Emblem Border -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#gold)" stroke-width="6" opacity="0.4" />
  <circle cx="256" cy="256" r="176" fill="none" stroke="url(#gold)" stroke-width="2.5" stroke-dasharray="10 8" opacity="0.6" />

  <!-- Central Shield of Governance -->
  <path d="M256 100 L370 150 V260 C370 335 320 395 256 422 C192 395 142 335 142 260 V150 Z" 
        fill="#FFFFFF" filter="url(#shadow)" opacity="0.97" />

  <!-- Inner Shield Accent -->
  <path d="M256 122 L350 164 V254 C350 316 308 368 256 394 C204 368 162 316 162 254 V164 Z" 
        fill="url(#bg)" />

  <!-- Village Sprout / Rising Sun Graphic -->
  <g transform="translate(256, 260) scale(1.15)">
    <!-- Sun Rays -->
    <path d="M-40 -40 L-25 -25 M0 -55 L0 -35 M40 -40 L25 -25" stroke="url(#gold)" stroke-width="5" stroke-linecap="round" />
    <!-- Rising Sun Base -->
    <circle cx="0" cy="-20" r="18" fill="url(#gold)" />
    
    <!-- Village Roof / Pagoda / Gopuram Emblem -->
    <path d="M-50 10 L0 -25 L50 10 L40 10 L0 -15 L-40 10 Z" fill="#FFFFFF" />
    <rect x="-35" y="10" width="70" height="38" rx="4" fill="url(#gold)" />
    
    <!-- Pillar Columns -->
    <rect x="-26" y="16" width="10" height="32" rx="2" fill="#075B46" />
    <rect x="-5" y="16" width="10" height="32" rx="2" fill="#075B46" />
    <rect x="16" y="16" width="10" height="32" rx="2" fill="#075B46" />
    
    <!-- Foundation Step -->
    <rect x="-44" y="48" width="88" height="8" rx="3" fill="#FFFFFF" />
  </g>

  <!-- Telugu Leaf / Citizen Service Touchpoint -->
  <path d="M256 335 C275 350 295 355 315 345 C305 370 280 380 256 385 C232 380 207 370 197 345 C217 355 237 350 256 335 Z" 
        fill="url(#gold)" />
</svg>`;

fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf-8');
console.log('Created public/icon.svg');

/**
 * Creates a valid, standard uncompressed/deflated RGBA PNG file directly using Node's zlib.
 */
function createPng(width: number, height: number, bgColor: [number, number, number], innerScale = 1.0): Buffer {
  // RGBA raw pixel buffer: width * 4 bytes per row + 1 filter byte (0) per row
  const rowSize = 1 + width * 4;
  const rawData = Buffer.alloc(rowSize * height);

  const cx = width / 2;
  const cy = height / 2;
  const outerR = (Math.min(width, height) / 2) * innerScale;
  const cornerR = width * 0.22 * innerScale;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;

      // Distance from center
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Default background color #075B46
      let r = bgColor[0];
      let g = bgColor[1];
      let b = bgColor[2];
      let a = 255;

      // Rounded rect bounds
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);
      const halfSize = width * 0.44 * innerScale;

      if (absDx > halfSize || absDy > halfSize) {
        const cornerDx = Math.max(0, absDx - (halfSize - cornerR));
        const cornerDy = Math.max(0, absDy - (halfSize - cornerR));
        if (cornerDx * cornerDx + cornerDy * cornerDy > cornerR * cornerR) {
          // Outside rounded card
          r = 0;
          g = 0;
          b = 0;
          a = 0;
        }
      }

      // Inside shield / emblem graphics
      if (a > 0) {
        // Gold emblem ring
        if (dist > outerR * 0.72 && dist < outerR * 0.76) {
          r = 230; // #E6B84A
          g = 184;
          b = 74;
        } else if (dist <= outerR * 0.65) {
          // Central white and gold core
          const inShield = Math.abs(dx) <= outerR * 0.45 && dy >= -outerR * 0.45 && dy <= outerR * 0.45;
          if (inShield) {
            // Gold central temple/pillars
            if (Math.abs(dx) < outerR * 0.35 && dy > -outerR * 0.1 && dy < outerR * 0.35) {
              r = 230;
              g = 184;
              b = 74;
            } else if (dy <= -outerR * 0.1) {
              r = 255;
              g = 255;
              b = 255;
            } else {
              r = 248;
              g = 247;
              b = 242;
            }
          }
        }
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  // Deflate raw scanlines
  const compressed = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR Chunk
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression method
  ihdr[11] = 0; // filter method
  ihdr[12] = 0; // interlace method

  function createChunk(type: string, data: Buffer): Buffer {
    const len = data.length;
    const chunk = Buffer.alloc(12 + len);
    chunk.writeUInt32BE(len, 0);
    chunk.write(type, 4, 4, 'ascii');
    data.copy(chunk, 8);
    
    // CRC calculation
    let crc = 0xffffffff;
    for (let i = 4; i < 8 + len; i++) {
      let byte = chunk[i];
      for (let j = 0; j < 8; j++) {
        const bit = (crc ^ byte) & 1;
        crc = (crc >>> 1) ^ (bit ? 0xedb88320 : 0);
        byte >>>= 1;
      }
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    chunk.writeUInt32BE(crc, 8 + len);
    return chunk;
  }

  const ihdrChunk = createChunk('IHDR', ihdr);
  const idatChunk = createChunk('IDAT', compressed);
  const iendChunk = createChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate PNG icon assets
const bgForest: [number, number, number] = [7, 91, 70]; // #075B46

fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPng(192, 192, bgForest, 0.95));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPng(512, 512, bgForest, 0.95));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPng(512, 512, bgForest, 0.78)); // 15% safe padding
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPng(180, 180, bgForest, 0.95));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPng(64, 64, bgForest, 0.95));

console.log('All PWA icon assets generated successfully in public/');
