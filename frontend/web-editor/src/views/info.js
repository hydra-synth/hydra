const html = require('choo/html')
const raw = require('choo/html/raw')
const toolbar = require('./toolbar.js')

const link = (url) => `href=${url} target=_blank`
module.exports = function mainView(state, emit) {
  const { t, languages } = state.translation
  const textDirection = state.translation.selectedLanguage  === 'ar' && state.showInfo === true ? 'rtl': 'ltr'

  const langArray = Object.entries(languages)
  return html`
<div id="info-container" class="${state.showInfo ? "" : "hidden"}" style="direction:${textDirection}">
  <div id="modal">
    <div id="modal-header" style="opacity:${state.showUI === true? 1: 0}">
      ${state.showInfo && langArray.length > 1 ? html`<div style="display:flex;flex-wrap:wrap">${langArray.map(([key, val]) => html`
        <div class="language-select" onclick=${() => emit('set language', key)}>${val}</div>
      `)}</div>` : html`<div></div>` }
      ${toolbar(state, emit)}
    </div>
    <div id="modal-body">
      <div id="modal-content">
        <h1>${t('info.title')}</h1>
        <h3>${t('info.subtitle')}</h3>
          <br> ///////////////////////////////////////////////////////////<br>
          <h4>${t('info.description')}</h4>
        <h4>${t('info.get-started-title')}<ol>
            <li>${t('info.get-started-list.0')}</li>
            <li>${t('info.get-started-list.1')}</li>
            <li>${t('info.get-started-list.2')}</li>
          </ol>
        </h4>

        <p> ///////////////////////////////////////////////////////////<br><br><br>
          ${t('info.description-detailed')}
        </p>
        <p>${t('info.uses')}<ul>
        ${t('info.uses-list', { returnObjects: true }).map((text) => html`<li>${text}</li>`)}
        </ul></p>
       
           <p class="align-right">${raw(t('info.author', { author: `href=https://ojack.xyz class=olivia target=_blank`}))}</p>
           <p>${raw(t('info.more-info', {
             docs: link("https://hydra.ojack.xyz/docs"),
             functions: link("https://hydra.ojack.xyz/api"),
             gallery: link("https://twitter.com/hydra_patterns"),
             repo: link("https://github.com/hydra-synth/hydra"),
             pixeljam: link("http://pixeljam.glitch.me/"),
             garden: link("https://hydra.ojack.xyz/garden"),
             'hydra-book': link("https://hydra-book.glitch.me/"),
             "tutorials": link("https://github.com/ojack/hydra/blob/master/examples/README.md")
           }))}</p>
          <p>${raw(t('info.more-info-forums', {
            discord: link("https://discord.gg/ZQjfHkNHXC"),
            facebook: link("https://www.facebook.com/groups/1084288351771117/")
          }))}</p>

        <p>${raw(t('info.support', {
          "open-collective": link("https://opencollective.com/hydra-synth")
        }))}</p>
      </div>
    </div>
  </div>
</div>
`
}


// <!---<p>${t('info.features')}<ul>
// ${t('info.features-list', { returnObjects: true }).map((text) => html`<li>${text}</li>`)}
// </ul></p>--->
// module.exports = function mainView(state, emit) {
//     return html`
//   <div id="info-container" class="${state.showInfo ? "" : "hidden"}">
//     <div id="modal">
//       <div id="modal-header" style="opacity:${state.showUI === true? 1: 0}">
//         <div><!--<i class="fas fa-bars icon"></i>--></div>
//         ${toolbar(state, emit)}
//       </div>
//       <div id="modal-body">
//         <div id="modal-content">
//           <h1> hydra</h1>
//           <h3> live coding networked visuals </h3>
//             <br> ///////////////////////////////////////////////////////////<br>
//             <h4> Hydra is a platform for live coding visuals, in which each connected browser window can be used as a node of a modular and distributed video synthesizer.</h4>
//           <h4> To get started: <ol>
//               <li>Close this window </li>
//                 <li>Change some numbers </li>
//                 <li>Type Ctrl + Shift + Enter </li>
//               </ol>
//           </h4>
  
//           <p> ///////////////////////////////////////////////////////////<br><br><br>Built using WebRTC (peer-to-peer web streaming) and WebGL, hydra allows each connected browser/device/person to output a video signal or stream, and receive and modify streams from other browsers/devices/people. The API is inspired by analog modular synthesis, in which multiple visual sources (oscillators, cameras, application windows, other connected windows) can be transformed, modulated, and composited via combining sequences of functions. </p>
//           <p>Features: <ul>
//           <li>Written in javascript and compatible with other javascript libraries</li>
//           <li>Available as a platform as well as a set of standalone modules </li>
//           <li>Cross-platform and requires no installation (runs in the browser)</li>
//           <li>Also available as a package for live coding from within atom text editor</li>
//           <li>Experimental and forever evolving !! </li>
//           </ul>
//             <p class="align-right"> Created by <a class="olivia" href="https://twitter.com/_ojack_" target="_blank">olivia.</a> </p>
//             <p> For more information and instructions, see:
//             <a href="https://github.com/ojack/hydra#Getting-Started" target="_blank">the documentation on github</a>,
//             <a href="https://ojack.xyz/hydra-functions/" target="_blank">a list of hydra functions</a>,
//             <!-- <a href="https://github.com/ojack/hydra/blob/master/docs/funcs.md" target="_blank">documentation</a>, -->
//             <a href="https://twitter.com/hydra_patterns" target="_blank">a gallery of user-generated sketches</a>,
//             <a href="http://pixeljam.glitch.me/" target="_blank">PIXELJAM collaborative editor</a>,
//             <a href="https://hydra-book.naotohieda.com/#/" target="_blank">Hydra Book</a>, and more <a href="https://github.com/ojack/hydra/blob/master/examples/README.md">tutorials and examples.</a></p>
//             <p>There is also an active <a href="https://discord.gg/ZQjfHkNHXC" target="_blank">Discord server</a> and <a href="https://www.facebook.com/groups/1084288351771117/" target="_blank">facebook group</a> for hydra users+contributors.</p>
  
//           <p> If you enjoy using Hydra, please consider  <a href="https://opencollective.com/hydra-synth" target="_blank">supporting continued development ${'<3 <3'} </a></p>
//         </div>
//       </div>
//     </div>
//   </div>
//  `
// }