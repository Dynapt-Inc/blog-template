const fs = require("fs");
const path = require("path");

const copies = [
  {
    from: path.join(__dirname, "..", "src", "app", "globals.css"),
    to: path.join(__dirname, "..", "dist", "styles", "globals.css"),
  },
];

for (const { from, to } of copies) {
  if (!fs.existsSync(from)) {
    console.warn(`[copy-assets] Skipping missing source file: ${from}`);
    continue;
  }

  fs.mkdirSync(path.dirname(to), { recursive: true });
  fs.copyFileSync(from, to);
  console.log(`[copy-assets] Copied ${from} -> ${to}`);
}
