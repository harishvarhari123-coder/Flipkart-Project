const fs = require('fs');
const content = fs.readFileSync('d:/Flip/backend/server.js', 'utf-8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('fullName')) {
    console.log(`${i + 1}: ${line}`);
  }
});
