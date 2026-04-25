export function extractLineNumber(err) {
    if (!err || !err.stack) return null

    const match = err.stack.match(/<anonymous>:(\d+):\d+/)
    if (!match) return null

    const userLine = parseInt(match[1], 10) - 1
    return userLine > 0 ? userLine : null
}
  
export function formatError(err) {
    const lineNumber = extractLineNumber(err)
    if (lineNumber !== null) {
        return `${err.message} (line ${lineNumber})`
    }
    return err.message
}