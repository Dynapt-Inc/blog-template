const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dist', 'index.mjs');
let content = fs.readFileSync(filePath, 'utf8');

// If the file contains client components (hooks), ensure "use client" is at the very top
const hasClientComponents = content.includes('useState') ||
                          content.includes('useEffect') ||
                          content.includes('useMemo') ||
                          content.includes('useCallback');

if (hasClientComponents && !content.startsWith('"use client"')) {
  // Remove any existing "use client" directives that are in the wrong place
  content = content.replace(/"use client";\n/g, '');
  // Add "use client" at the very beginning
  content = '"use client";\n' + content;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✓ Added "use client" directive at the top of dist/index.mjs');
} else if (hasClientComponents) {
  console.log('✓ "use client" directive already correctly placed in dist/index.mjs');
} else {
  console.log('✓ No client components detected in bundle');
}