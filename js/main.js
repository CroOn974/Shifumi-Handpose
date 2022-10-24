let handpose;
let video;
let canvas2;
let time = 5
let predictions = [];
let doigtPouceX, doigtPouceY,doigtPouceX2, doigtPouceY2 ,doigtIndexX, doigtIndexY, baseX, baseY, doigtMajeurX, doigtMajeurY, doigtOriX, doigtOriY, doigtAnuX, doigtAnuY;
let userSign = "neutre";
let aiSign = "neutre";
let tabChose = ["pierre","ciseaux","feuille"];
let inProgress = false;
let gameStarted = false
let canvas;
let btn_start;
let message;
let pierre;
let feuille;
let ciseaux;

function preload(){
  pierre = loadImage('img/pierre.png');
  feuille = loadImage('img/feuille.png');
  ciseaux = loadImage('img/ciseaux.png')

}

function pret() {
  font = loadFont('font/AlexBrush-Regular.ttf');
  btn = document.getElementById("start");
  btn.style.display = 'none';
  canvas.style.display = 'block';
  myCanvas = createCanvas(640, 480);
  canvas2 = createGraphics(width, height);
  canvas2.image
  video = createCapture(VIDEO);
  video.size(width,height);
  noFill();
  stroke(255);
  strokeWeight(3);
  textFont(font);
  colorMode(HSB, 360, 100, 100, 100);



  //charge le modele
  handpose = ml5.handpose(video, modelReady);

  handpose.on('predict', results => {
    predictions = results;
  });

  video.hide();
  gameStarted = true;

}

function modelReady(){
  console.log("Model ready!");
}

//fonction p5 s'actualise seul 60 fois par seconde
function draw(){
  if(gameStarted){

    image(video, 0, 0, width, height);
    image(canvas2, 0, 0);
    drawKeyPoints();
    
    //demare timer
    if(userSign == "ok" && inProgress === false){
      inProgress = true
      timer()
    }




  }else{
    canvas = document.getElementById("defaultCanvas0")
    canvas.style.display = 'none';
  }

}

//dessin
function drawKeyPoints(){
  for(let i = 0 ; i < predictions.length; i++){

    const prediction = predictions[i];

    for (let j = 0; j < prediction.landmarks.length; j++) {

      const keypoint = prediction.landmarks[j];
      fill(0, 255, 0);
      noStroke();
      textSize(12);
      text(str(j)+' '+str(i),keypoint[0],keypoint[1]+10)
      ellipse(keypoint[0], keypoint[1], 10, 10)

      //position du bout des doight
      if (j == 4){
          doigtPouceX = keypoint[0];
          doigtPouceY = keypoint[1];
      }else if(j == 3){
          doigtPouceX2 = keypoint[0];
          doigtPouceY2 = keypoint[1];
      }else if (j == 8) {
          doigtIndexX = keypoint[0];
          doigtIndexY = keypoint[1];
      } else if (j == 9) {
          baseX = keypoint[0];
          baseY = keypoint[1];
      } else if (j == 12) {
          doigtMajeurX = keypoint[0];
          doigtMajeurY = keypoint[1];
      } else if (j == 16) {
          doigtOriX = keypoint[0];
          doigtOriY = keypoint[1];
      } else if (j == 20) {
          doigtAnuX = keypoint[0];
          doigtAnuY = keypoint[1];
      }

    }

    //determine si c'est une pierre, une feuille ou un ciseaux
    if(doigtIndexY > baseY && doigtMajeurY > baseY && doigtOriY > baseY && doigtAnuY > baseY && doigtPouceY > baseY){

        console.log("pierre");
        userSign = "pierre";

    }else if(doigtIndexY < baseY && doigtMajeurY < baseY && doigtOriY > baseY && doigtAnuY > baseY && doigtPouceY > baseY){

        console.log("ciseaux");
        userSign = "ciseaux";

    }else if(doigtIndexY < baseY && doigtMajeurY < baseY && doigtOriY < baseY && doigtAnuY < baseY){

        console.log("feuille");
        userSign = "feuille";

    }else if(doigtPouceY < baseY && doigtIndexY > doigtPouceY && doigtMajeurY > doigtPouceY && doigtOriY > doigtPouceY && doigtAnuY > doigtPouceY  && baseY > doigtPouceY2){

        console.log("ok");
        userSign = "ok";

    }

  }

}

//compte à rebour
function timer(){
    
    var decompte = setInterval(function(){

      canvas2.clear();
      console.log(time);
      canvas2.textAlign(CENTER, CENTER);
      canvas2.textSize(100);
      canvas2.text(time, width/2, height/2);
      textNeon(time);
      time--

      if(time < 0){

        clearInterval(decompte);
        canvas2.clear();
        canvas2.text("GO", width/2, height/2);

        fight()

      }

    }, 1000);
    
}

function fight(){
  canvas2.clear();
  aiChose();
  console.log("le choix de l'ai est " + aiSign);

  imgChoce(aiSign,"ia");
  imgChoce(userSign,"user");


  let resultat;

  if(aiSign == userSign){

    console.log("egalité");
    resultat = "egalité";

  }else if(userSign == "ciseaux"){

    if(aiSign == "feuille"){
      console.log("user gagne");
      resultat = "user WIN";

    }else{
      console.log("ai gagne");
      resultat = "IA WIN";
    }

  }else if(userSign == "pierre"){

    if(aiSign == "ciseaux"){
      console.log("user gagne");
      resultat = "user WIN";

    }else{
      console.log("ai gagne");
      resultat = "IA WIN";

    }

  }else if(userSign == "feuille"){

    if(aiSign == "pierre"){
      console.log("user gagne");
      resultat = "user WIN";

    }else{
      console.log("IA gagne");
      resultat = "IA WIN";
    } 
  }else{
    console.log('ici');
  }

  textNeon(resultat);

  reset();
  
}

//determine le choix de l'AI
function aiChose(){
  aiSign = tabChose[getRandomInt(tabChose.length)];
}

//fonction qui retourne un nombre aléatoire
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

//reset timer
function reset(){

  inProgress = false;
  time = 5;

}

//affiche l'image selon le signe choisie
function imgChoce(signe,type){
  let posx;
  let posy;

  if(type == "user"){
    posx = 50;
    posy = 50;
  }else{
    console.log('img ia');
    console.log(canvas2.width);
    posx = canvas2.width - 50 - 200;
    posy = 50;
  }

  switch (signe) {
    case "pierre":
      canvas2.image(pierre,posx,posy,200,200);
      break;
    case "feuille":
      canvas2.image(feuille,posx,posy,200,200);
      break;
    case "ciseaux":
      canvas2.image(ciseaux,posx,posy,200,200);
      break;
    default:
      break;
  }



}

function textNeon(message){
  canvas2.fill(255, 255, 255);
  let glowColor = color(332,58,91,100);

  glow(glowColor,400);
  canvas2.text(message, width/2, height/2);
  canvas2.text(message, width/2, height/2);
  glow(glowColor,80);
  canvas2.text(message, width/2, height/2);
  canvas2.text(message, width/2, height/2);
  glow(glowColor,12);
  canvas2.text(message, width/2, height/2);
  canvas2.text(message, width/2, height/2);

}

function glow(glowColor, blurriness){
  drawingContext.shadowBlur = blurriness;
  drawingContext.shadowColor = glowColor;
}