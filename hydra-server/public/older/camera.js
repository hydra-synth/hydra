var webcam
var parche

function setup() {
  
//crear el lienzo
  createCanvas(800, 640);
  noStroke()

  //definir el color de fondo
  background(0)
  colorMode(HSB)

  //seleccionar un color aleatoriamente
  fill(Math.random()*255, 255, 100, 255)

   //iniciar video desde la camera
  webcam = createCapture(VIDEO);
  webcam.size(640, 480)
  
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

  blendMode(BLEND)
 //si el video remoto existe, dibujarla en el lienzo
  if(parche.currMedia !== null){
   
    drawingContext.globalAlpha = 1.0
    drawingContext.drawImage(parche.currMedia, 10, 10, 780, 620);
    //drawingContext.drawImage(parche.currMedia, 0, 0, width, height);
  }

  blendMode(DIFFERENCE)

   //drawingContext.globalAlpha = 0.6
 // drawingContext.globalAlpha = 1.0
    image(webcam, 0, 0, width, height);
    rect(mouseX, mouseY, 300, 300);

}

