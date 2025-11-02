const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/data/articles.ts',
  'src/contexts/GamificationContext.tsx'
];

function fixApostrophes(content) {
  // Fix apostrophes in single-quoted strings
  // Match single-quoted strings and escape apostrophes inside them
  return content.replace(/'([^']*?)'/g, (match, inner) => {
    // If the inner content already has escaped apostrophes, don't double-escape
    if (inner.includes("\\'")) {
      return match;
    }
    // Escape unescaped apostrophes
    const fixed = inner.replace(/'/g, "\\'");
    return `'${fixed}'`;
  });
}

let totalFixed = 0;

filesToFix.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    return;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixApostrophes(content);
    
    if (content === fixed) {
      console.log(`✓ ${file} - No changes needed`);
      return;
    }
    
    fs.writeFileSync(filePath, fixed, 'utf8');
    
    totalFixed++;
    console.log(`✓ ${file} - Fixed apostrophes`);
  } catch (error) {
    console.error(`✗ Error fixing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Total files fixed: ${totalFixed}`);

