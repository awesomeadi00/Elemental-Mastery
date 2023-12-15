//====================================MAIN SKECTH====================================
//Global Variables: 

// Speech Recognizer Settings
let speechRec;
let continuous = true;
let lang = navigator.language || 'en-US';
let recognitionTimeout = 20000; 
let lastSpeechTime;
let isRecognitionRunning = false;


//Element UI Settings
let elementRecognition = "off";
let currentElement = "off";
let airBool = false;
let waterBool = false;
let earthBool = false;
let fireBool = false;

//Handpose Settings: 
let handpose;
let video;
let hands = [];

let Hand1CenterX;
let Hand1CenterY;
let prevHand1CenterX = 320;
let prevHand1CenterY = 240;
let deltaHand1X;
let deltaHand1Y;
let speedHand1;
let directionHand1;

let Hand2CenterX;
let Hand2CenterY;
let prevHand2CenterX = 320;
let prevHand2CenterY = 240;
let deltaHand2X;
let deltaHand2Y;
let speedHand2;
let directionHand2;

let HandsDist;

//Sound Settings: 
let fireBaseBool = true;
let fireBlastBool = true;
let waterBaseBool = true;
let iceShardBool = true;
let earthWallBool = true;
let earthStonesBool = true;
let airBaseBool = true;
let airBallBool = true;

//=====================================SETUP=========================================
function preload() {
  handpose = ml5.handpose();
  
  soundFormats('mp3');
  FireBase = loadSound("Sounds/FireBase.mp3");
  FireBlast = loadSound("Sounds/FireBlast.mp3");
  WaterBase = loadSound("Sounds/WaterBase.mp3");
  IceShard = loadSound("Sounds/IceShard.mp3");
  EarthWall = loadSound("Sounds/EarthWall.mp3");
  EarthStones = loadSound("Sounds/EarthStones.mp3");
  AirBase = loadSound("Sounds/AirBase.mp3");
  AirBall = loadSound("Sounds/AirBall.mp3");
  console.log("Sounds Loaded!");
}

function setup() {
  createCanvas(640, 480);  
  noStroke();
  lastSpeechTime = millis(); 
  
  //Set up speech recognition settings
  speechRec = new p5.SpeechRec(lang, gotSpeech);
  speechRec.start(continuous);
  isRecognitionRunning = true; 

  // speechRec.start(continuous);
  console.log("Speech Recognizer Loaded!");
  
  //Start the video and handpose model
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  handpose.detectStart(video, gotHands);
  console.log("Handpose Model Loaded!");

  // Manually activate the buttons in case.
  setupButton('fireButton', 'fire');
  setupButton('airButton', 'air');
  setupButton('waterButton', 'water');
  setupButton('earthButton', 'earth');
}

//This function listens to the Speech Recognition and assigns it to elementRecognition for usage.
function gotSpeech() {
  if (speechRec.resultValue) {
    elementRecognition = speechRec.resultString.toLowerCase();
    lastSpeechTime = millis(); // Update the last speech time when speech is detected
    isRecognitionRunning = true; // Update recognition state
  } else {
    isRecognitionRunning = false; // Update recognition state
  }
}

//This retrieves handpose keypoint data
function gotHands(results) {
  hands = results;
  // console.log(hands);
}

//======================================DRAW=========================================
function draw() {
  
  if (millis() - lastSpeechTime > recognitionTimeout) {
    // Check if speech recognition is currently running before restarting it
    if (!isRecognitionRunning) {
      speechRec.start(continuous);
      isRecognitionRunning = true; // Update recognition state
      lastSpeechTime = millis(); // Update the last speech time
    }
  }
  
  background(220);
  image(video, 0, 0, width, height);
  ListenerForElements();
  getHandCoordinates();
  
  //Initate the bendings if they are activated
  if(fireBool) {FireBendingInitiate(); }
  if(waterBool) {WaterBendingInitiate(); }
  if(earthBool) {EarthBendingInitiate(); }
  if(airBool) {AirBendingInitiate(); }
  
  //Checking what the Speech Recognition says: 
  // console.log(elementRecognition);
}

