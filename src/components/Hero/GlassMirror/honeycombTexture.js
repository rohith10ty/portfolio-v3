import * as THREE from 'three'

/**
 * Creates a high-contrast, glowing honeycomb texture
 * matching the hexagonal geometry of ShapeGrid with crisp bronze/gold lines.
 */
export function createHoneycombTexture() {
  const size = 512
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')

  if (!ctx) return new THREE.Texture()

  // Dark smoked glass background
  ctx.fillStyle = '#140c06'
  ctx.fillRect(0, 0, size, size)

  // Subtle warm radial gradient
  const glow = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    size * 0.05,
    size * 0.5,
    size * 0.5,
    size * 0.6
  )
  glow.addColorStop(0, 'rgba(139, 98, 52, 0.45)')
  glow.addColorStop(0.5, 'rgba(65, 45, 21, 0.25)')
  glow.addColorStop(1, 'rgba(20, 12, 6, 0.05)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, size, size)

  // Draw pointy-top hexagons matching ShapeGrid.jsx
  const radius = 42
  const horizontalSpacing = Math.sqrt(3) * radius
  const verticalSpacing = radius * 1.5

  const drawHex = (x, y, r, isLit = false) => {
    ctx.beginPath()
    for (let side = 0; side < 6; side += 1) {
      const angle = (Math.PI / 3) * side + Math.PI / 6
      const px = x + r * Math.cos(angle)
      const py = y + r * Math.sin(angle)
      if (side === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.closePath()

    if (isLit) {
      // Golden amber cell fill
      ctx.fillStyle = 'rgba(216, 160, 94, 0.28)'
      ctx.fill()
      ctx.strokeStyle = 'rgba(240, 205, 155, 0.9)'
      ctx.lineWidth = 2.0
    } else {
      ctx.strokeStyle = 'rgba(216, 160, 94, 0.5)'
      ctx.lineWidth = 1.4
    }
    ctx.stroke()
  }

  const rows = Math.ceil(size / verticalSpacing) + 2
  const cols = Math.ceil(size / horizontalSpacing) + 2

  let cellIndex = 0
  for (let row = -1; row < rows; row += 1) {
    const stagger = row % 2 !== 0 ? horizontalSpacing / 2 : 0
    const y = row * verticalSpacing

    for (let col = -1; col < cols; col += 1) {
      const x = col * horizontalSpacing + stagger
      const isLit = cellIndex % 5 === 0 || cellIndex % 8 === 0
      drawHex(x, y, radius, isLit)
      cellIndex += 1
    }
  }

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(1.5, 1.5)
  texture.generateMipmaps = true
  texture.needsUpdate = true

  return texture
}
