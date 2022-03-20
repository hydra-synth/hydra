const devtools = require('choo-devtools')
const choo = require('choo')
const store = require('./src/store.js')
const mainView = require('./src/views/main.js')

const app = choo()
app.use(devtools())
app.use(store)
app.route('/', mainView)
app.mount('body')



