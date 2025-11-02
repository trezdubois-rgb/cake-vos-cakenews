const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/data/articles.ts');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixCount = 0;
  
  // Fix apostrophes in title: '...' and excerpt: '...' patterns
  // Match title or excerpt followed by single-quoted string
  content = content.replace(/(title|excerpt):\s*'([^']*)'/g, (match, prop, value) => {
    // Check if value contains unescaped apostrophes
    if (value.includes("'") && !value.includes("\\'")) {
      fixCount++;
      // Escape all apostrophes in the value
      const fixed = value.replace(/'/g, "\\'");
      return `${prop}: '${fixed}'`;
    }
    return match;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  
  console.log(`✅ Fixed ${fixCount} apostrophes in articles.ts`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

