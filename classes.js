//====================================CLASSES====================================

//====================================FIRE CLASS====================================
//This is a class which controls Fire Bending Particles
class FireBending {
  //Constructor to initialize the particle based on initial variables
  constructor(handX, handY) {
    this.x = handX;
    this.y = handY;
    this.size = random(30,50);
    this.alpha = 150;
    this.assignColor();
  }
  
  assignColor() {
    let r = random(3);
    if(r < 1){
      this.color = color(255,100,20, this.alpha); 
    } 
    
    else if(r >= 1 && r < 2){
      this.color = color(255, 200, 10, this.alpha); 
    } 
    
    else if(r >= 2){
      this.color = color(255, 80, 5, this.alpha); 
    }
  }
  
    
  shrink(){    
   this.size -= 0.5;
  }
  
  fade() {
    this.alpha -= 5;
  }

  //This function updates the velocities and alpha value of the particles
  update(fireMove1, direction) {
    
    let randomAngle = random(-60, 60);
    let adjustedDirection = direction + randomAngle;
    
    if(fireMove1) {
      let speed = 15; 
      this.x += cos(radians(adjustedDirection)) * speed;
      this.y += sin(radians(adjustedDirection)) * speed;
    }
    
    this.x += random(-7, 7);
    this.y += random(-1, -3);
  }

  //This function draws the particles
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

//====================================WATER CLASS====================================
//This is a class which controls Water Bending Particles
class WaterBending {
  constructor() {
    this.pos = createVector(random(width), height);
    this.vel = createVector(random(-1, 1), random(-1, 1));
    this.force = createVector(0, 0);
    this.colour = random(120, 180);
    this.iceBool = false;
  }    
  
  show() {
    if(this.iceBool) {
      fill(0, 255, 255, 200);
      push(); 
      translate(this.pos.x, this.pos.y);
      rotate(this.directionVector.heading() + HALF_PI); 
      ellipse(0, 0, random(40, 50), dropSize*2);
      pop(); 
    }
    
    else {
      fill(0, this.colour, 255, 200);
      ellipse(this.pos.x, this.pos.y, dropSize);
    }
  }
  
  update() {
    // Check if it's an ice shard
    if (this.iceBool) {
      
      let displacement = this.directionVector.mult(this.iceShardSpeed);
      this.pos.add(displacement);
      
      if (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height) {
        this.vel = createVector(0, 0);
        this.force = createVector(0, 0);
      }
      return; // Stop further updates for ice shards
    }

    // Regular water particle behavior
    if (this.force.magSq() >= force2) {
      this.force.setMag(maxForce);
    }

    this.vel.add(this.force);
    this.force = createVector(0, 0);

    if (this.vel.magSq() >= vel2) {
      this.vel.setMag(maxVel);
    }

    this.pos.add(this.vel);

    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
  }

  
  applyForce(f) {
    this.force.add(f);  
  }
  
  applyNeutral() {
    if(!this.iceBool) {
      gravity = createVector(0, random(9.8, 14));
      this.applyForce(gravity);
      friction = 1;
      repulsionForce = 0.4;
    }
  }
  
  interaction(drop) {
    if(!this.iceBool || drop.iceBool) {
      let displacement = p5.Vector.sub(drop.pos, this.pos);
      const d2 = displacement.magSq();

      if (d2 === 0 || d2 >= attractd2) {
          return createVector(0, 0);
      }

      displacement.normalize();
      if (d2 >= repulsed2) {
        return p5.Vector.mult(displacement, attractionForce);
      }

      return p5.Vector.mult(displacement, -repulsionForce);
    }
  }
  
  attractToHands() {
    if(!this.iceBool) {
      repulsionForce = 0.15;
      friction = 0.9;

      let HandsCenter1 = createVector(Hand1CenterX, Hand1CenterY);
      let HandsCenter2 = createVector(Hand2CenterX, Hand2CenterY);

      let displacement1 = p5.Vector.sub(HandsCenter1, this.pos);
      let displacement2 = p5.Vector.sub(HandsCenter2, this.pos);

      this.pos.add(displacement1.mult(random(0.001, 0.025)));
      this.pos.add(displacement2.mult(random(0.001, 0.025)));
    }
  }
  
  turnToIceShard() {
    this.iceBool = true;
    IceShard.play();
  }

  resetIceShard() {
    this.iceBool = false;
    iceShardBool = true;
  }
    
