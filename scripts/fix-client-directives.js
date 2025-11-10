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

// Add "use client" directives before individual components that use hooks
// This ensures that even within the bundled file, component boundaries are respected
const componentPattern = /\/\/ src\/components\/.*?\.tsx\n(?:import .*?\n)*function (\w+)/g;
let match;
while ((match = componentPattern.exec(content)) !== null) {
  const componentName = match[1];
  const matchIndex = match.index;
  const matchLength = match[0].length;

  // Check if this component uses hooks by looking at the function body
  const componentStart = matchIndex + matchLength;
  const nextFunctionIndex = content.indexOf('\nfunction ', componentStart);
  const componentEnd = nextFunctionIndex !== -1 ? nextFunctionIndex : content.length;
  const componentBody = content.substring(componentStart, componentEnd);

  const usesHooks = componentBody.includes('useState') ||
                    componentBody.includes('useEffect') ||
                    componentBody.includes('useMemo') ||
                    componentBody.includes('useCallback') ||
                    componentBody.includes('useRef');

  if (usesHooks && !content.substring(matchIndex - 15, matchIndex).includes('"use client"')) {
    // Add "use client" directive before this component
    const insertPoint = matchIndex;
    content = content.substring(0, insertPoint) + '"use client";\n\n' + content.substring(insertPoint);
    console.log(`✓ Added "use client" directive before ${componentName} component`);
  }
}

fs.writeFileSync(filePath, content, 'utf8');

// Note: The consuming app may need transpilePackages in next.config.js:
// transpilePackages: ['@caleblawson/blog-shell']


