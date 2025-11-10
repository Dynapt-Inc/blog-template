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

// Add "use client" directive at the very top of the file if it's not already there
// This is required for components that use React hooks (useState, useEffect, etc.)
// Next.js requires this directive to be the first line, before any imports
if (!content.startsWith('"use client"')) {
  // Check if the file contains client components (components using hooks)
  const hasClientComponents = content.includes('useState') || 
                              content.includes('useEffect') || 
                              content.includes('useMemo') ||
                              content.includes('useCallback');
  
  if (hasClientComponents) {
    content = '"use client";\n' + content;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✓ Added "use client" directive to dist/index.mjs');
  } else {
    console.log('✓ No client components detected, skipping "use client" directive');
  }
} else {
  console.log('✓ "use client" directive already present in dist/index.mjs');
}

// Note: The consuming app may need transpilePackages in next.config.js:
// transpilePackages: ['@caleblawson/blog-shell']


