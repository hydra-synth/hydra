#! /usr/bin/env node

const fs = require('fs')
const glslfuncs = require('hydra-synth/src/composable-glsl-functions.js')

const [,, outPath] = process.argv

const categories = {}
const argtypes = {}

Object.keys(glslfuncs).forEach((k) => {
  const f = glslfuncs[k]
  const categoryName = f.type.charAt(0).toUpperCase() + f.type.slice(1)
  categories[categoryName] = categories[categoryName] || []
  categories[categoryName].push(k)
  const inputs = f.inputs || []
  inputs.forEach((i) => {
    argtypes[i.type] = i.type
  })
})

const createlist = (items) => items.map((i) => `* ${i}`).join('\n')

const createFuncDoc = (fname) => {
  const title = `#### ${fname}`
  const argnames = (glslfuncs[fname].inputs || []).map(i => `${i.name} :: ${i.type}`)

  let args
  if (argnames.length > 1) {
    args = `#### Args\n${createlist(argnames)}`
  } else {
    args = 'No Args'
  }

  return `${title}\n\n${args}\n`
}

const createCategory = (cname) => `### ${cname}

${categories[cname].map(createFuncDoc).join('\n')}
`

const output = `# Functions

## Argument Types

${createlist(Object.keys(argtypes).sort())}

## Functions

${Object.keys(categories).sort().map(createCategory).join('\n')}

`

fs.writeFile(outPath, output, function (err) {
  if (err) {
    return console.log(err)
  }

  console.log('The file was saved!')
})
