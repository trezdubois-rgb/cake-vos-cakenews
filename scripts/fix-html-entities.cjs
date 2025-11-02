const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/data/articles.ts',
  'src/pages/Login.tsx',
  'src/pages/Signup.tsx',
  'src/pages/admin/ThemeManager.tsx'
];

function fixHtmlEntities(content) {
  // Replace &apos; with '
  content = content.replace(/&apos;/g, "'");
  // Replace &quot; with "
  content = content.replace(/&quot;/g, '"');
  return content;
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
    const originalCount = (content.match(/&apos;/g) || []).length + (content.match(/&quot;/g) || []).length;
    
    if (originalCount === 0) {
      console.log(`✓ ${file} - Already clean`);
      return;
    }
    
    const fixed = fixHtmlEntities(content);
    fs.writeFileSync(filePath, fixed, 'utf8');
    
    totalFixed += originalCount;
    console.log(`✓ ${file} - Fixed ${originalCount} HTML entities`);
  } catch (error) {
    console.error(`✗ Error fixing ${file}:`, error.message);
  }
});

console.log(`\n🎉 Total HTML entities fixed: ${totalFixed}`);

