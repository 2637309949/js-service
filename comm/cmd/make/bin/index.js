#!/usr/bin/env node
const path = require('path')
const fs = require('fs')
const { execFileSync } = require('child_process')

function executeMakefile(makefilePath, ...args) {
    try {
         execFileSync(makefilePath, args, { stdio: 'inherit' })
    } catch (err) {
        throw err
    }
}

const cwd = process.cwd()
const makefilePath = path.join(cwd, 'Makefile.bat')
try {
    fs.statSync(makefilePath)
    return executeMakefile(makefilePath, ...process.argv.slice(2))
} catch (err) {
}

let fileWalk = false
const walkDir = (dir) => {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
            walkDir(fullPath)
        } else if (entry.name === 'Makefile.bat') {
            fileWalk = true
            return executeMakefile(fullPath, ...process.argv.slice(2))
        }
    }
    return null
}

walkDir(cwd)