import fs from 'fs';
import path from 'path';

const srcDir = process.cwd();

function getFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    if (file.startsWith('.') && file !== '.vuepress') return;
    if (file === 'node_modules' || file === 'dist' || file.startsWith('_compare_')) return;
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  });
  return results;
}

const zhDocs = getFiles(path.join(srcDir, 'docs')).filter(f => f.endsWith('.md'));
const enDocs = getFiles(path.join(srcDir, 'en/docs')).filter(f => f.endsWith('.md'));

const zhRelMap = new Map();
zhDocs.forEach(f => {
  const rel = path.relative(path.join(srcDir, 'docs'), f);
  zhRelMap.set(rel, f);
});

const enRelMap = new Map();
enDocs.forEach(f => {
  const rel = path.relative(path.join(srcDir, 'en/docs'), f);
  enRelMap.set(rel, f);
});

console.log('--- Documentation Comparison Analysis ---');

const comparison = [];

for (const [rel, zhFile] of zhRelMap.entries()) {
  const zhStat = fs.statSync(zhFile);
  const zhContent = fs.readFileSync(zhFile, 'utf-8');
  const zhLines = zhContent.split('\n').length;
  
  if (!enRelMap.has(rel)) {
    comparison.push({
      rel,
      status: 'MISSING_IN_EN',
      zhSize: zhStat.size,
      zhLines,
      enSize: 0,
      enLines: 0,
      ratio: 0
    });
  } else {
    const enFile = enRelMap.get(rel);
    const enStat = fs.statSync(enFile);
    const enContent = fs.readFileSync(enFile, 'utf-8');
    const enLines = enContent.split('\n').length;
    const ratio = (enStat.size / zhStat.size).toFixed(2);
    
    comparison.push({
      rel,
      status: ratio < 0.35 ? 'STUB_IN_EN' : 'EXISTS',
      zhSize: zhStat.size,
      zhLines,
      enSize: enStat.size,
      enLines,
      ratio
    });
  }
}

for (const [rel, enFile] of enRelMap.entries()) {
  if (!zhRelMap.has(rel)) {
    const enStat = fs.statSync(enFile);
    const enContent = fs.readFileSync(enFile, 'utf-8');
    comparison.push({
      rel,
      status: 'EXTRA_IN_EN',
      zhSize: 0,
      zhLines: 0,
      enSize: enStat.size,
      enLines: enContent.split('\n').length,
      ratio: 0
    });
  }
}

console.log(JSON.stringify(comparison, null, 2));
