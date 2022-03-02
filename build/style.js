const fs = require('fs')
const path = require('path')

const cwd = process.cwd()

fs.mkdirSync(path.join(cwd, "es/styles"))
fs.mkdirSync(path.join(cwd, "lib/styles"))

fs.copyFileSync(path.join(cwd, "src/styles/index.css"), path.join(cwd, "es/styles/index.css"))
fs.copyFileSync(path.join(cwd, "src/styles/index.css"), path.join(cwd, "lib/styles/index.css"))
