const fs = require('fs-extra');
const path = require('path');

const root = path.resolve(__dirname, '../../');
const env = path.join(root, '.env');
const envSample = path.join(root, '.env.sample');

const content = fs.readFileSync(env, 'utf8');
const sampleContent = content
  .replace(/"/g, "'")
  .replace(/='(.*?)'/g, "=''");
fs.writeFileSync(envSample, sampleContent);
