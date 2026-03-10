const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!dirFile.includes('node_modules')) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const keys = new Set();
const files = walkSync('./src');
files.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  let match;
  const regex = /t\(['"]([^'"]+)['"]\)/g;
  while ((match = regex.exec(content)) !== null) {
    keys.add(match[1]);
  }
});

const flatten = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null) {
      Object.assign(acc, flatten(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
};

const enKeys = Object.keys(flatten(require('./src/locales/en.json')));

const missing = Array.from(keys).filter(k => !enKeys.includes(k));
console.log('MISSING KEYS:', missing);
