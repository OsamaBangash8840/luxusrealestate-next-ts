import { readdirSync, readFileSync, statSync } from 'node:fs'
import { extname, join } from 'node:path'

const ROOT = join(process.cwd(), 'src')
const exts = new Set(['.ts', '.tsx', '.css'])
const allowList = [
  'src/app/components/user/googleBtn/index.tsx', // Google brand SVG colors
  'src/app/base/config/colors.ts',
  'src/app/globals.css', // CSS variable definitions use raw HSL values
]

const issues = []
const hexPattern = /#[0-9A-Fa-f]{3,8}/g

// Detect raw Tailwind palette classes that bypass the design system.
// Matches e.g. bg-blue-600, text-gray-700, border-red-500, hover:bg-green-100
const tailwindPalettePattern =
  /(?:^|[\s"'`])(?:(?:hover|focus|active|disabled|dark|group-hover):)?(?:bg|text|border|ring|outline|shadow|from|to|via|placeholder|divide|accent|caret|fill|stroke)-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|black|white)(?:-\d{2,3})?(?:\/\d+)?(?=[\s"'`;}]|$)/gm

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      if (entry === '.next' || entry === 'node_modules') continue
      walk(fullPath)
      continue
    }

    if (!exts.has(extname(fullPath))) continue

    const normalized = fullPath.replace(/\\/g, '/').replace(`${process.cwd().replace(/\\/g, '/')}/`, '')
    if (allowList.includes(normalized)) continue

    const text = readFileSync(fullPath, 'utf8')

    // Check hex colors
    const hexMatches = text.match(hexPattern)
    if (hexMatches) {
      issues.push({ file: normalized, type: 'hex', matches: [...new Set(hexMatches)] })
    }

    // Check raw Tailwind palette classes (only in .tsx/.ts files, not .css)
    if (extname(fullPath) !== '.css') {
      const paletteMatches = text.match(tailwindPalettePattern)
      if (paletteMatches) {
        const cleaned = [...new Set(paletteMatches.map((m) => m.trim()))]
        issues.push({ file: normalized, type: 'tailwind-palette', matches: cleaned })
      }
    }
  }
}

walk(ROOT)

if (issues.length > 0) {
  console.error('Design system violations detected. Use semantic tokens/classes instead:\n')
  for (const issue of issues) {
    const label = issue.type === 'hex' ? 'Hex color' : 'Raw Tailwind palette class'
    console.error(`  ${label} in ${issue.file}:`)
    console.error(`    ${issue.matches.join(', ')}\n`)
  }
  process.exit(1)
}

console.log('✓ No design system violations found. All colors use semantic tokens.')