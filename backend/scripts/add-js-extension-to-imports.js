// Node.js script to add .js extension to all runtime imports in .ts files (not type-only)
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { IClient } from "../types/index.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  // Replace import ... from "../foo" or "./bar" with .js extension (not for .json, .css, etc)
  content = content.replace(
    /(import\s+(?!type)[^;]*?from\s+["'](\.\.?\/[^"']+?))(?!\.json|\.css|\.js|\.jsx|\.ts|\.tsx|\.d\.ts)(["'])/g,
    "$1.js$3",
  );
  fs.writeFileSync(filePath, content, "utf8");
}

function walk(dir) {
  fs.readdirSync(dir).forEach((f) => {
    const filePath = path.join(dir, f);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith(".ts")) {
      processFile(filePath);
    }
  });
}

walk(path.join(__dirname, "../src"));
console.log("All runtime imports updated to use .js extension.");
