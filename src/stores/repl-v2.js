import { formatError } from '../utils/error-utils.js'
import { parse } from 'acorn'

export default {
  eval: (arg, callback = () => {}) => {
    const info = {
      isError: false,
      codeString: '',
      errorMessage: ''
    }

    var jsString = `(async() => {
    ${arg}
})().catch(${(err) => { window._reportError(err) }})`
    try {
      // Try parsing first to catch syntax errors with accurate line numbers
      try {
        parse(arg, { ecmaVersion: 'latest', locations: true })
      } catch (syntaxErr) {
        console.log(syntaxErr)
        info.errorMessage = `${syntaxErr.message} (line ${syntaxErr.loc.line})`
        info.isError = true
        callback(info)
        return
      }
    
      window.eval(jsString)
    } catch (err) {
      info.errorMessage = formatError(err)
    }


    info.codeString = jsString
    if (info.errorMessage.length > 0) info.isError = true
    callback(info)
  }
}
