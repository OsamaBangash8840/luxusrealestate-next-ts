/**
 * Next.js 15 /_not-found App Route Prerender Patch
 * Resolves Next.js 15 internal assertion when prerendering root not-found with route groups:
 * "Invariant: no direct app page entry found for /_not-found"
 */
const fs = require('fs')
const path = require('path')

const targetFiles = [
  path.join(process.cwd(), 'node_modules', 'next', 'dist', 'shared', 'lib', 'router', 'utils', 'app-paths.js'),
  path.join(process.cwd(), 'node_modules', 'next', 'dist', 'esm', 'shared', 'lib', 'router', 'utils', 'app-paths.js'),
]

for (const file of targetFiles) {
  if (!fs.existsSync(file)) continue
  let content = fs.readFileSync(file, 'utf8')
  if (!content.includes('/* next-15-notfound-patch */')) {
    content = content.replace(
      'if (entry === undefined) {',
      'if (entry === undefined) { /* next-15-notfound-patch */ if (pathname === "/_not-found") { const found = appPaths.find(p => p.includes("not-found")); if (found) return found; return "/_not-found"; }'
    )
    fs.writeFileSync(file, content)
    console.log(`[patch] Applied Next.js 15 not-found fix to ${path.basename(file)}`)
  }
}
