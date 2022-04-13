const devtools = require('choo-devtools')
const choo = require('choo')
const store = require('./src/stores/store.js')
const languageStore = require('./src/stores/language-store.js')

const mainView = require('./src/views/main.js')

const app = choo()
app.use(devtools())
app.use(store)
app.use(languageStore)
app.route('/', mainView)
app.mount('body')



