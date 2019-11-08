module.exports = {
  init : () => {
    console.log('initing')
    window.onkeydown = (e) => {
        console.log('key down', e)
      if ( e.ctrlKey === true ) {
        if ( e.shiftKey === true ) {
          // shift - ctrl - enter: evalAll
          if ( e.keyCode === 13) {
            console.log('eval All')
          }
          // shift - ctrl - G: share sketch
          if (e.keyCode === 71) {
            console.log('share sketch')
          }
          // shift - ctrl - h: hide editor
          if (e.keyCode === 72) {
            console.log('hide editor')
          }
          // shift - ctrl - s: screencap
          if (e.keyCode === 83) {
            console.log('screencap')
          }
        } else {
          // ctrl-enter: evalLine
          if ( e.keyCode === 13) {
            console.log('eval line')
          }
        }
      }
      if (e.altKey === true) {
        // alt - enter: evalBlock
        if ( e.keyCode === 13) {
          console.log('eval Block')
        }
      }
    }
  }
}
