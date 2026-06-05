const { execSync } = require('child_process')
execSync('npx ts-node --transpile-only prisma/seed.ts', {
  stdio: 'inherit',
  env: { ...process.env, TS_NODE_COMPILER_OPTIONS: JSON.stringify({ module: 'CommonJS', moduleResolution: 'node' }) },
})
