// constants
var DOWN = 40;
var RIGHT = 39;
var UP = 38;
var LEFT = 37;

// declare some variables
var ctx;
var x;
var y;
var dx;
var dy;
var start_y;
var start_x;
var height;
var width;
var thesea;
var fish1;
var fish2;
var fish3;
var fish4;
var fish5;
var fish6;
var quarter_count=1;
var eighth_count=1;
var smasher;

// set some constants
var score=0;
var tail_dx = 2;
var dsharky = 6;
var	tail_dy = 2;
var odd = true;
var fps = 100;
var fishes = [];
var intervalID = 0;
var start_i = 1;

function startGame() {
	
	// grab the canvas context
	ctx = document.getElementById("canvas").getContext('2d');

	// stop the current timer
	clearInterval(intervalID);

	// re/set some variables
	// grab the current height and width
	height = $("body").height();
	width = $("body").width();
	x=-100;
	y=75;
	dx=29;
	count = 1;
	dy=15;
	start_y=250;
	start_x=width;
	
	// create a sea
	thesea = new Sea(0,100,width,height,"blue",true);

	// create some fish			
	fish1 = new Fish(start_x,     start_y,     35, "orange", 65, 45);
	fish2 = new Fish(start_x+50,  start_y+85,  15, "red", 15, 15);
	fish3 = new Fish(start_x+175, start_y+35,  25, "white", 30, 30);
	fish4 = new Fish(start_x+135, start_y+100, 15, "yellow", 35, 25);
	fish5 = new Fish(start_x+225, start_y-70,  25, "cyan", 45, 30);
	fish6 = new Fish(start_x+325, start_y+75,  25, "green", 15, 15);

	// create a bad guy
	sharky = new Shark(50,250,20,100,"gray", 15, 25, 25, 25);

	// store them all in an array
	fishes = [fish1,fish2,fish3,fish4,fish5,fish6];

	// print and move them around
	intervalID = setInterval(drawScreen, 1000 / fps);
}


function drawScreen() {
	
	quarter_count++;
	eighth_count++;
	if (eighth_count >= fps / 8) {
		eighth_count=1;
	}
	if (quarter_count >=  fps / 4) {
		thesea.everyTime();
		quarter_count = 1;
		sharky.everyTime();
	} 
	
	// clear the screen
	ctx.clearRect(0,0,width,height);
	
	// move things along, albeit slowly
	myx = dx/11;
							
	// draw the sea
	thesea.draw();
	
	// draw the shark
	sharky.draw();
	// sharky.detectBoundaries().draw()
	
	// get the timestamp
	time  = new Date().getTime();
	
	// move, wiggle, and draw the fish
	// console.log(mydy + " " + time);
	odd = !odd;
	if (score >= fishes.length) {
		clearInterval(intervalID);
		$("#score").text("The End!");
		return;
	}

	for (var i in fishes) {
		m = ( (1/(i+1))*18 );
		time = time * m;
		mydy = Math.cos(time/(60*60));
		var fish = fishes[i];
		if (fish.x < 0) {
			fishes[i].move(width,0);
		}
		fish.move(-myx,mydy);
		if (odd) {
			fish.wiggleTail(tail_dx,tail_dy);
		} else {
			fish.wiggleTail(-tail_dx, -tail_dy);				
		}
		// collission detection
		if (Smasher.detectCollision(fish.detectBoundaries(),sharky.detectBoundaries())) {
			score++;
			$("#score").text("Death Toll: " + score);
			delete(fishes[i]);
			continue;
		}
		
		// draw the collission
		fish.draw();
	
		// fish.detectBoundaries().draw();
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

function moveFish(direction) {
	switch (direction) {
		case "down":
			for (var i in fishes) {
				fishes[i].move(0, fish.DOWN);
			}
		break;
		case "up":
			for (var i in fishes) {
				fishes[i].move(0, -fish.UP);
			}
		break;
		case "left":
			dx+=fish.LEFT;				
		break;
		case "right":
			dx-=fish.RIGHT;
		break;
	}
	return false;		
}

$(function() {
			
	// $("#restart").click(function() {
	//	window.location.reload();
	// });
	
	// $("input.joystick").click(function() {
	//	moveFish($(this).attr("title"));
	//});
		
	$(window).keydown(function(e) {
    var x = 0, y = 0;
    x = e.which === LEFT ? -1 : x;
    x = e.which === RIGHT ? 1 : x;
    y = e.which === UP ? -1 : y;
    y = e.which === DOWN ? 1 : y;
    sharky.move(x * 10, y * 10);
    e.preventDefault();
	})	
		
	$("#menu a").click(function(e) {
    e.preventDefault();
    $("#menu").addClass("hidden");
		startGame();			
	})
});

