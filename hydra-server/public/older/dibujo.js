//
var parche;

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
    server: "https://192.168.0.111:8000",  
    room: "hiperconectadxs", 
    peerOptions: {
      stream: canvasStream 
    } 
  })
 
}

function draw() {

  
  
  //si el teclado esta oprimido, pintar el fondo con un color aleatorio
  if(keyIsPressed){
    background(Math.random()*255, Math.random()*255, Math.random()*255)
  }

 //si el video remoto existe, dibujarla en el lienzo
  if(parche.currMedia !== null){
   //cambiar la transparencia de los objetos
   // drawingContext.globalAlpha = 0.9
    drawingContext.drawImage(parche.currMedia, 10, 10, 780, 620);
    //drawingContext.drawImage(parche.currMedia, 0, 0, width, height);
  }

  // // acceder mas de un video remoto
  // var index = 0; //definir el indice del video para usar
  // if(swarm.remoteVids.length > index){
  //   drawingContext.drawImage(swarm.remoteVids[index], 40, 40, 720, 560);
  // }

   drawingContext.globalAlpha = 1.0
 // drawingContext.globalAlpha = 1.0
  rect(mouseX, mouseY, 30, 30);

}

