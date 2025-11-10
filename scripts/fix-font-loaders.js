const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'dist', 'index.mjs');
let content = fs.readFileSync(filePath, 'utf8');

// Replace var with const for font loaders
content = content.replace(/var geistSans =/g, 'const geistSans =');
content = content.replace(/var geistMono =/g, 'const geistMono =');

fs.writeFileSync(filePath, content);
console.log('Fixed font loader declarations in dist/index.mjs');
