// This script replaces .ts with .js in all import/export statements in dist/*.js files
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  // Replace only in import/export statements
  content = content.replace(/(from\s+["'].*?)(\.ts)(["'])/g, "$1.js$3");
  content = content.replace(/(import\s+["'].*?)(\.ts)(["'])/g, "$1.js$3");
  fs.writeFileSync(filePath, content, "utf8");
}

function walk(dir) {
  fs.readdirSync(dir).forEach((f) => {
    const filePath = path.join(dir, f);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else if (filePath.endsWith(".js")) {
      replaceInFile(filePath);
    }
  });
}

walk(path.join(__dirname, "../dist"));
console.log("All .ts import paths replaced with .js in dist/.");
