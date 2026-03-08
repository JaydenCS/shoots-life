const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

const PUBLIC = path.join(__dirname, '../public')

// ─── Icon SVG ─────────────────────────────────────────────────────────────────
// Original design — amber rounded square + shutter blades
const iconSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#E0A57A;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#C4784A;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#bg)" />
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

// ─── Logo SVG ─────────────────────────────────────────────────────────────────
// Single text element with tspan for .life — no gap issue
const logoSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 64" width="440" height="64">
  <text
    y="52"
    font-family="Georgia,'Times New Roman',serif"
    font-size="52"
    font-weight="400"
    letter-spacing="-1"
  ><tspan fill="#1A1A1A">shoots</tspan><tspan fill="#D4956A">.life</tspan></text>
</svg>`

const logoDarkSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 64" width="440" height="64">
  <text
    y="52"
    font-family="Georgia,'Times New Roman',serif"
    font-size="52"
    font-weight="400"
    letter-spacing="-1"
  ><tspan fill="#F8F4EF">shoots</tspan><tspan fill="#D4956A">.life</tspan></text>
</svg>`

// ─── Write SVGs ───────────────────────────────────────────────────────────────
fs.writeFileSync(path.join(PUBLIC, 'icon.svg'), iconSVG)
fs.writeFileSync(path.join(PUBLIC, 'logo.svg'), logoSVG)
fs.writeFileSync(path.join(PUBLIC, 'logo-dark.svg'), logoDarkSVG)
console.log('✓ SVGs written')

// ─── PNG exports via Sharp ────────────────────────────────────────────────────
async function run() {
  await sharp(Buffer.from(iconSVG)).resize(32, 32).png().toFile(path.join(PUBLIC, 'favicon-32.png'))
  await sharp(Buffer.from(iconSVG)).resize(180, 180).png().toFile(path.join(PUBLIC, 'apple-touch-icon.png'))
  await sharp(Buffer.from(iconSVG)).resize(512, 512).png().toFile(path.join(PUBLIC, 'icon-512.png'))
  await sharp(Buffer.from(logoSVG)).resize(880, 128).png().toFile(path.join(PUBLIC, 'logo.png'))
  await sharp(Buffer.from(logoDarkSVG)).resize(880, 128).png().toFile(path.join(PUBLIC, 'logo-dark.png'))

  console.log('✓ PNGs generated')
}

run().catch(console.error)