//======================================HANDPOSE DATA=========================================
function drawKeyPoints() {
  for (let i = 0; i < hands.length; i++) {
    let hand = hands[i];
    for (let j = 0; j < hand.keypoints.length; j++) {
      let keypoint = hand.keypoints[j];
      fill(0, 255, 0);
      circle(keypoint.x, keypoint.y, 10);
    }
  }
}

function getHandCoordinates() {
  if (hands.length > 0 && hands.length < 2) {
    fill(0, 255, 0);

    let middle0 = hands[0].middle_finger_dip;
    let wrist0 = hands[0].wrist;

    Hand1CenterX = (middle0.x + wrist0.x)/2;
    Hand1CenterY = (middle0.y + wrist0.y)/2;
    
    //Calculating the speeds of one hand
    deltaHand1X = Hand1CenterX - prevHand1CenterX;
    deltaHand1Y = Hand1CenterY - prevHand1CenterY;
    speedHand1 = dist(0, 0, deltaHand1X, deltaHand1Y);
    directionHand1 = atan2(deltaHand1Y, deltaHand1X) * (180 / PI);
    
    circle(Hand1CenterX, Hand1CenterY, 10);
    
    //Update Hand Speed Positions
    prevHand1CenterX = Hand1CenterX;
    prevHand1CenterY = Hand1CenterY;
  }
  
  else if (hands.length > 1) {
    fill(0, 255, 0);

    let middle0 = hands[0].middle_finger_dip;
    let wrist0 = hands[0].wrist;
    let middle1 = hands[1].middle_finger_dip;
    let wrist1= hands[1].wrist; 

    Hand1CenterX = (middle0.x + wrist0.x)/2;
    Hand1CenterY = (middle0.y + wrist0.y)/2;
    Hand2CenterX = (middle1.x + wrist1.x)/2;
    Hand2CenterY = (middle1.y + wrist1.y)/2;
    
    //Calculating the speeds of each hand
    deltaHand1X = Hand1CenterX - prevHand1CenterX;
    deltaHand1Y = Hand1CenterY - prevHand1CenterY;
    speedHand1 = dist(0, 0, deltaHand1X, deltaHand1Y);  

    deltaHand2X = Hand2CenterX - prevHand2CenterX;
    deltaHand2Y = Hand2CenterY - prevHand2CenterY;
    speedHand2 = dist(0, 0, deltaHand2X, deltaHand2Y);
  
    // Calculating the direction of each hand
    directionHand1 = atan2(deltaHand1Y, deltaHand1X) * (180 / PI);
    directionHand2 = atan2(deltaHand2Y, deltaHand2X) * (180 / PI);
    
    circle(Hand1CenterX, Hand1CenterY, 10);
    circle(Hand2CenterX, Hand2CenterY, 10);
    
    //Getting the hands distance for anything useful
    HandsDist = dist(Hand1CenterX, Hand1CenterY, Hand2CenterX, Hand2CenterY);
    
    //Update Hand Speed Positions
    prevHand1CenterX = Hand1CenterX;
    prevHand1CenterY = Hand1CenterY;
    
    prevHand2CenterX = Hand2CenterX;
    prevHand2CenterY = Hand2CenterY;   
  }
}


