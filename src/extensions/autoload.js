// Loads bundled extensions on demand: before code is evaluated, find the names it
// uses that hydra doesn't define yet and load the extensions that provide them.
// Also serves the bundled copy when a sketch loadScript()s a known extension URL.
import { Parser } from 'acorn'
import { extensions, extensionsForURL } from './registry.js'

const lookup = { globals: new Map(), methods: new Map(), arrays: new Map(), members: new Map() }
extensions.filter((ext) => ext.autoload).forEach((ext) => {
  const { globals = [], methods = [], arrays = [], members = {} } = ext.provides
  const add = (map, key) => { if (!map.has(key)) map.set(key, ext) }
  globals.forEach((name) => add(lookup.globals, name))
  methods.forEach((name) => add(lookup.methods, name))
  arrays.forEach((name) => add(lookup.arrays, name))
  Object.entries(members).forEach(([obj, props]) => props.forEach((p) => add(lookup.members, `${obj}.${p}`)))
})

const loaded = new Map() // extension id -> promise

const extensionURL = (ext) => new URL(`extensions/${ext.file}`, document.baseURI).href

function injectScript(ext) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.onload = () => resolve(ext)
    script.onerror = () => reject(new Error(`could not load extension ${ext.name}`))
    script.async = false // run in the order they were requested
    script.src = extensionURL(ext)
    document.head.appendChild(script)
  })
}

function waitUntil(check, timeout = 5000) {
  return new Promise((resolve) => {
    const start = performance.now()
    const poll = () => {
      if (check() || performance.now() - start > timeout) resolve()
      else setTimeout(poll, 50)
    }
    poll()
  })
}

// force: run the script again even if it was loaded before (what an explicit loadScript does)
function load(ext, force = false) {
  if (loaded.has(ext.id) && !force) return loaded.get(ext.id)
  const p = injectScript(ext).then(async () => {
    if (ext.ready) await waitUntil(ext.ready)
    const reapply = extensions.filter((other) => other.reapplyAfter?.includes(ext.id) && loaded.has(other.id))
    for (const other of reapply) await injectScript(other)
    return ext
  })
  loaded.set(ext.id, p)
  p.catch(() => loaded.delete(ext.id))
  return p
}

// collect the identifiers a piece of code binds itself (variables, params, assignments)
function addBindings(pattern, declared) {
  if (!pattern) return
  switch (pattern.type) {
    case 'Identifier': declared.add(pattern.name); break
    case 'ObjectPattern': pattern.properties.forEach((p) => addBindings(p.value || p.argument, declared)); break
    case 'ArrayPattern': pattern.elements.forEach((el) => addBindings(el, declared)); break
    case 'RestElement': addBindings(pattern.argument, declared); break
    case 'AssignmentPattern': addBindings(pattern.left, declared); break
  }
}

// root of a chain like osc().rotate().rgb -> { root: osc, hasCall: true }
function chainRoot(node) {
  let hasCall = false
  for (;;) {
    if (node.type === 'MemberExpression') node = node.object
    else if (node.type === 'CallExpression') { hasCall = true; node = node.callee }
    else if (node.type === 'ChainExpression') node = node.expression
    else return { root: node, hasCall }
  }
}

function isReference(node, parent, key) {
  if (!parent) return true
  switch (parent.type) {
    case 'MemberExpression': return key !== 'property' || parent.computed
    case 'Property':
    case 'MethodDefinition':
    case 'PropertyDefinition': return key !== 'key' || parent.computed
    case 'LabeledStatement':
    case 'BreakStatement':
    case 'ContinueStatement': return false
    default: return true
  }
}

