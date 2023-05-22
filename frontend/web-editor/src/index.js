import devtools from "choo-devtools";
import choo from "choo";
import store from "./stores/store.js";
import languageStore from "./stores/language-store.js";

import mainView from "./views/main.js";

const app = choo()
app.use(devtools())
app.use(store)
app.use(languageStore)
app.route('/', mainView)
app.mount('body')