//================================BENDING INITIATE FUNCTIONS===================================
//This function starts instantiating fire bending particles. 
function FireBendingInitiate() {
  
  // Base Firebending
  if (hands.length > 0) {
    if(fireBaseBool) {
      FireBase.play();
      FireBase.setVolume(0.2);
      FireBase.loop();
      fireBaseBool = false;
      fireBlastBool = true;
    }
    
    if (hands.length > 1) {
      fireParticles.push(new FireBending(Hand1CenterX, Hand1CenterY));
      fireParticles.push(new FireBending(Hand2CenterX, Hand2CenterY));
    } 
    
    else if (hands.length > 0 && hands.length < 2) {
      fireParticles.push(new FireBending(Hand1CenterX, Hand1CenterY));
      if (speedHand1 >= fireMoveSpeed) {
        fireMoveBool = true;
        currentMove1Direction = directionHand1;
      }
    }
  }
  
  else {
    FireBase.stop();
    fireBaseBool = true;
  }

  if (fireMoveBool) {
    FireBase.stop();
    if(fireBlastBool) {
      FireBlast.play();
      fireBlastBool = false;
    }
    
    fireMoveDelay--;

    if (fireMoveDelay <= 0) {
      fireMoveBool = false;
      fireMoveDelay = 120;
      fireBaseBool = true;
    }
  }

  for (let i = fireParticles.length - 1; i >= 0; i--) {
    fireParticles[i].update(fireMoveBool, currentMove1Direction);
    fireParticles[i].show();
    fireParticles[i].shrink();

    if (fireParticles[i].size <= 0) {
      fireParticles.splice(i, 1);
    }
  }
}

//This function starts instantiating water bending particles. 
function WaterBendingInitiate() {
  //Initiate the water particles
  if(waterGate) {
    for (let i = 0; i < 50; i++) {
  	  waterParticles.push(new WaterBending());
    }
    waterGate = false;
  }
  
  if(hands.length > 0) {    
    
    if(waterBaseBool) {
      WaterBase.play();
      WaterBase.setVolume(0.2);
      IceShard.setVolume(0.4);
      WaterBase.loop();
      waterBaseBool = false;
      iceShardBool = true;
    }
    
    if (speedHand1 >= waterMoveSpeed || speedHand2 >= waterMoveSpeed) {
      let randomIndex = floor(random(waterParticles.length));
      let particle = waterParticles[randomIndex];
      let waterMoveDirection = speedHand1 > speedHand2 ? directionHand1 : directionHand2;
      
      particle.turnToIceShard();
      particle.flyInDirection(waterMoveDirection);
      iceShardDuration = 120;
    }
    
    waterParticles.forEach(waterParticle => {  
      waterParticles.forEach(otherWaterParticle => {
          waterParticle.applyForce(waterParticle.interaction(otherWaterParticle));
      });
      
      waterParticle.attractToHands();
      waterParticle.show();
      waterParticle.update();
    }); 
  } 
  
  else {
    
    WaterBase.stop();
    waterBaseBool = true;
    
    waterParticles.forEach(waterParticle => {
      //If no hands are detected, then the waterparticles have default settings
      waterParticle.applyNeutral();

      waterParticles.forEach(otherWaterParticle => {
          waterParticle.applyForce(waterParticle.interaction(otherWaterParticle));
      });

      waterParticle.show();
      waterParticle.update();
    });
  }
  
  //Update Ice Shard
  if (iceShardDuration > 0) {
    iceShardDuration--;
  } 
  
  else {
    iceShardBool = true;
    waterParticles.forEach(particle => particle.resetIceShard());
  }
}

