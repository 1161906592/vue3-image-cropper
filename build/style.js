const fs = require('fs')
const path = require('path')

const cwd = process.cwd()

fs.mkdirSync(path.join(cwd, "styles"))

fs.copyFileSync(path.join(cwd, "src/styles/index.css"), path.join(cwd, "styles/index.css"))
