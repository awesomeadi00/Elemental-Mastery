//Fire element Variables: ===============================
let fireParticles = [];
let fireMoveBool = false;
let fireMoveSpeed = 275;
let fireMoveDelay = 120;
let currentMove1Direction;


//Water element Variables: ===============================
let waterParticles = [];
let waterGate = true;

let waterMoveSpeed = 175;
let waterMoveDirection;
let iceShardDuration = 120; 
let iceShardSpeed = 10;

//Physics Variables for the Water
let gravity = 0;
let dropSize = 50;
let repulsionForce = 0.1;
let friction = 0.9;
const attractionDistance = 2;
const attractionForce = 0.1;
const repulsionDistance = 1;
const maxVel = 7.5;
const maxForce = 1;

// Derived quantities from the above variables
const attractd2 = Math.pow(dropSize * attractionDistance, 2);
const repulsed2 = Math.pow(dropSize * repulsionDistance, 2);
const vel2 = Math.pow(maxVel, 2);
const force2 = Math.pow(maxForce, 2);


//Earth element Variables: ===============================
let earthGate = true;
let hand1EarthWall = false;
let hand2EarthWall = false;
let ground = [];
let groundDetail = 10; 
let earthPushSpeed = 100;

let rockFormed1 = false;
let rockFormed2 = false;
let earthWallHand1 = [];
let earthWallHand2 = [];
let earthRocks1 = [];
let earthRocks2 = [];



//Air element Variables: ===============================
let airParticles = [];
let airballParticles = [];
let lastNoiseChange = 0;
const noiseChangeInterval = 3000;
let airMoveBool = false;