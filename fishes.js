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

// set some constants
var tail_dx = 2;
var	tail_dy = 2;
var odd = true;
var fps = 100;
var fishes = [];
var intervalID = 0;

$(function() {
	// grab the canvas context
	ctx = $("#canvas").get(0).getContext('2d');
	init();	
	$("#restart").click(function() {
		init();
	});
});

function init() {
	
	// stop the current timer
	clearInterval(intervalID);

	// re/set some variables
	// grab the current height and width
	height = $("body").height();
	width = $("body").width();
	x=-100;
	y=75;
	dx=29;
	dy=15;
	start_y=250;
	start_x=width;

	// reset the canvas width
	$("#canvas").attr("height", height);
	$("#canvas").attr("width", width);

	// create a sea
	thesea = new sea(0,0,width,height,"blue",true);

	// create some fish			
	fish1 = new fish(start_x,     start_y,     35, "orange", 65, 45);
	fish2 = new fish(start_x+50,  start_y+85,  15, "red", 15, 15);
	fish3 = new fish(start_x+175, start_y+35,  25, "white", 30, 30);
	fish4 = new fish(start_x+135, start_y+100, 15, "yellow", 35, 25);
	fish5 = new fish(start_x+225, start_y-70,  25, "cyan", 45, 30);
	fish6 = new fish(start_x+325, start_y+75,  25, "green", 15, 15);

	// sharky = new shark(50,50,20,100,"gray",15,30, 25, 25);
	// sharky.draw();

	// store them all in an array
	fishes = [fish1,fish2,fish3,fish4,fish5,fish6];
		
	// print and move them around
	intervalID = setInterval('drawScreen()', 1000 / fps);
}


function drawScreen() {
	
	// clear the screen
	ctx.clearRect(0,0,width,height);
	
	// move things along, albeit slowly
	myx = dx/11;
							
	// draw the sea
	thesea.draw();
	
	// get the timestamp
	time  = new Date().getTime();
	
	// move, wiggle, and draw the fish
	// console.log(mydy + " " + time);
	odd = !odd;
	for (var i in fishes) {
		m = ( (1/(i+1))*18 );
		time = time * m;
		mydy = Math.cos(time/(60*60));
		// console.log(i + ": " + time + " = " + mydy + " [ " + m);
		var fish = fishes[i];
		fish.move(-myx,mydy);
		if (odd) {
			fish.wiggleTail(tail_dx,tail_dy);
		} else {
			fish.wiggleTail(-tail_dx, -tail_dy);				
		}
		fish.draw();
	}
	
}

var sea = function (x,y,width,height,color,waves) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.color = color;
	this.waves = waves;
	this.wave_height = this.height*.1;
	this.wave_width = this.height*.1;
	this.sea_y = y + this.wave_height;
	
	this.draw = function () {
		if (this.waves) {
			for (i=0;i<21;i++) {
			 	this.drawWaves(i);
			}
		}
		ctx.fillStyle=this.color;
		ctx.fillRect(this.x,this.sea_y,this.width,this.height);
	}
	
	this.drawWaves = function() {
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "white";
		ctx.beginPath();
		ctx.arc(this.wave_width*i*1.5, this.sea_y, this.wave_height, 0, Math.PI, true);
		ctx.fill();
		ctx.stroke();
	}
}
		
var shark = function (x,y,height,length,color,fin_width, fin_height, tail_length, tail_width) {
	this.x = x;
	this.y = y;
	this.height = height;
	this.length = length;
	this.color = color;
	this.fin_width = fin_width;
	this.fin_height = fin_height;
	this.tail_length = tail_length;
	this.tail_width = tail_width;
	
	this.draw = function() {
		/*
		ctx.save();
		ctx.scale(0.75, 1);
		ctx.beginPath();
		ctx.arc(20, 21, 10, 0, Math.PI*2, false);
		ctx.stroke();
		ctx.closePath();
		ctx.restore();
		*/
		
		// setup
		ctx.fillStyle = this.color;
		ctx.save();
		ctx.scale(this.length/this.height,this.height/this.height);
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);

		// body
		ctx.arc(this.x,this.y,this.height,10,Math.PI,true);
		ctx.fill();
		ctx.beginPath();
		ctx.closePath();
		ctx.restore();
		ctx.beginPath();

		// fins
		ctx.moveTo(this.x, this.y);
		ctx.fillRect(this.x,this.y,10,10);
		ctx.lineTo(this.x, this.y + this.tail_width);
		ctx.lineTo(this.x, this.y - this.tail_width);
		ctx.lineTo(this.x + this.length * 1.5,this.y);
		ctx.lineTo(this.x, this.y + this.tail_width);
		ctx.fill();
		
		// fins
		ctx.fillStyle = "purple";
		ctx.moveTo(this.x+this.length+this.fin_width + this.length/2,this.y-this.height);
		// ctx.fillRect(this.x+this.length+this.fin_width + this.length/2,this.y-this.height,10,10);
		ctx.lineTo(this.x, this.y + this.tail_width);
		ctx.lineTo(this.x, this.y - this.tail_width);
		ctx.lineTo(this.x + this.length * 1.5,this.y);
		ctx.lineTo(this.x, this.y + this.tail_width);
		ctx.fill();
		
		// eyes
		ctx.moveTo(this.x,this.y);
		ctx.beginPath();
		ctx.fillStyle = "black";
		ctx.arc(this.x + this.length/2,this.y - this.length/4, this.length/10,10,Math.PI,true);
		ctx.fill();
	}
}


var fish = function(x, y, radius, color, tail_length, tail_width) {
	
	this.radius = radius;
	this.color = color;
	this.x = x;
	this.y = y;
	this.tail_length = tail_length;
	this.tail_width = tail_width;
	
	this.draw = function() {
		
		// setup
		ctx.beginPath();
		ctx.moveTo(this.x,this.y);
		ctx.fillStyle = this.color;

		// body
		ctx.arc(this.x,this.y,this.radius,10,Math.PI,true);

		// fins
		ctx.moveTo(this.x+this.radius/2,this.y);
		ctx.lineTo(this.x+this.radius + this.tail_length,this.y + this.tail_width);
		ctx.lineTo(this.x+this.radius + this.tail_length,this.y - this.tail_width);
		ctx.fill();
		
		// eyes
		ctx.moveTo(this.x,this.y);
		ctx.beginPath();
		ctx.fillStyle = "black";
		ctx.arc(this.x - this.radius/2,this.y - this.radius/4, this.radius/10,10,Math.PI,true);
		ctx.fill();
		
	}
	
	this.wiggleTail = function(dx,dy) {
		this.tail_length += dx;
		this.tail_width += dy;
	}
	
	this.move = function(x,y) {
		this.x+=x;
		this.y+=y;
	}
}