#!/usr/bin/node

const fs = require('fs');

fs.copyFileSync('src/index.html', 'dist/index.html');