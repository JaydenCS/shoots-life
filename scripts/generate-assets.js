const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC = path.join(__dirname, '../public')

// ─── Icon SVG ─────────────────────────────────────────────────────────────────
// Amber rounded square + white camera shutter / single-frame mark
const iconSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E0A57A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C4784A;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="112" fill="url(#bg)" />

  <!-- Outer ring — lens rim -->
  <circle cx="256" cy="256" r="148" fill="none" stroke="rgba(255,255,255,0.25)" stroke-width="6"/>

  <!-- Shutter blades — 6 elongated ovals rotated around center -->
  <g transform="translate(256,256)">
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(0)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(60)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(120)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(180)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(240)"/>
    <ellipse cx="0" cy="-72" rx="28" ry="58" fill="rgba(255,255,255,0.90)" transform="rotate(300)"/>
  </g>

  <!-- Center aperture hole -->
  <circle cx="256" cy="256" r="46" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="22" fill="rgba(255,255,255,0.15)"/>
</svg>
`.trim()

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
// "shoots.life" wordmark — horizontal lockup
const logoSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 80" width="520" height="80">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@300;400&amp;display=swap');
    </style>
  </defs>

  <!-- wordmark — two weights: "shoots" regular · ".life" light -->
  <text
    x="0" y="62"
    font-family="'Playfair Display', Georgia, 'Times New Roman', serif"
    font-size="62"
    font-weight="400"
    fill="#1A1A1A"
    letter-spacing="-1"
  >shoots</text>
  <text
    x="266" y="62"
    font-family="'Playfair Display', Georgia, 'Times New Roman', serif"
    font-size="62"
    font-weight="300"
    fill="#D4956A"
    letter-spacing="-1"
  >.life</text>
</svg>
`.trim()

// ─── Dark logo variant ────────────────────────────────────────────────────────
const logoDarkSVG = logoSVG
  .replace('fill="#1A1A1A"', 'fill="#F8F4EF"')

// ─── Write SVGs ───────────────────────────────────────────────────────────────
fs.writeFileSync(path.join(PUBLIC, 'icon.svg'), iconSVG)
fs.writeFileSync(path.join(PUBLIC, 'logo.svg'), logoSVG)
fs.writeFileSync(path.join(PUBLIC, 'logo-dark.svg'), logoDarkSVG)
console.log('✓ SVGs written')

// ─── PNG exports via Sharp ────────────────────────────────────────────────────
async function run() {
  // favicon — 32x32
  await sharp(Buffer.from(iconSVG))
    .resize(32, 32)
    .png()
    .toFile(path.join(PUBLIC, 'favicon-32.png'))

  // favicon — 180x180 (Apple touch icon)
  await sharp(Buffer.from(iconSVG))
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC, 'apple-touch-icon.png'))

  // high-res icon — 512x512
  await sharp(Buffer.from(iconSVG))
    .resize(512, 512)
    .png()
    .toFile(path.join(PUBLIC, 'icon-512.png'))

  // logo — 2x retina
  await sharp(Buffer.from(logoSVG))
    .resize(1040, 160)
    .png()
    .toFile(path.join(PUBLIC, 'logo.png'))

  console.log('✓ PNGs generated')
  console.log('\nFiles written to public/:')
  console.log('  icon.svg, logo.svg, logo-dark.svg')
  console.log('  favicon-32.png, apple-touch-icon.png, icon-512.png, logo.png')
}

run().catch(console.error)