// what the code references, grouped like registry `provides`
export function analyze(code) {
  let ast
  try {
    ast = Parser.parse(code, {
      ecmaVersion: 'latest',
      allowAwaitOutsideFunction: true,
      allowReturnOutsideFunction: true
    })
  } catch (e) {
    return null // let the evaluation report the syntax error
  }

  const declared = new Set()
  const globals = new Map() // name -> used as a function call
  const methods = new Set()
  const arrays = new Set()
  const members = [] // [object, property]
  const scripts = [] // urls passed to loadScript()

  const walk = (node, parent, key) => {
    switch (node.type) {
      case 'VariableDeclarator': addBindings(node.id, declared); break
      case 'FunctionDeclaration':
      case 'FunctionExpression':
      case 'ArrowFunctionExpression':
        if (node.id) declared.add(node.id.name)
        node.params.forEach((p) => addBindings(p, declared))
        break
      case 'ClassDeclaration': if (node.id) declared.add(node.id.name); break
      case 'CatchClause': addBindings(node.param, declared); break
      case 'AssignmentExpression': addBindings(node.left, declared); break
      case 'Identifier':
        if (isReference(node, parent, key)) {
          const isCall = (parent?.type === 'CallExpression' || parent?.type === 'NewExpression') && key === 'callee'
          globals.set(node.name, globals.get(node.name) || isCall)
        }
        break
      case 'MemberExpression':
        if (!node.computed && node.property.type === 'Identifier') {
          const prop = node.property.name
          if (node.object.type === 'Identifier') {
            members.push([node.object.name, prop])
          } else {
            const { root, hasCall } = chainRoot(node.object)
            if (root.type === 'ArrayExpression' || (root.type === 'Identifier' && root.name === 'Array')) arrays.add(prop)
            else if (root.type === 'Identifier' && hasCall) methods.add(prop)
          }
        }
        break
      case 'CallExpression': {
        const { callee, arguments: args } = node
        const name = callee.type === 'Identifier' ? callee.name : callee.property?.name
        if (name === 'loadScript' && args[0]?.type === 'Literal' && typeof args[0].value === 'string') {
          scripts.push(args[0].value)
        }
        break
      }
    }
    for (const k in node) {
      const child = node[k]
      if (Array.isArray(child)) child.forEach((c) => c && typeof c.type === 'string' && walk(c, node, k))
      else if (child && typeof child.type === 'string' && k !== 'loc') walk(child, node, k)
    }
  }
  walk(ast, null, null)

  declared.forEach((name) => globals.delete(name))
  return { globals, methods, arrays, members: members.filter(([obj]) => !declared.has(obj)), scripts }
}

// window.blur and friends are browser built-ins, not hydra functions
const isBuiltin = (value) => typeof value === 'function' && /\[native code\]\s*\}$/.test(Function.prototype.toString.call(value))

const memberKey = (obj) => (/^o\d+$/.test(obj) ? 'output' : /^s\d+$/.test(obj) ? 'source' : obj)

// extensions the code needs that are not loaded yet
export function requiredExtensions(code) {
  const used = analyze(code)
  if (!used || typeof window.osc !== 'function') return []

  const sourcePrototype = Object.getPrototypeOf(window.osc())
  const needed = new Set()
  const need = (ext, missing) => { if (ext && missing) needed.add(ext) }

  used.globals.forEach((isCall, name) => {
    const value = window[name]
    need(lookup.globals.get(name), isCall ? typeof value !== 'function' || isBuiltin(value) : value === undefined)
  })
  used.methods.forEach((name) => need(lookup.methods.get(name), !(name in sourcePrototype)))
  used.arrays.forEach((name) => need(lookup.arrays.get(name), !(name in Array.prototype) && !(name in Array)))
  used.members.forEach(([obj, prop]) => {
    const target = window[obj]
    need(lookup.members.get(`${memberKey(obj)}.${prop}`), target != null && target[prop] === undefined)
  })

  // the sketch loads these itself
  used.scripts.flatMap(extensionsForURL).forEach((ext) => needed.delete(ext))

  return extensions.filter((ext) => needed.has(ext))
}

// resolves with the extensions that were loaded for this code
export async function autoload(code) {
  let exts
  try {
    install()
    exts = requiredExtensions(code)
  } catch (err) {
    console.warn('extension autoload failed', err)
    return []
  }
  const results = await Promise.allSettled(exts.map((ext) => load(ext)))
  results.forEach((r) => { if (r.status === 'rejected') console.warn(r.reason) })
  return results.filter((r) => r.status === 'fulfilled').map((r) => r.value)
}

// make loadScript() serve the bundled copy of known extension URLs
export function install() {
  const loadScript = window.loadScript
  if (typeof loadScript !== 'function' || loadScript.bundled) return
  const wrapped = function (url = '', ...rest) {
    const exts = extensionsForURL(url)
    if (exts.length === 0) return loadScript.call(this, url, ...rest)
    return Promise.all(exts.map((ext) => load(ext, true))).catch((err) => {
      console.warn(err, '- trying', url)
      return loadScript.call(this, url, ...rest)
    })
  }
  wrapped.bundled = true
  window.loadScript = wrapped
}
