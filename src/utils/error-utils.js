export function extractLineNumber(err) {
    if (!err || !err.stack) return null
  
    // Runtime errors: "at <anonymous>:3:1"
    const runtimeMatch = err.stack.match(/<anonymous>:(\d+):\d+/)
    if (runtimeMatch) {
      const userLine = parseInt(runtimeMatch[1], 10) - 1
      return userLine > 0 ? userLine : null
    }
  
    // Syntax errors from eval: "at new Script (<anonymous>:3:1)"  
    const syntaxMatch = err.stack.match(/at new Script \(<anonymous>:(\d+):\d+\)/)
    if (syntaxMatch) {
      const userLine = parseInt(syntaxMatch[1], 10) - 1
      return userLine > 0 ? userLine : null
    }
  
    return null
  }
  
  export function formatError(err) {
    const lineNumber = extractLineNumber(err)
    if (lineNumber !== null) {
      return `${err.message} (line ${lineNumber})`
    }
    return err.message
  }