//This function starts instantiating earth bending particles. 
function EarthBendingInitiate() {
  //Create the ground
  if(earthGate) {
    for (let i = 0; i < groundDetail; i++) {
      ground[i] = height - 50 + random(-10, 10); // Randomize ground heights
    }
    earthGate = false;
  }
  
  fill(139, 69, 19); // Brown color
  beginShape();
  vertex(0, height);
  for (let i = 0; i < groundDetail; i++) {
    let x = (i / (groundDetail - 1)) * width;
    let y = ground[i];
    vertex(x, y);
  }
  vertex(width, height);
  endShape(CLOSE);
  
  
  //If there are hands in the screen
  if(hands.length > 0) {
    
    if(hand1EarthWall || hand2EarthWall) {
      if(earthWallBool) {
        EarthWall.play();
        EarthWall.setVolume(2);
        earthWallBool = false;
        earthStonesBool = true;
      }  
    }

    else {
      EarthWall.stop();
      earthWallBool = true;
    }
    
    //If there is only one hand then do the following: 
    if(hands.length > 0 && hands.length < 2) {
      if(Hand1CenterY < 150) {hand1EarthWall = true;}
      else {hand1EarthWall = false;}
      
      if(hand1EarthWall) {
        earthWallHand1.push(new EarthBending(Hand1CenterX, height - 50));
      }
      
      // Display and update earth particles
      for (let i = earthWallHand1.length - 1; i >= 0; i--) {
        earthWallHand1[i].moveUp(hand1EarthWall, false, 0.075);
        earthWallHand1[i].display();
        if(deltaHand1X > earthPushSpeed || deltaHand1X < -earthPushSpeed) {
          earthWallHand1[i].punchRocks(directionHand1); 
        }
      
        if(!hand1EarthWall) {
          earthWallHand1[i].applyGravity(); 
        }

        // Remove particles that are off-screen
        if (earthWallHand1[i].isOnGround()) {
          earthWallHand1[i].fade();
          if(earthWallHand1[i].finished()) {
            earthWallHand1.splice(i, 1);
          }
        }
      }
    }
    
    //If there are two hands or more do the following: 
    if(hands.length > 1) {
      
      //Checks to see if the hands are at the top
      if(Hand1CenterY < 150) {hand1EarthWall = true;}
      else {hand1EarthWall = false;}
      
      if(Hand2CenterY < 150) {hand2EarthWall = true;}
      else {hand2EarthWall = false;}
      
      
      //If the hands were at the top, then we would push some earth particles into the earth wall 
      if(hand1EarthWall) {
        earthWallHand1.push(new EarthBending(Hand1CenterX, height - 50));
        
        for (let i = earthWallHand1.length - 1; i >= 0; i--) {
          earthWallHand1[i].moveUp(hand1EarthWall, false, 0.025);
          earthWallHand1[i].display();
          if(deltaHand1X > earthPushSpeed || deltaHand1X < -earthPushSpeed) {
            earthWallHand1[i].punchRocks(directionHand1); 
          }
        }
      }
      
      else {
        for (let i = earthWallHand1.length - 1; i >= 0; i--) {
          earthWallHand1[i].applyGravity(); 
          if (earthWallHand1[i].isOnGround()) {
            earthWallHand1[i].fade();
            if(earthWallHand1[i].finished()) {
              earthWallHand1.splice(i, 1);
            }
          }
        }
      }
      
      if(hand2EarthWall) {
        earthWallHand2.push(new EarthBending(Hand2CenterX, height - 50));
        
        for (let i = earthWallHand2.length - 1; i >= 0; i--) {
          earthWallHand2[i].moveUp(hand1EarthWall, hand2EarthWall, 0.025);
          earthWallHand2[i].display();
          if(deltaHand2X > earthPushSpeed || deltaHand2X < -earthPushSpeed) {
            earthWallHand2[i].punchRocks(directionHand2); 
          }
        }
      }
      
      else {
        for (let i = earthWallHand2.length - 1; i >= 0; i--) {
          earthWallHand2[i].applyGravity(); 
          if (earthWallHand2[i].isOnGround()) {
            earthWallHand2[i].fade();
            if(earthWallHand2[i].finished()) {
              earthWallHand2.splice(i, 1);
            }
          }
        }
      } 
    }
    
    if(!hand1EarthWall) {
      for (let i = earthWallHand1.length - 1; i >= 0; i--) {
        earthWallHand1[i].display();
        earthWallHand1[i].applyGravity(); 
        if (earthWallHand1[i].isOnGround()) {
          earthWallHand1[i].fade();
          if(earthWallHand1[i].finished()) {
            earthWallHand1.splice(i, 1);
          }
        }
      }
    }
    
    if(!hand2EarthWall) {
      for (let i = earthWallHand2.length - 1; i >= 0; i--) {
        earthWallHand2[i].display();
        earthWallHand2[i].applyGravity(); 
        if (earthWallHand2[i].isOnGround()) {
          earthWallHand2[i].fade();
          if(earthWallHand2[i].finished()) {
            earthWallHand2.splice(i, 1);
          }
        }
      }
    }
  }
  
  //If there are no hands and there are still particles, make them fall and drop to the ground. 
  else {
    for (let i = earthWallHand1.length - 1; i >= 0; i--) {
      earthWallHand1[i].display();
      earthWallHand1[i].applyGravity(); 
      if (earthWallHand1[i].isOnGround()) {
        earthWallHand1[i].fade();
        if(earthWallHand1[i].finished()) {
          earthWallHand1.splice(i, 1);
        }
      }
    }
    
    for (let i = earthWallHand2.length - 1; i >= 0; i--) {
      earthWallHand2[i].display();
      earthWallHand2[i].applyGravity(); 
      if (earthWallHand2[i].isOnGround()) {
        earthWallHand2[i].fade();
        if(earthWallHand2[i].finished()) {
          earthWallHand2.splice(i, 1);
        }
      }
    }
  }
}


