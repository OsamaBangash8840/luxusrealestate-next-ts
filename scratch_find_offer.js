const fs = require('fs');
const path = 'd:/Clones/luxus-main-apis/server_clone/socketConnection.js';
const socketContent = fs.readFileSync(path, 'utf8');
const lines = socketContent.split(/\r?\n/);
const idx = lines.findIndex(l => l.includes("if (status === 'accepted')"));
console.log('Found index:', idx);
console.log(lines.slice(idx - 2, idx + 25).join('\n'));
