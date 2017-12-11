

var MediaContainer = function(stream, index, id, parent){
  this.index = index
  this.id = id

  var div = document.createElement('div');
  div.className = 'vid-container';
  div.style.width = "200px"
  div.style.height = "160px"
  div.style.margin = "0px"
  div.style.position = "relative"
  div.style.display = "inline-block"
  div.id = id

  var vid = document.createElement('video');
  vid.className = 'vid';
  vid.width = 200
  vid.height = 160
  vid.style.margin = "0px"
  vid.srcObject = stream
  vid.id = id
  vid.play()
  
  var label = document.createElement('h1');
  label.className = 'vid-label';
  label.style.width = "200px"
  label.style.height = "160px"
  label.style.position = "absolute"
  label.style.top = "0px"
  label.style.left = "0px"
  label.style.font = "bold 120px arial"
  label.style.color = "white"
  label.style.textAlign = "center"
  label.style.verticalAlign = "middle"
  label.style.lineHeight = "160px"
  label.style.margin = "0px"
  label.style.backgroundColor = "black"
  label.style.opacity = 0.0
  label.id = id
  label.innerHTML = index
  label.onmouseover = function(e){
    e.target.style.opacity = 0.3
  }
   label.onmouseout = function(e){
    e.target.style.opacity = 0.0
  }
  label.onclick = function(){
    parent.setSelected(this.index)
  }.bind(this)
  div.appendChild(vid)
  div.appendChild(label)

  this.div = div
  this.vid = vid
  this.label = label
}

MediaContainer.prototype.setIndex = function(index){
  this.index = index
  this.label.innerHTML = index
}


module.exports = MediaContainer


