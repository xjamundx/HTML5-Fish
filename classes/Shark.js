function Shark(ctx, x, y, height, length, color, fin_width, fin_height, tail_length, tail_width) {
  this.ctx = ctx;
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
	this.count = 0;
}

Shark.prototype.tick = function() {
  this.count++;
  if (this.count === 16) {
  	this.mouth_open = !this.mouth_open;
  	this.count = 0;
  }
}				
	
Shark.prototype.detectBoundaries = function() {
	var boundaryX = this.x - this.height;
	var boundaryY = this.y - this.fin_height - this.height / 2;
	var boundaryWidth = this.tail_length + this.length *3;
	var boundaryHeight = this.fin_height + this.height;
	var boundary =  new CollissionBoundary(boundaryX, boundaryY, boundaryWidth, boundaryHeight);
	return boundary;
}
			
Shark.prototype.draw = function() {

	// setup
	this.ctx.fillStyle = this.color;

  this.drawBody();
  this.drawFins();
  this.drawMouth();

  // draw collision boundaries
	// this.detectBoundaries().draw();

	if  (this.mouth_open) {
		this.ctx.fillStyle = "blue";		
	} else {
    this.drawTeeth();	
	}
					
  this.drawEyes();
  	
	//	this.ctx.arc(this.x + this.length/2,this.y - this.length/4, this.length/10,10,Math.PI,true);
	this.ctx.fill();
	this.ctx.closePath();
}

Shark.prototype.drawFins = function() {
	// fins
	this.ctx.beginPath();
	this.ctx.moveTo(this.x, this.y);
	this.ctx.fillRect(this.x,this.y,10,10);
	this.ctx.lineTo(this.x, this.y + this.tail_width);
	this.ctx.lineTo(this.x, this.y - this.tail_width);
	this.ctx.lineTo(this.x + this.length * 1.5,this.y);
	this.ctx.lineTo(this.x, this.y + this.tail_width);
	this.ctx.fill();
	
	// top fin
	this.ctx.beginPath();
	this.ctx.moveTo(this.x + this.length + this.fin_width ,this.y - this.height  + 10);
	this.ctx.lineTo(this.x + this.length * 2, this.y - this.height - this.fin_height);
	this.ctx.lineTo(this.x + this.length * 2.75, this.y - this.fin_height - this.height / 2 + 25);
	this.ctx.fill();
}

Shark.prototype.drawMouth = function() {
	this.ctx.strokeStyle = "black";
	this.ctx.fillStyle = "blue";
	this.ctx.beginPath();
	this.ctx.moveTo(this.x + this.length * 3 - 10, this.y - 10);
	this.ctx.lineTo(this.x + this.length * 2.5, this.y);
	this.ctx.lineTo(this.x + this.length * 3 + 3, this.y);
	this.ctx.stroke();
	this.ctx.fill();
}

Shark.prototype.drawEyes = function() {
	this.ctx.fillStyle = "black";
	this.ctx.moveTo(this.x,this.y);
	this.ctx.beginPath();
	this.ctx.fillRect(this.length + this.tail_length + this.length + this.x, this.y - this.height / 3, 6, 6);
}

Shark.prototype.drawBody = function() {
	this.ctx.save();
  var skewX = this.length / this.height;
	this.ctx.beginPath();
	this.ctx.translate(this.x + this.length * 2, this.y);
	this.ctx.scale(skewX, 1);
	this.ctx.arc(0, 0, this.height, 0, Math.PI * 2, true);
	this.ctx.fill();
	this.ctx.restore();
}

Shark.prototype.drawTeeth = function() {
	this.ctx.beginPath();
	this.ctx.fillStyle = "white";
	for (var i = 5; i <= 40; i += 10) {
		this.ctx.moveTo(this.x  + this.length * 3 - i, this.y);										
		this.ctx.lineTo(this.x  + this.length * 3 - i + 12, this.y);
		this.ctx.lineTo(this.x  + this.length * 3 - i + 10, this.y - 5);
		this.ctx.lineTo(this.x  + this.length * 3 - i + 10, this.y - 10);
	
	}
	this.ctx.stroke();
	this.ctx.fill();
	this.ctx.closePath();
}	
			
Shark.prototype.wiggleTail = function(dx, dy) {
	this.tail_length += dx;
	this.tail_width += dy;
}

Shark.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
}
