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
var lastTime = Date.now();
var actors = [];
var fishes = [];
var smasher;
var score = 0;
var ticks = 0;
var lastHash = "";
var time;
var store = window.localStorage || {};
var paused = false;

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
	drawScreen();
}

function calculateFps() {	
  var diff = Date.now() - lastTime;
  ticks++;
  if (diff > 1000) {
    lastTime = Date.now();
    console.log(ticks, diff);
    $fps.text(ticks + " FPS ");
    ticks = 0;
  }
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
  if (paused) return;
	calculateFps();
  clearScreen();
  drawAll();
	if (gameOver()) {
    return endGame();
  }
  $time.text(time() + "ms");
  updateFishes();
  requestAnimationFrame(drawScreen);
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
  paused = true;
  sb.save(time(), name);
  $fps.text("0 FPS");
  $score.text("The End!");
}

function replay() {
  $gameOver.addClass("isHidden");
  location.hash = "play";
  paused = false;
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

// requestAnimationFrame polyfill
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

setupEvents();
if (!location.hash) location.hash = "#menu";
$(window).bind("hashchange", start).trigger("hashchange");
