const fs = require('fs');
const path = require('path');

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

const en = flatten(require('./src/locales/en.json'));
const fr = flatten(require('./src/locales/fr.json'));
const ar = flatten(require('./src/locales/ar.json'));

const enKeys = Object.keys(en);
const frKeys = Object.keys(fr);
const arKeys = Object.keys(ar);

const missingInFr = enKeys.filter(k => !frKeys.includes(k));
const missingInAr = enKeys.filter(k => !arKeys.includes(k));

console.log('Missing in FR:', missingInFr);
console.log('Missing in AR:', missingInAr);
