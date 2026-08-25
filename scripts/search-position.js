const fs = require("fs");
const path = require("path");

function searchPosition(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== "node_modules" && entry.name !== ".git") {
        searchPosition(full);
      }
    } else if (entry.name.endsWith(".json") || entry.name.endsWith(".js") || entry.name.endsWith(".html")) {
      try {
        const text = fs.readFileSync(full, "utf-8");
        if (text.length > 1400 && text.length < 1500) {
          console.log(`Potential file (${text.length} chars): ${full}`);
          console.log(`Chars 1410-1440: "${text.substring(1410, 1440)}"`);
        }
      } catch (e) {}
    }
  }
}

searchPosition("C:\\Users\\Angad\\.gemini\\antigravity\\scratch\\migrant-health");