  flyInDirection(direction) {
    this.directionVector = createVector(cos(radians(direction)), sin(radians(direction)));
    this.iceShardSpeed = 1.2; // You can adjust the speed as needed
  }
}


//====================================EARTH CLASS====================================
//This is a class which controls Earth Bending Particles
class EarthBending {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, random(-5, -2)); // Move upwards
    this.size = random(30, 60);
    this.shapeDetail = floor(random(5, 10)); // Number of vertices in the rock shape
    this.angles = [];
    this.lengths = [];
    this.lifetime = 255; // Particle fade out effect

    // Generate random angles and lengths for the rock shape
    for (let i = 0; i < this.shapeDetail; i++) {
      this.angles[i] = map(i, 0, this.shapeDetail, 0, TWO_PI) + random(-PI / 4, PI / 4);
      this.lengths[i] = this.size + random(-5, 5);
    }
  }

  moveUp(hand1, hand2, upSpeed) {
    let coordinate1 = createVector(this.position.x, 100);
    let coordinate2 = createVector(this.position.x, 100);
    
    let displacement1 = p5.Vector.sub(coordinate1, this.position);
    let displacement2 = p5.Vector.sub(coordinate2, this.position);
    
    if(hand1) {
       this.position.add(displacement1.mult(upSpeed)); 
    }
    
    if(hand2) {
       this.position.add(displacement2.mult(upSpeed)); 
    }
  }

  display() {
    // Draw earth particle as a custom rock shape with transparency
    fill(139, 69, 19, this.lifetime);
    noStroke();
    beginShape();
    for (let i = 0; i < this.shapeDetail; i++) {
      let x = this.position.x + this.lengths[i] * cos(this.angles[i]);
      let y = this.position.y + this.lengths[i] * sin(this.angles[i]);
      vertex(x, y);
    }
    endShape(CLOSE);
  }
  
  applyGravity() {
    // Apply some gravity
    if(this.position.y < height - 50) {
      this.velocity.y += 0.1;
      this.velocity.x += random(-0.1, 0.1);
      this.position.add(this.velocity); 
    }
  }
  
  isOnGround() {
    return (this.position.y >= height-50);
  }
  
  fade() {
    // Fade out effect
    this.lifetime -= 4;
  }
  
  finished() {
    return (this.lifetime <= 0);
  }
  
  punchRocks(direction) {
    let speed = 10;
    if(this.position.y < height-50) {
       this.velocity.x += cos(radians(direction)) * speed;
    }
  
    if(earthStonesBool) {
        EarthStones.play();
        earthStonesBool = false;
    }
  }
}


//====================================AIR CLASS====================================
class AirBending {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.initialHandXPos = x;
    this.size = 30; 
    this.speed = random(3, 7);
    this.noiseScale = 0.01 / 2;
    this.alpha = 200;
  }

  update(hand1X, hand2X) {
    let n = noise(this.position.x * this.noiseScale, this.position.y * this.noiseScale, frameCount * this.noiseScale * this.noiseScale);
    let a = TAU * n;
    
    if (this.initialHandXPos < width / 2 ) {
      a += PI; // Flow to the right
    }
    
    this.position.x += this.speed * cos(a);
    this.position.y += this.speed * sin(a);
  }

  display() {
    fill(random(200, 255), random(200, 255), random(200, 255), this.alpha);
    ellipse(this.position.x, this.position.y, this.size, this.size);
  }

  onScreen() {
    return (
      this.position.x >= 0 &&
      this.position.x <= width &&
      this.position.y >= 0 &&
      this.position.y <= height
    );
  }
  
  fade() {
    this.alpha -= 2;
  }
  
  finished() {
    return (this.alpha <= 0);
  }
  
  concentrateAtCenter(hand1X, hand2X, hand1Y, hand2Y, handDist) {
    // Concentrate at the center of hands
    let center = createVector((hand1X + hand2X) / 2, (hand1Y + hand2Y)/ 2);
    let dir = p5.Vector.sub(center, this.position);
    dir.normalize();

    // Circular motion around the center with radius based on hand distance
    let angle = atan2(dir.y, dir.x);
    angle += frameCount * 0.02; // Adjust the speed of rotation
    let radius = map(handDist, 0, width, 50, 200); // Adjust the radius based on hand distance

    let driftFactor = 0.3; // Adjust the speed of drifting
    this.position.x = lerp(this.position.x, center.x + radius * cos(angle), driftFactor);
    this.position.y = lerp(this.position.y, center.y + radius * sin(angle), driftFactor);
  }
}
