// constants
var DOWN = 40;
var RIGHT = 39;
var UP = 38;
var LEFT = 37;
var PAUSE = 80; // p
var STOP = 192; // esc

// declare some variables
var x;
var y;
var dx;
var dy;
var startY;
var startX;
var height;
var width;
var thesea;
var fish1;
var fish2;
var fish3;
var fish4;
var fish5;
var fish6;
var smasher;
var i;
var count;
var myx;
var time;
var m;
var mydy;
var fish;
var hasStarted;

// set some constants
var score = 0;
var tail_dx = 2;
var dsharky = 6;
var	tail_dy = 2;
var odd = true;
var fps = 100;
var fishes = [];
var sharky;
var intervalID = 0;
var intervalFPS = 0;
var NUM_FISHES = 100;
var $fps = $("#fps");
var frames = 0;

// game stuff
var $canvas;
var $menu;
var $links;
var pos;
var fishStartX;
var fishStartY;
var $body;
var ctx;
var lastHash = "";
var paused = false;

function setupEvents() {

  	$canvas.mousemove(function(e) {
      sharky.x = e.clientX - startX;
      sharky.y = e.clientY - startY;
  	});
  		
  	$(window).keydown(function(e) {
      var x = 0;
      var y = 0;
      if (e.which === STOP) stopGame();
      if (e.which === PAUSE) handlePause();
      x = e.which === LEFT ? -1 : x;
      x = e.which === RIGHT ? 1 : x;
      y = e.which === UP ? -1 : y;
      y = e.which === DOWN ? 1 : y;
      sharky.move(x * 10, y * 10);
      e.preventDefault();
  	});	
}

function stopGame() {
 window.location.reload();
}

function handlePause() {
  if (!paused) return pauseGame();
  paused = false;
  startGame();
}


function pauseGame() {
  paused = true;
	clearInterval(intervalID);
}

function stopEvents() {
  $(window).unbind("keydown");
  $canvas.unbind("mousemove");
}

function startGame() {
  
  console.log("starting game");
  
  setupEvents();
  if (!paused) pauseGame();  
  
	// re/set some variables
	// grab the current height and width
	var canvas = $canvas.get(0);
	height = canvas.height;
	width = canvas.width;
	x =- 100;
	y = 75;
	dx = 29;
	count = 1;
	dy = 15;
	fishStartY = height/2;
	fishStartX = width;
	
	// create a sea
	thesea = new Sea(ctx, 0, 100, width, height, "blue", true);

  // create a bunch of fishes
	for (i = 0; i < NUM_FISHES; i++) {
 	 fishes.push(new Fish.createRandomFish(ctx, fishStartX + i * 13, fishStartY));	 
	}
	
	// create a bad guy
	sharky = new Shark(ctx, 50, 250, 20, 100, "gray", 15, 25, 25, 25);

	// print and move them around
	intervalID = setInterval(drawScreen, 1000 / fps);
	intervalFPS = setInterval(updateFps, 1000);
  paused = false;
}

function updateFps() {
  $fps.text(frames + " FPS ");  
  frames = 0;
}

function calculateFps() {	
  frames++;
}

function tick() {
  thesea.tick();
  sharky.tick();
}


function drawScreen() {
	
  tick();
	
	calculateFps();
	
	// clear the screen
	ctx.clearRect(0, 0, width, height);
	
	// move things along, albeit slowly
	myx = dx/6;
							
	// draw the sea
  thesea.draw();
	
	// draw the shark
	sharky.draw();
	// sharky.detectBoundaries().draw()
  
	// get the timestamp
	time = new Date().getTime();
	
	// move, wiggle, and draw the fish
	// console.log(mydy + " " + time);
	odd = !odd;
	if (score >= fishes.length) {
		return endGame()
	}
	
	for (i = 0; i < fishes.length; i++) {
    
    // get the next fish
		fish = fishes[i];

    // ignore dead fish
    if (fish.dead) continue;
    
		m = ((1/(i+1))*18);
		time = time * m;
		mydy = Math.cos(time/(60*60));
		if (fish.x < 0) fish.move(width, 0);
		fish.move(-myx, mydy);
		// if (odd) {
		//	fish.wiggleTail(tail_dx,tail_dy);
		// } else {
		//	fish.wiggleTail(-tail_dx, -tail_dy);				
		// }
		
		// collission detection
		if (Smasher.detectCollision(fish.detectBoundaries(), sharky.detectBoundaries())) {
			score++;
			$("#score").text("Death Toll: " + score);
      fish.kill();
			continue;
		}
		
		// draw the collission boundaries
		// fish.detectBoundaries().draw();

		fish.draw();
	
	}

  /*
	if (sharky.y>=height-50) {
		dsharky=-dsharky;
	} else if (sharky.y-sharky.fin_height<=height/5) {
		dsharky=-dsharky;
	}
	
	sharky.move(0,dsharky);
	*/
}

function endGame() {
	clearInterval(intervalFPS);
	clearInterval(intervalID);
	$("#score").text("The End!");
}

function stopGame() {
  stopEvents();
}

function setGlobals() {
  $canvas = $("#canvas");
  ctx = $canvas.get(0).getContext('2d');
  $menu = $("#menu");
  $links = $menu.find("a");
  hasStarted = false;
  pos = $canvas.offset();
  startX = pos.left;
  startY = pos.top;
  $body = $("body");
}

function start() {
  var hash = location.hash;
	var menuItems = {
	 "#play": startGame
	};

  setGlobals();
  
  if (lastHash === "#play") stopGame();
  if (menuItems[hash]) menuItems[hash]();
}

$(document).ready(function() {
  if (!location.hash) location.hash = "#menu";
	start(); 
  $(window).bind("hashchange", start);
});