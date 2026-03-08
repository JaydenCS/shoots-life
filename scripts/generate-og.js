const sharp = require('sharp')
const path = require('path')

const PUBLIC = path.join(__dirname, '../public')
const PHOTOS = path.join(PUBLIC, 'photos')

// Inline the icon SVG so we can composite it
const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="72" height="72">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E0A57A"/>
      <stop offset="100%" style="stop-color:#C4784A"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="148" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="6"/>
  <g transform="translate(256,256)">
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(0)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(60)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(120)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(180)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(240)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(300)"/>
  </g>
  <circle cx="256" cy="256" r="46" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="22" fill="rgba(255,255,255,0.15)"/>
</svg>`

// Main overlay — gradient + logo text + tagline
const W = 1200
const H = 630

const overlaySVG = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Left-heavy gradient so text is always readable -->
    <linearGradient id="veil" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   stop-color="#0E0E0E" stop-opacity="0.93"/>
      <stop offset="48%"  stop-color="#0E0E0E" stop-opacity="0.60"/>
      <stop offset="75%"  stop-color="#0E0E0E" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#0E0E0E" stop-opacity="0.0"/>
    </linearGradient>
    <!-- Subtle bottom vignette -->
    <linearGradient id="vignette" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.45"/>
    </linearGradient>
  </defs>

  <!-- Overlays -->
  <rect width="${W}" height="${H}" fill="url(#veil)"/>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>

  <!-- "shoots.life" — single text line, tspan for two-tone -->
  <text
    x="72" y="316"
    font-family="Georgia,'Times New Roman',serif"
    font-size="96"
    font-weight="400"
    letter-spacing="-2"
  >
    <tspan fill="#F8F4EF">shoots</tspan><tspan fill="#D4956A">.life</tspan>
  </text>

  <!-- Tagline -->
  <text
    x="76" y="376"
    font-family="Arial,Helvetica,sans-serif"
    font-size="17"
    fill="rgba(248,244,239,0.42)"
    letter-spacing="3.5"
  >ONE PHOTO. ONE DAY. JUST FOR YOU.</text>

  <!-- Bottom credit -->
  <text
    x="72" y="${H - 36}"
    font-family="Georgia,'Times New Roman',serif"
    font-size="14"
    fill="rgba(248,244,239,0.22)"
    letter-spacing="0.5"
  >shoots.life</text>
</svg>`

async function run() {
  await sharp(path.join(PHOTOS, 'temple.jpg'))
    .resize(W, H, { fit: 'cover', position: 'center' })
    .composite([
      // Gradient + text overlay
      { input: Buffer.from(overlaySVG), top: 0, left: 0 },
      // Icon — top left
      { input: Buffer.from(iconSVG), top: 56, left: 68 },
    ])
    .png()
    .toFile(path.join(PUBLIC, 'og-image.png'))

  console.log('✓ og-image.png → public/og-image.png (1200×630)')
}

run().catch(console.error)
