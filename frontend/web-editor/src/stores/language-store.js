const i18next = require('i18next')
const i18nextBrowserLanguageDetector = require('i18next-browser-languagedetector')
// const i18nextHttpBackend = require('i18next-http-backend')

const languageResources = require('./text-elements.js')

const availableLanguages = ['ja', 'es', 'ar', 'id', 'pt-br'] // localizations available in repository at /hydra-synth/l10n
const languagePath = (lang) => `https://raw.githubusercontent.com/hydra-synth/l10n/main/${lang}/editor.json`

i18next
  // .use(i18nextHttpBackend)
  .use(i18nextBrowserLanguageDetector)
  .init({
    debug: true,
    fallbackLng: 'en',
    partialBundledLanguages: true,
    // backend: {
    //   loadPath: `${window.location.origin}/locales/{{lng}}.json`,
    //   crossDomain: true
    // },
    resources: languageResources
  })

module.exports = function store(state, emitter) {
  const languages = {}


  let searchParams = new URLSearchParams(window.location.search)
  let lang = searchParams.get('l10n-lang')

  //  if(!base64Code) base64Code = searchParams.get('id') // backwards compatibility with earlier form of naming. id is now called code
  let path = searchParams.get('l10n-url')

  availableLanguages.forEach((lang) => {
    loadLanguageFromURL(lang, languagePath(lang))
  })

  // console.log('%c', "color:purple", 'tttt', lang, path)

  if (lang !== null && path !== null) {
    loadLanguageFromURL(lang, path)
  }

  updateAvailableLanguages()

  emitter.on('set language', (lang) => {
    // console.log('setting language to', lang)
    i18next.changeLanguage(lang, (err, t) => {
      // console.log(err, t)
      state.translation.selectedLanguage = lang
      emitter.emit('render')
    })
  })

  function updateAvailableLanguages() {
    Object.keys(languageResources).forEach((key) => {
      // for some reason, 'pt-br' was not working, use just pt instead
      const k = key.split('-')[0]
      languages[k] = i18next.getFixedT(k)('language-name')
    })

    state.translation = {
      t: i18next.t,
      languages: languages,
      // languages: ['en', 'ja'],
      selectedLanguage: i18next.language
    }
  }
  // loadLanguageFromURL('es', 'https://raw.githubusercontent.com/hydra-synth/l10n/main/es/editor.json')
  //loadLanguageFromURL('es','https://hackmd.io/baEnGh7gRt2iHTvt-TT8Fw/download')
  function loadLanguageFromURL(lang = 'es', path) {
    const css = "color: purple; background: orange; font-size: 14px;padding:10px"
    console.log(`%cloading translation for ${lang} from ${path}`, css);
    fetch(path)
      .then(res => {
        if (!res.ok) {
          return res.text().then(text => { throw new Error(text) })
        }
        else {
          // console.log('returning json')
          return res.json();
        }
      }).then(json => {
        // console.log(json)
        window.i18n = i18next
        console.log('adding language', lang, json)

        // for some reason, 'pt-br' was not working, use just pt instead
        const k = lang.split('-')[0]
        i18next.addResourceBundle(k, 'translation', json)

        const languages = {}
        updateAvailableLanguages()
        emitter.emit('render')
      })
  }
  // const path = `${window.location.origin}/locales/es.json`


}