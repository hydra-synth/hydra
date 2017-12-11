//
var parche;
var frame = 0

function setup() {
  
//crear el lienzo
  createCanvas(800, 640);
  noStroke()

  //definir el color de fondo
  background(0)
  colorMode(HSB)

  //seleccionar un color aleatoriamente
  fill(Math.random()*255, 255, 100, 255)

  
  //acceder el elemento DOM que tiene el lienzo (canvas) de P5
  var canvasStream = document.getElementById("defaultCanvas0").captureStream()

  //connectar a un PixelParche -- connexion p2p entre various usuarios. 
  // "Server" es la direccion del servidor para iniciar las conexiones.
  //"room" es la nombre de la sala o el canal
  //"stream" es la referencia al video o lienzo para compartir
  parche = new PixelParche({
    //server: "https://192.168.0.109:8000",  
    server: "https://pixel-parche.glitch.me/",
    room: "hiperconectadxs", 
    peerOptions: {
      stream: canvasStream 
    } 
  })
 
}

function draw() {
  frame++
  fill(255)
  //noFill()
  strokeWeight(10)
  stroke(255)
  blendMode(BLEND)
  background(255, 200, 0, 255)
  if(mouseIsPressed) {
    drawingContext.globalAlpha = 0.5
  } else {
    drawingContext.globalAlpha = 1.0
  }
 if(parche.currMedia !== null){
    drawingContext.drawImage(parche.currMedia, 0, 0, width, height);
  }
 blendMode(DIFFERENCE)
  // // acceder mas de un video remoto
  // var index = 0; //definir el indice del video para usar
  // if(swarm.remoteVids.length > index){
  //   drawingContext.drawImage(parche.currMedia, 0, 0, width, height);
  // }

   drawingContext.globalAlpha = 1.0
 
   for(var i = 0; i < 10; i++){
    //drawingContext.globalAlpha = 0.02
    push()
    translate(width/2, height/2)
    rotate(frame*0.002*i)
    rect(mouseX+i*80-width/2, mouseY-height/2, 100+mouseX, 10);
     pop()
  }

//   blendMode(MULTIPLY)
//   //si el teclado esta oprimido, pintar el fondo con un color aleatorio
  if(keyIsPressed){
    background(Math.random()*255, Math.random()*255, Math.random()*255)
  }
// //  blendMode(MULTIPLY)
//  //si el video remoto existe, dibujarla en el lienzo
//   if(parche.currMedia !== null){
//    //cambiar la transparencia de los objetos
//    // drawingContext.globalAlpha = 0.2
//    //drawingContext.drawImage(parche.currMedia, 10, 10, 780, 620);
//     drawingContext.drawImage(parche.currMedia, 0, 0, width, height);
   
//   }
}

