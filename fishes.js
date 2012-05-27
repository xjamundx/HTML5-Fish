// constants
var DOWN = 40;
var RIGHT = 39;
var UP = 38;
var LEFT = 37;
var PAUSE = 80; // p
var STOP = 192; // esc
var NUM_FISHES = 50;
var FPS = 100;

// variables
var $fps = $("#fps");
var $time = $("#time");
var $canvas = $("#canvas");
var $menu = $("#menu");
var $name = $("#name");
var $score = $("#score");
var $gameOver = $("#gameOver");
var $links = $menu.find("a");
var $body = $("body");
var $scoreList = $("#scoreList");
var canvas = $canvas.get(0);
var ctx = canvas.getContext('2d');
var	height = canvas.height;
var	width = canvas.width;
var actors = [];
var fishes = [];
var smasher;
var score = 0;
var intervalID = 0;
var intervalFPS = 0;
var ticks = 0;
var lastHash = "";
var time;
var store = window.localStorage || {};

function scoreBoard() {
  var sb = new ScoreBoard();
  var scores = sb.top10();
  $scoreList.empty();
  var html = "";
  for (var i = 0; i < scores.length; i++) {
    html += ScoreBoard.tmpl(scores[i]);
  }
  $scoreList.append(html);
}

function setupEvents() {

  var pos = $canvas.offset();
  var startX = pos.left;
  var startY = pos.top;
  
  $canvas.bind("touchmove", function(e) {
    var touch = e.originalEvent.targetTouches[0];
    sharky.x = touch.clientX;
    sharky.y = touch.clientY;
  });
  
  $canvas.bind("mousemove", function(evt) {
    var x, y;
    var e = evt.originalEvent;
    if (e.offsetX) {
        x = e.offsetX;
        y = e.offsetY;
    } else if (e.layerX) {
        x = e.layerX;
        y = e.layerY;
    }
    sharky.x = x;
    sharky.y = y;
  });

}

function reset() {
  actors = [];
  fishes = [];
  ticks = 0;
  score = 0;
  time = resetTime();
}

function resetTime() {
  var startTime = new Date().getTime();
  return function() {
    return new Date().getTime() - startTime;
  };
}

function startGame() {
  
  console.log("starting game");
  $gameOver.addClass("isHidden");
  reset();
  
	var fishStartY = height / 2;
	var fishStartX = width;
	
	// create a sea
	var thesea = new Sea(ctx, 0, 100, width, height, "blue", true);
	sharky = new Shark(ctx, 50, 250, 20, 100, "gray", 15, 25, 25, 25);
  actors = [sharky, thesea];

  // create a bunch of fishes
	for (var i = 0; i < NUM_FISHES; i++) {
    fishes.push(new Fish.createRandomFish(ctx, fishStartX + i * 13, fishStartY));
	}
	actors = actors.concat(fishes);
	
	// print and move them around
	intervalID = setInterval(drawScreen, 1000 / FPS);
	intervalFPS = setInterval(updateFps, 1000);
}

function updateFps() {
  $fps.text(ticks + " FPS ");  
  ticks = 0;
}

function calculateFps() {	
  ticks++;
}

function gameOver() {
  return score >= NUM_FISHES;
}

function drawAll() {
  for (var i = actors.length - 1; i > -1 ; i--) {
    if (actors[i].dead) continue;
    actors[i].draw();
  }
}

function clearScreen() {
	ctx.clearRect(0, 0, width, height);
}

function drawScreen() {
	calculateFps();
  clearScreen();
  drawAll();
	if (gameOver()) {
    return endGame();
  }
  $time.text(time() + "ms");
  updateFishes();
}

function updateFishes() {

	for (var i = 0; i < fishes.length; i++) {
    if (fishes[i].dead) continue;    
    fishes[i].tick();
    if (fishes[i].x < 0) {
      fishes[i].x = width;
    }

		// collission detection
		if (Smasher.detectCollision(fishes[i].detectBoundaries(), sharky.detectBoundaries())) {
			score++;
			$score.text(NUM_FISHES - score + " left!");
      fishes[i].kill();
		}
		
  }	

}

function endGame() {
  $gameOver.removeClass("isHidden");
  var sb = new ScoreBoard();
  clearInterval(intervalFPS);
  clearInterval(intervalID);
  sb.save(time(), name);
  $score.text("The End!");
}

function replay() {
  $gameOver.addClass("isHidden");
  location.hash = "play";
}

function start() {
  var hash = location.hash;
	var menuItems = {
	 "#play": startGame,
	 "#replay": replay,
	 "#scores": scoreBoard
	};

  if (lastHash === "#play") startGame();
  if (menuItems[hash]) menuItems[hash]();
}

setupEvents();
if (!location.hash) location.hash = "#menu";
$(window).bind("hashchange", start).trigger("hashchange");
