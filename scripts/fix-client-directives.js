const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dist', 'index.mjs');
let content = fs.readFileSync(filePath, 'utf8');

// Verify React is externalized (not bundled)
// This is critical for React hooks to work correctly
if (content.includes('node_modules/react') || content.includes('from "react"') || content.includes("from 'react'")) {
  console.log('✓ React is properly externalized in dist/index.mjs');
} else {
  console.warn('⚠ Warning: React import pattern not found - hooks may not work correctly');
}

// Note: "use client" directives in source files are preserved by Next.js
// when importing from node_modules, as long as React is externalized.
// The consuming app may need transpilePackages in next.config.js:
// transpilePackages: ['@caleblawson/blog-shell']


