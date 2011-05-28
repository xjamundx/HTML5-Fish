		// declare some variables
		var ctx;
		var x;
		var y;
		var dx=1;
		var dy=1;
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
		var fps = 1000;
		var fishes = [];
		var intervalID = 0;
		var start_i = 1;
		var diffTime=0;
		var frames=0;

		// for the iphone			
		window.scrollTo(0,1);
		
		function init() {

			// stop the current timer
			clearInterval(intervalID);

			// re/set some variables
			// grab the current height and width
			x=-100;
			y=75;
			dx=29;
			dy=15;
			count = 1;
			start_y=50;
			start_x=400;
			
			// create a sea
			thesea = document.getElementById("stage");

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
			intervalID = setInterval('draw()', 1000 / fps);
			
			var date = new Date; // Generic JS date object
			startTime = date.getTime(); // Returns milliseconds since the epoch
			
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
		
		function draw() {

			quarter_count++;
			eighth_count++;
			if (eighth_count >= fps / 8) {
				eighth_count=1;
			}
			if (quarter_count >=  fps / 4) {
				quarter_count = 1;
				sharky.everyTime();
			} 
			
			// move things along, albeit slowly
			myx = dx/24;

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
				if (smasher.detectCollision(fish.detectBoundaries(),sharky.detectBoundaries())) {
					score++;
					$("#score").text("Death Toll: " + score);
					var transform = "translateY(-"+Math.floor(fishes[i].y)+1+"px)";
					fishes[i].el.style.webkitTransition = "-webkit-transform 10s ease-out";
					fishes[i].el.style.webkitTransform = transform;
					fishes[i].el.style.mozTransform = transform;
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
			this.x = 25;
			this.y = 25;
			this.height = height;
			this.length = length;
			this.color = color;
			this.fin_width = fin_width;
			this.fin_height = fin_height;
			this.tail_length = tail_length;
			this.rotate = 0;
			this.tail_width = tail_width;
			this.mouth_open = false;
			this.el = document.createElement("canvas");
			this.el.height=50;
			this.el.width=182;
						this.el.style.webkitTransition = "0s";

			this.ctx = this.el.getContext("2d");
			thesea.appendChild(this.el);

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
			/*
			this.rotate++;
			if (this.rotate > 360) {this.rotate = 0;}
			this.el.style.left = this.x;
			this.el.style.top = this.y;
			*/
			
			var transform = "translate3d("+this.x+"px,"+this.y+"px,0) rotate("+this.rotate+"deg)";
			this.el.style.webkitTransform = transform;

			
			// this.el.style.webkitTransform = "translate3D("+this.x+",0,0)";
			
			/*
			this.el.style.webkitTransition = "-webkit-transform .1s ease-out";

			if (this.rotate % 210 == 0) {
				var translate = "translateY("+this.y+")";
				// translate = " ";
				rotate = "rotate("+this.rotate+"deg)"
				var transform = translate + " " + rotate;
				this.el.style.webkitTransform = transform;
			}
			*/
	
			// setup
			this.ctx.clearRect(0,0,this.el.width,this.el.height);
			this.ctx.fillStyle = this.color;
			this.ctx.save();
			this.ctx.scale(this.length/this.height,this.height/this.height);
			this.ctx.beginPath();
			this.ctx.moveTo(25,25);

			// body
			this.ctx.arc(25,25,this.height,10,Math.PI,true);
			this.ctx.fill();
			this.ctx.restore();
			this.ctx.beginPath();

			// fins
			this.ctx.moveTo(25, 25);
			this.ctx.fillRect(25,25,10,10);
			this.ctx.lineTo(25, 25 + this.tail_width);
			this.ctx.lineTo(25, 25 - this.tail_width);
			this.ctx.lineTo(25 + this.length * 1.5,25);
			this.ctx.lineTo(25, 25 + this.tail_width);
			this.ctx.fill();
			
			// top fin
			this.ctx.beginPath();
			this.ctx.moveTo(25+this.length+this.fin_width ,25 - this.height  + 10);
			this.ctx.lineTo(25+this.length*2,25 - this.height - this.fin_height);
			this.ctx.lineTo(25+this.length*2.75,25 - this.fin_height - this.height / 2 + 25);
			this.ctx.fill();

			// mouth
			this.ctx.strokeStyle = "black";
			this.ctx.fillStyle = "blue";
			this.ctx.beginPath();
			this.ctx.moveTo(25 + this.length * 3 - 10, 25 - 10);
			this.ctx.lineTo(25 + this.length * 2.5, 25);
			this.ctx.lineTo(25 + this.length * 3 + 3, 25 );
			// ctx.stroke();
			this.ctx.fill();

			// this.detectBoundaries().draw();
			if  (this.mouth_open) {
			
				this.ctx.fillStyle = "blue";		
						
			} else {
			
				this.ctx.beginPath();
				this.ctx.fillStyle = "white";

				// tooth 1
				this.ctx.moveTo(25  + this.length * 3, 25);
				this.ctx.lineTo(25  + this.length * 3, 25  - 10);					
				this.ctx.lineTo(25  + this.length * 3 - 5, 25 );
				this.ctx.lineTo(25  + this.length * 3, 25 );
				
				// tooth 2
				this.ctx.moveTo(25  + this.length * 3 - 05, 25);										
				this.ctx.lineTo(25  + this.length * 3 - 12, 25);
				this.ctx.lineTo(25  + this.length * 3 - 10, 25 - 5);					
				this.ctx.lineTo(25  + this.length * 3 - 10, 25 - 10);
				
				// tooth 3
				this.ctx.moveTo(25  + this.length * 3 - 10, 25);										
				this.ctx.lineTo(25  + this.length * 3 - 22, 25);
				this.ctx.lineTo(25  + this.length * 3 - 20, 25 - 5);					
				this.ctx.lineTo(25  + this.length * 3 - 20, 25 - 10);
				
				// draw it all
				this.ctx.stroke();
				this.ctx.fill();
			}
							
			// eyes
			this.ctx.fillStyle = "black";
			this.ctx.moveTo(25,25);
			this.ctx.beginPath();
			this.ctx.fillRect(this.length+this.tail_length+this.length+25,25-this.height/3,6,6);
			
			//	ctx.arc(this.x + this.length/2,this.y - this.length/4, this.length/10,10,Math.PI,true);
			this.ctx.fill();
			
		}
		
					
		shark.prototype.wiggleTail = function(dx,dy) {
			this.tail_length += dx;
			this.tail_width += dy;
		}
		
		shark.prototype.move = function(x,y) {
			this.el.x=x;
			this.el.y=y;
		}

		var fish = function(x, y, radius, color, tail_length, tail_width) {
			
			this.radius = radius;
			this.color = color;
			this.x = x;
			this.y = y;
			this.width = 100;
			this.height = 50;
			this.tail_length = tail_length;
			this.tail_width = tail_width;	
			this.dy = dy;
			this.rotate = 0;
			this.dx = dx;
			this.el = document.createElement("canvas");
			this.el.width=this.width;
			this.el.style.top = 0;
			this.el.style.left = 0;
			this.el.height=this.height;
			this.el.style.webkitTransition = "0s";
			this.el.style.webkitTransition = "-webkit-transform 1s ease-out";
			this.ctx = this.el.getContext("2d");
			thesea.appendChild(this.el);
					
		}
		fish.UP = 10;
		fish.DOWN = 10;
		fish.LEFT = 4;
		fish.RIGHT = 4;
		
		fish.prototype.draw = function() {

			// show movement
			// this.el.style.left = this.x + "px";
			// this.el.style.top = this.y + "px";
			// var transform = "translate3d("+this.x+"px,"+this.y+"px,0) rotate("+this.rotate+"deg)";
			// this.el.style.webkitTransform = transform;
		
			if (!this.x || !this.y) return false;
		
			// setup
			this.ctx.clearRect(0,0,this.width,this.height);
			this.ctx.beginPath();
			this.ctx.moveTo(25,25);
			this.ctx.fillStyle = this.color;
	
			// body
			this.ctx.arc(25,25,this.radius,10,Math.PI,true);
			this.ctx.fill();
	
			// fins
			this.ctx.moveTo(25+this.radius/2,25);
			this.ctx.lineTo(25+this.radius + this.tail_length,25 + this.tail_width);
			this.ctx.lineTo(25+this.radius + this.tail_length,25 - this.tail_width);
			this.ctx.fill();
			
			// eyes
			this.ctx.moveTo(25,25);
			this.ctx.beginPath();
			this.ctx.fillStyle = "black";
			this.ctx.arc(25 - this.radius/2,25 - this.radius/4, this.radius/10,10,Math.PI,true);
			this.ctx.fill();
			
		}
		
		fish.prototype.everyTime = function() {
		}
						
		fish.prototype.detectBoundaries = function() {
			boundary_x = this.x - this.radius * 2;
			boundary_y = this.y - this.radius;
			boundary_width = this.tail_length + this.radius * 2;
			boundary_height = this.radius * 2;
			return new collissionBoundary(boundary_x,boundary_y,boundary_width,boundary_height);
		}
					
		fish.prototype.wiggleTail = function(dx,dy) {
			this.tail_length += 1;
			this.tail_width += 1;
		}
		
		fish.prototype.move = function() {

			this.transition = "";

			if (this.x > thesea.offsetWidth) {
				this.dx = -dx;
				// this.rotate = 0;
			} else if (this.x < 0) {
				this.dx = dx;
				this.x = thesea.offsetWidth;
				// this.rotate = 180;
			}
			
			

			if (this.y > height) {
				this.dy = -dy;
			} else if (this.y < 0){ 
				this.dy = dy;
			}

			if (this.y+y > 0 && this.y+y < height) {
				this.y+=y;
			}
			
			this.y += this.dy;
			this.x += this.dx;
			
			this.x = Math.floor(this.x);
			this.y = Math.floor(this.y);

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

			$("#stage").mousedown(function(e) {
				e.preventDefault();
				click = true;
			});
			
			$("#stage").mousemove(function(e) {
				e.preventDefault();
				if (click) { 
					sharky.y =  e.clientY;
				}
			});	
			
			$("#stage").click(function(e) {
				e.preventDefault();
			});

			$("canvas").click(function(e) {
				e.preventDefault();
			});

			$("#stage").mouseup(function(e) {
				e.preventDefault();
				click = false;
				return false;
			});

					
			$("#stage").bind("touchmove", {}, function(e) {
				e.preventDefault();
				touch = window.event.targetTouches[ 0 ];
				sharky.y =  touch.clientY;
			});
			

		});

