const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'src/data/articles.ts');

try {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Count apostrophes before
  const beforeCount = (content.match(/(?<!\\)'/g) || []).length;
  
  // Fix apostrophes in single-quoted strings by escaping them
  // This regex finds single-quoted strings and escapes unescaped apostrophes inside
  content = content.replace(/'([^'\\]*(?:\\.[^'\\]*)*)'/g, (match) => {
    // If already properly escaped, return as is
    if (!match.includes("'") || match.match(/\\'/g)) {
      return match;
    }
    // Escape apostrophes
    return match.replace(/(?<!\\)'/g, "\\'");
  });
  
  // Alternative approach: replace specific patterns
  // Fix common French contractions
  const replacements = [
    [/d'un/g, "d\\'un"],
    [/d'une/g, "d\\'une"],
    [/l'art/g, "l\\'art"],
    [/l'essentiel/g, "l\\'essentiel"],
    [/qu'une/g, "qu\\'une"],
    [/c'est/g, "c\\'est"],
    [/l'IA/g, "l\\'IA"],
    [/L'IA/g, "L\\'IA"],
    [/l'intelligence/g, "l\\'intelligence"],
    [/L'intelligence/g, "L\\'intelligence"],
    [/d'articles/g, "d\\'articles"],
    [/l'aperçu/g, "l\\'aperçu"],
    [/l'upload/g, "l\\'upload"],
    [/aujourd'hui/g, "aujourd\\'hui"],
    [/s'offrent/g, "s\\'offrent"],
    [/d'hiver/g, "d\\'hiver"],
    [/l'ensemble/g, "l\\'ensemble"],
    [/d'imiter/g, "d\\'imiter"],
    [/l'un/g, "l\\'un"],
    [/d'IA/g, "d\\'IA"],
    [/l'avenir/g, "l\\'avenir"],
    [/n'est/g, "n\\'est"],
    [/Qu'est-ce/g, "Qu\\'est-ce"],
    [/qu'est-ce/g, "qu\\'est-ce"],
    [/d'objets/g, "d\\'objets"],
    [/l'essentiel/g, "l\\'essentiel"],
    [/l'utilisé/g, "l\\'utilisé"],
    [/l'utiliser/g, "l\\'utiliser"],
    [/l'avez/g, "l\\'avez"],
    [/L'âge/g, "L\\'âge"],
    [/l'âge/g, "l\\'âge"],
    [/d'or/g, "d\\'or"],
    [/l'industrie/g, "l\\'industrie"],
    [/l'art/g, "l\\'art"],
    [/L'évolution/g, "L\\'évolution"],
    [/l'évolution/g, "l\\'évolution"],
    [/l'essence/g, "l\\'essence"],
    [/l'observation/g, "l\\'observation"],
    [/l'ensoleillement/g, "l\\'ensoleillement"],
    [/l'exposition/g, "l\\'exposition"],
    [/l'eau/g, "l\\'eau"],
    [/l'espace/g, "l\\'espace"],
    [/l'association/g, "l\\'association"],
    [/L'irrigation/g, "L\\'irrigation"],
    [/l'irrigation/g, "l\\'irrigation"],
    [/l'improvisation/g, "l\\'improvisation"],
    [/jusqu'au/g, "jusqu\\'au"],
    [/d'œuvre/g, "d\\'œuvre"],
    [/d'autres/g, "d\\'autres"],
    [/l'écoute/g, "l\\'écoute"],
    [/L'activité/g, "L\\'activité"],
    [/l'activité/g, "l\\'activité"],
    [/l'amélioration/g, "l\\'amélioration"],
    [/l'hormone/g, "l\\'hormone"],
    [/l'humeur/g, "l\\'humeur"],
    [/l'estime/g, "l\\'estime"],
    [/L'OMS/g, "L\\'OMS"],
    [/l'OMS/g, "l\\'OMS"],
    [/d'activité/g, "d\\'activité"],
    [/n'est/g, "n\\'est"],
    [/l'élément/g, "l\\'élément"],
    [/l'objectif/g, "l\\'objectif"],
    [/d'arrière-plan/g, "d\\'arrière-plan"],
    [/s'apprend/g, "s\\'apprend"],
    [/d'apprendre/g, "d\\'apprendre"],
    [/l'intelligence/g, "l\\'intelligence"],
    [/n'est/g, "n\\'est"],
    [/l'automatisation/g, "l\\'automatisation"],
    [/l'adoption/g, "l\\'adoption"],
    [/d'entreprises/g, "d\\'entreprises"],
    [/l'immobilier/g, "l\\'immobilier"],
    [/l'équilibre/g, "l\\'équilibre"],
    [/L'IA/g, "L\\'IA"],
    [/l'IA/g, "l\\'IA"],
    [/d'empathie/g, "d\\'empathie"],
    [/d'expérience/g, "d\\'expérience"],
    [/d'éthique/g, "d\\'éthique"],
    [/l'avenir/g, "l\\'avenir"]
  ];
  
  // Apply replacements only in single-quoted strings
  replacements.forEach(([pattern, replacement]) => {
    // Only replace within single-quoted strings (title, excerpt, etc.)
    content = content.replace(
      new RegExp(`(title|excerpt|description|label|name):\\s*'([^']*?)${pattern.source}([^']*?)'`, 'g'),
      (match, prop, before, after) => {
        return `${prop}: '${before}${replacement}${after}'`;
      }
    );
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  
  const afterCount = (content.match(/(?<!\\)'/g) || []).length;
  
  console.log('✅ Articles apostrophes fixed!');
  console.log(`   Unescaped apostrophes: ${beforeCount} → ${afterCount}`);
  
} catch (error) {
  console.error('❌ Error:', error.message);
}

