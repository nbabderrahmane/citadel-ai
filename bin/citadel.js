#!/usr/bin/env node
import('../dist/cli/index.js').catch((e) => { console.error('Run "npm run build" first:', e.message); process.exit(1); });
