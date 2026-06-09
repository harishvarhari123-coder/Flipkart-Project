const fs = require('fs');
const path = require('path');

const OLD_URL = 'http://localhost:5000';
const NEW_URL = 'https://flipkart-project-l2ex.onrender.com';

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes(OLD_URL)) {
        content = content.replace(new RegExp(OLD_URL, 'g'), NEW_URL);
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

replaceInDir(path.join(__dirname, 'frontend', 'src'));
console.log('✅ API URLs updated successfully!');