//This function starts instantiating air bending particles. 
function AirBendingInitiate() {
  if(hands.length > 0) {
    if(hands.length > 1) {
      let airballCenter = createVector((Hand1CenterX + Hand2CenterX)/2, (Hand1CenterY + Hand2CenterY)/2);
      airballParticles.push(new AirBending(airballCenter.x, airballCenter.y));
      airMoveBool = true;
    }
    
    else if(hands.length > 0 && hands.length < 2) {
      airParticles.push(new AirBending(Hand1CenterX, Hand1CenterY));
      airMoveBool = false;
      
      if(airBaseBool) {
        AirBase.play();
        AirBase.loop();
        airBaseBool = false;
        airBallBool = true;
      }
    }
    
    if (millis() - lastNoiseChange > noiseChangeInterval) {
      noiseSeed(millis());
      lastNoiseChange = millis();
    }
  
    for (let i = 0; i < airParticles.length; i++) {
      airParticles[i].update();
      airParticles[i].display();
      
      if(airParticles[i].onScreen == false) {
        airParticles.splice(i, 1);
      }
    }
    
    if(airMoveBool) {
      
      if(airBallBool) {
        AirBall.play();
        AirBall.loop();
        AirBall.setVolume(0.1);
        airBallBool = false;
      }
      
      for (let i = airballParticles.length - 1; i >= 0; i--) {
        airballParticles[i].concentrateAtCenter(Hand1CenterX, Hand2CenterX, Hand1CenterY, Hand2CenterY, HandsDist);
        airballParticles[i].display();
        airballParticles[i].fade();
        if (airballParticles[i].finished()) {
          airballParticles.splice(i, 1);
        }
      }
    }
    
    else {
      if(airballParticles.length != 0) {
        for(let i = airballParticles.length -1; i>= 0; i--){
          airballParticles[i].update();
          airballParticles[i].display();
          airballParticles[i].fade();
          if (airballParticles[i].finished()) {
            airballParticles.splice(i, 1);
          }
        }
      }
      
      AirBall.stop();
      airBallBool = true;
    }
  } 
  
  //In case there are still some particles but no hands, let them fade and disappear
  else {
    AirBase.stop();
    airBaseBool = true;
    
    if(airParticles.length != 0) {
      for(let i = airParticles.length -1; i>= 0; i--){
        airParticles[i].update();
        airParticles[i].display();
        airParticles[i].fade();
        if (airParticles[i].finished()) {
          airParticles.splice(i, 1);
        }
      }
    }
    
    if(airballParticles.length != 0) {
      for(let i = airballParticles.length -1; i>= 0; i--){
        airballParticles[i].update();
        airballParticles[i].display();
        airballParticles[i].fade();
        if (airballParticles[i].finished()) {
          airballParticles.splice(i, 1);
        }
      }
    }
  }
}