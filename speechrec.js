//This uses the speech recognition to listen for the elements as keywords. 
function ListenerForElements() {  
  if(elementRecognition.includes("fire") && !fireBool) {
    // console.log("Fire");
    currentElement = "fire";
    
    fireBool = true;
    airBool = false;
    waterBool = false;
    earthBool = false;
    
    WaterBase.stop();
    IceShard.stop();
    EarthWall.stop();
    EarthStones.stop();
    AirBase.stop();
    AirBall.stop();
  }
  
  else if(elementRecognition.includes("air") && !airBool) {
    // console.log("Air");
    currentElement = "air";
    
    fireBool = false;
    airBool = true;
    waterBool = false;
    earthBool = false;
    
    FireBase.stop();
    FireBlast.stop();
    WaterBase.stop();
    IceShard.stop();
    EarthWall.stop();
    EarthStones.stop();
  }
  
  else if(elementRecognition.includes("water") && !waterBool) {
    // console.log("Water");
    currentElement = "water";
    
    fireBool = false;
    airBool = false;
    waterBool = true;
    earthBool = false;
    
    FireBase.stop();
    FireBlast.stop();
    EarthWall.stop();
    EarthStones.stop();
    AirBase.stop();
    AirBall.stop();
  }
  
  else if(elementRecognition.includes("earth") && !earthBool) {
    // console.log("Earth");
    currentElement = "earth";
    
    fireBool = false;
    airBool = false;
    waterBool = false;
    earthBool = true;
    
    FireBase.stop();
    FireBlast.stop();
    WaterBase.stop();
    IceShard.stop();
    AirBase.stop();
    AirBall.stop();
  }
  
  else if(elementRecognition.includes("off")) {
    // console.log("Off");
    currentElement = "off";
    
    fireBool = false;
    airBool = false;
    waterBool = false;
    earthBool = false;
    
    FireBase.stop();
    FireBlast.stop();
    WaterBase.stop();
    IceShard.stop();
    EarthWall.stop();
    EarthStones.stop();
    AirBase.stop();
    AirBall.stop();
    
    fireBaseBool = true;
    fireBlastBool = true;
    waterBaseBool = true;
    iceShardBool = true;
    earthWallBool = true;
    earthStonesBool = true;
    airBaseBool = true;
    airBallBool = true;
  }
  
  if(!waterBool) {waterGate = true;}
  if(!earthBool) {earthGate = true;}
  HighlightImage(currentElement);
}

//This function operates on the index.html where it highlights the elements called out. 
function HighlightImage(keyword) {
  const images = document.querySelectorAll('.elementContainer img');

  images.forEach((img) => {
    const altText = img.alt;
    if (altText.includes(keyword)) {
      img.classList.add('active');
    } 
    
    else {
      img.classList.remove('active');
    }
  });
}

//Manual override for a button
function setupButton(buttonId, element) {
  document.getElementById(buttonId).addEventListener('click', function() {
    elementRecognition = element;
    ListenerForElements();
  });
}