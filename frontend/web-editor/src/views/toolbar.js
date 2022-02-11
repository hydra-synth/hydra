const html = require('choo/html')

module.exports = function toolbar(state, emit) {
    const hidden = state.showInfo ? 'hidden' : ''
    console.log('hidden', hidden)
    return html` <div>
          <i id ="run-icon" class="fas fa-play-circle icon ${hidden}" title="Run all code (ctrl+shift+enter)" aria-hidden="true"></i>
          <i id="share-icon" title="upload to gallery" class=" ${hidden} fas fa-upload icon" aria-hidden="true"></i>
          <i id="clear-icon" title="clear all" class="${hidden} fa fa-trash icon" aria-hidden="true"></i>
          <i id="shuffle-icon" title="show random sketch" class="fas fa-random icon" aria-hidden="true"></i>
          <i id="mutator-icon" title="make random change" class="${hidden} fas fa-dice icon" aria-hidden="true"></i>
          <i id="close-icon" onclick=${toggleInfo} class="fas ${state.showInfo? "fa-times" : "fa-question-circle"} icon" aria-hidden="true"></i>
        </div>
 `
    function toggleInfo() {
        emit('toggle info')
    }
}