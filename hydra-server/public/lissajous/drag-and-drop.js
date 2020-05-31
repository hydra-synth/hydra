(function(){
  // inspired by/borrowed from http://jsfiddle.net/gaJyT/18/ -- thanks!

  var dragAndDrop = document.querySelector('.drag-and-drop');
  var dragging = false;

  function dragOver(e) {
    e.stopPropagation();
    e.preventDefault();
    if(!dragging) {
      //dragAndDrop.className += ' show'; //Rangel
      dragging = true;
    }
    return false;
  }

  function dragEnd(e) {
      e.stopPropagation();
      e.preventDefault();
      //dragAndDrop.className = dragAndDrop.className.replace(' show', ''); //Rangel
      dragging = false;
      return false;
  }

  function dropEvent(e) {
    e.stopPropagation();
    e.preventDefault();
    //dragAndDrop.className = dragAndDrop.className.replace(' show', ''); //Rangel
    dragging = false;

    var droppedFiles = e.dataTransfer.files;
    var readers = [];
    var filenames = [];

    droppedFiles = Array.prototype.slice.call(droppedFiles);
    droppedFiles.forEach(function(item, i){

      readers.push( new FileReader() );
      filenames.push( droppedFiles[i].name.replace('.wav', '') );

      readers[i].onload = function(fileEvent) {
        var data = fileEvent.target.result;
        context.decodeAudioData(data, function(buffer) {

          if(
            window[filenames[i]] !== undefined ||
            filenames[i] === 'undefined' ||
            filenames[i].match(/^(?:do|if|in|for|let|new|try|var|case|else|enum|eval|null|this|true|void|with|break|catch|class|const|false|super|throw|while|yield|delete|export|import|public|return|static|switch|typeof|default|extends|finally|package|private|continue|debugger|function|arguments|interface|protected|implements|instanceof)$/)
          ) {
            filenames[i] = 'sampleupload_' + (filenames[i] || (new Date()).getTime());
          }

          window[filenames[i]] = buffer;

          if(filenames[i].match(/\/|\-|\~|\%|\,|\.|\;|\:|\!|\@|\#|\^|\&|\*|\(|\)|\\|\ /)) {
            console.log('The AudioBuffer `window["' + filenames[i] + '"]` is ready for you to use.');
          } else {
            console.log('The AudioBuffer `' + filenames[i] + '` is ready for you to use.');
          }

        }, function(e) {
          console.log('There was an error decoding your file (make sure it\'s a .wav file!)');
          console.log(e);
        });
      }
      readers[i].readAsArrayBuffer(droppedFiles[i]);
    });
  }

window.addEventListener('dragover', dragOver, false);
window.addEventListener('dragend', dragEnd, false);
window.addEventListener('drop', dropEvent, false);
})();