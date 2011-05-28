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
		var smasher;
		var startTime;
		
		// set some constants
		var quarter_count=1;
		var eighth_count=1;
		var score=0;
		var tail_dx = 2;
		var dsharky = 1;
		var	tail_dy = 2;
		var odd = true;
		var fps = 200;
		var fishes = [];
		var intervalID = 0;
		var start_i = 1;
		var diffTime=0;
		var frames=0;
		
		function init() {
			
			// grab the canvas context
			ctx = $("#canvas").get(0).getContext('2d');

			// stop the current timer
			clearInterval(intervalID);

			// re/set some variables
			// grab the current height and width
			height = $("#canvas").height();
			width = $("#canvas").width();
			x=-100;
			y=75;
			dx=29;
			count = 1;
			dy=15;
			start_y=150;
			start_x=width;
			
			// reset the canvas width
			$("#canvas").attr("height", height);
			$("#canvas").attr("width", width);

			// create a sea
			thesea = new sea(0,20,width,height,"blue",true);

			// create some fish			
			fish1 = new fish(start_x,     start_y,  20, "orange", 35, 23);
			fish2 = new fish(start_x+15,  start_y+30,  5, "red", 10, 6);
			fish3 = new fish(start_x+55,  start_y+15,  15, "white", 20, 15);
			fish4 = new fish(start_x+55,  start_y+10, 5, "yellow", 15, 13);
			fish5 = new fish(start_x+75,  start_y-10,  10, "cyan", 15, 15);
			fish6 = new fish(start_x+105, start_y+5,  10, "green", 5, 7);

			// create a bad guy
			sharky = new shark(25,125,10,50,"gray", 5, 15, 15, 15);

			// store them all in an array
			fishes = [fish1,fish2,fish3,fish4,fish5,fish6];

			// print and move them around
			intervalID = setInterval('drawScreen()', 1000 / fps);
			
			var date = new Date; // Generic JS date object
			startTime = date.getTime(); // Returns milliseconds since the epoch

			// var unixtime = parseInt(startTime / 1000);
			// alert(unixtime);
			
		}
		
		function countTime() {
			time  = new Date().getTime();
			diffTime += (time - startTime);
			frames++;
			if (diffTime >= 1000) {
				$("#fps").text("FPS: " + frames);
				frames = 0;
				diffTime = 0;
				startTime = time;
			}
			
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
			myx = dx/24;
									
			// draw the sea
			thesea.draw();
			
			// draw the shark
			sharky.draw();
			// sharky.detectBoundaries().draw()
			
			// get the timestamp
			time  = new Date().getTime();
			diffTime += (time - startTime);
			frames++;
			if (diffTime >= 1000) {
				// console.log(frames);
				$("#fps").text("FPS: " + frames);
				frames = 0;
				diffTime = 0;
				startTime = time;
			}
			
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
				fish = fishes[i];
				fish.dy = Math.cos(time/(60*60));
				if (fish.x < 0) {
					fishes[i].move(width,0);
				}
				if (fish.y < 0 || fish.y > height) {
					fish.dy = -fish.dy;
				}
				// console.log(fish.dy + " " + height + " " + fish.y);
				fish.move(-2,fish.dy);
				if (odd) {
					fish.wiggleTail(tail_dx,tail_dy);
				} else {
					fish.wiggleTail(-tail_dx, -tail_dy);				
				}
				// collission detection
				if (smasher.detectCollision(fish.detectBoundaries(),sharky.detectBoundaries())) {
					score++;
					$("#score").text("Death Toll: " + score);
					delete(fishes[i]);
					continue;
				}
				
				// draw the collission
				fish.draw();
			
				// fish.detectBoundaries().draw();
			}

			if (sharky.y>=height-5) {
				dsharky=-dsharky;
			} else if (sharky.y-sharky.fin_height<=height/5) {
				dsharky=-dsharky;
			}
			
			// sharky.move(0,dsharky);
			
		}
		
		var smasher = function() {};
		smasher.detectCollision = function(collissionBoundary1, collissionBoundary2) {
			// collissionBoundary1.draw();
			// collissionBoundary2.draw();
			if (
					(
						(collissionBoundary1.x + collissionBoundary1.width > collissionBoundary2.x)
					&&
						(collissionBoundary1.x < collissionBoundary2.x + collissionBoundary2.width)
					&&	
						(
							(
								(collissionBoundary1.y < collissionBoundary2.y + collissionBoundary2.height) 
							&&
								(collissionBoundary1.y > collissionBoundary2.y)
							)
						||
							(
								(collissionBoundary1.y  + collissionBoundary1.height < collissionBoundary2.y + collissionBoundary2.height) 
							&&
								(collissionBoundary1.y  + collissionBoundary1.height > collissionBoundary2.y)
							)
						)
					)
			) {
				return true;
			} else {
				return false;
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
			this.sea_y = y + this.wave_height * .9;
			this.odd = true;
		}
		
		sea.prototype.everyTime = function() {
			this.odd = !this.odd;
		};
		
		sea.prototype.draw = function () {
			if (!this.waves) {
				// console.log(start_i);
				if (this.odd) {
					start_i += 1.3;
				} else {			
					start_i -= 1.3;
				}
				ctx.fillStyle = "blue";
				ctx.strokeStyle = "blue";
				var wave_width = this.wave_width;
				for (i=start_i-100;i<=width+100;i+=this.wave_width) {
					ctx.beginPath();
					ctx.moveTo(i, this.y+10);
					ctx.bezierCurveTo(i, this.y+50, 100+i, this.y+50, i-50, this.y+50);
					ctx.fill();
					// ctx.stroke();
				}
			}
			ctx.fillStyle=this.color;
			ctx.fillRect(this.x,this.sea_y,this.width,this.height);
		};
			
		var collissionBoundary = function(x,y,width,height) {		
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			
		}

		collissionBoundary.prototype.draw = function() {
			ctx.fillStyle = "pink";
			ctx.fillRect(this.x,this.y,this.width,this.height);
		}

		var shark = function (x, y, height, length, color, fin_width, fin_height, tail_length, tail_width) {
			this.x = x;
			this.y = y;
			this.height = height;
			this.length = length;
			this.color = color;
			this.fin_width = fin_width;
			this.fin_height = fin_height;
			this.tail_length = tail_length;
			this.tail_width = tail_width;
			this.mouth_open = false;
		}


	
		shark.prototype.everyTime = function() {
			this.mouth_open = !this.mouth_open;
		}				
			
		shark.prototype.detectBoundaries = function() {
			boundary_x = this.x - this.height;
			boundary_y = this.y - this.fin_height - this.height / 2;
			boundary_width = this.tail_length + this.length *3;
			boundary_height = this.fin_height + this.height;
			boundary =  new collissionBoundary(boundary_x,boundary_y,boundary_width,boundary_height);
			return boundary;
		}
					
		shark.prototype.draw = function() {

			// setup
			ctx.fillStyle = this.color;
			ctx.save();
			ctx.scale(this.length/this.height,this.height/this.height);
			ctx.beginPath();
			ctx.moveTo(this.x,this.y);

			// body
			ctx.arc(this.x,this.y,this.height,10,Math.PI,true);
			ctx.fill();
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
			
			// top fin
			ctx.beginPath();
			ctx.moveTo(this.x+this.length+this.fin_width ,this.y - this.height  + 10);
			ctx.lineTo(this.x+this.length*2,this.y - this.height - this.fin_height);
			ctx.lineTo(this.x+this.length*2.75,this.y - this.fin_height - this.height / 2 + 25);
			ctx.fill();

			// mouth
			ctx.strokeStyle = "black";
			ctx.fillStyle = "blue";
			ctx.beginPath();
			ctx.moveTo(this.x + this.length * 3 - 10, this.y - 10);
			ctx.lineTo(this.x + this.length * 2.5, this.y);
			ctx.lineTo(this.x + this.length * 3 + 3, this.y );
			// ctx.stroke();
			ctx.fill();

			// this.detectBoundaries().draw();
			if  (this.mouth_open) {
			
				ctx.fillStyle = "blue";		
						
			} else {
			
				ctx.beginPath();
				ctx.fillStyle = "white";

				// tooth 1
				ctx.moveTo(this.x + this.length * 3, this.y);
				ctx.lineTo(this.x  + this.length * 3, this.y  - 10);					
				ctx.lineTo(this.x  + this.length * 3 - 5, this.y );
				ctx.lineTo(this.x  + this.length * 3, this.y );
				
				// tooth 2
				ctx.moveTo(this.x  + this.length * 3 - 05, this.y);										
				ctx.lineTo(this.x  + this.length * 3 - 12, this.y);
				ctx.lineTo(this.x  + this.length * 3 - 10, this.y - 5);					
				ctx.lineTo(this.x  + this.length * 3 - 10, this.y - 10);
				
				// tooth 3
				ctx.moveTo(this.x  + this.length * 3 - 10, this.y);										
				ctx.lineTo(this.x  + this.length * 3 - 22, this.y);
				ctx.lineTo(this.x  + this.length * 3 - 20, this.y - 5);					
				ctx.lineTo(this.x  + this.length * 3 - 20, this.y - 10);
				
				// draw it all
				ctx.stroke();
				ctx.fill();
			}
							
			// eyes
			ctx.fillStyle = "black";
			ctx.moveTo(this.x,this.y);
			ctx.beginPath();
			ctx.fillRect(this.length+this.tail_length+this.length+this.x,this.y-this.height/3,6,6);
			
			//	ctx.arc(this.x + this.length/2,this.y - this.length/4, this.length/10,10,Math.PI,true);
			ctx.fill();
		}
		
					
		shark.prototype.wiggleTail = function(dx,dy) {
			this.tail_length += dx;
			this.tail_width += dy;
		}
		
		shark.prototype.move = function(x,y) {
			this.x+=x;
			this.y+=y;
		}

		var fish = function(x, y, radius, color, tail_length, tail_width) {
			
			this.radius = radius;
			this.color = color;
			this.x = x;
			this.y = y;
			this.tail_length = tail_length;
			this.tail_width = tail_width;	
			this.dy = dy;
			this.dx = dx;
					
		}
		fish.UP = 10;
		fish.DOWN = 10;
		fish.LEFT = 4;
		fish.RIGHT = 4;
		
		fish.prototype.draw = function() {
		
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
						
		fish.prototype.detectBoundaries = function() {
			boundary_x = this.x - this.radius * 2;
			boundary_y = this.y - this.radius;
			boundary_width = this.tail_length + this.radius * 2;
			boundary_height = this.radius * 2;
			return new collissionBoundary(boundary_x,boundary_y,boundary_width,boundary_height);
		}
					
		fish.prototype.wiggleTail = function(dx,dy) {
			this.tail_length += dx;
			this.tail_width += dy;
		}
		
		fish.prototype.move = function(x,y) {
			this.x+=x;
			if (this.y+y > 0 && this.y+y < height) {
				this.y+=y;
			}
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

			init();			
			var click = false;

			$("#restart").click(function() {
				$(this).css({background:'#999'});
				window.location.reload();
				return false;
			});

			$("#canvas").mousedown(function(e) {
				e.preventDefault();
				click = true;
			});
			
			$("#canvas").mousemove(function(e) {
				e.preventDefault();
				if (click) { 
					sharky.y =  e.clientY;
				}
			});	

			$("#canvas").mouseup(function(e) {
				e.preventDefault();
				click = false;
				sharky.y =  e.layerY;
				return false;
			});

					
			$("#canvas").bind("touchmove", {}, function(e) {
				e.preventDefault();
				touch = window.event.targetTouches[ 0 ];
				sharky.y =  touch.clientY;
			});
			

		});

