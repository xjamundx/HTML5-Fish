function Fish(ctx, x, y, radius, color, tailLength, tailWidth) {
  this.ctx = ctx;
  this.radius = radius;
  this.color = color;
  this.x = x;
  this.y = y;
  // this is pixels per tick
  // should actually set
  // pixels per second
  this.velY = 15;
  this.velX = 15; 
  this.tailLength = tailLength;
  this.tailWidth = tailWidth;			
  this.ticks = 0;
  this.direction = 1;
}

Fish.createRandomFish = function(ctx, startX, startY) {
  var x = startX + (Math.random() - .5) * 350;
  var y = startY + (Math.random() - .5) * 350;
  var r = 5 + Math.floor(Math.random() * 50);
  var tl = Math.floor(25 + Math.random() * r);
  var tw  = Math.floor(30 + Math.random() * r * .9);
  return new Fish(ctx, x, y, r, Fish.generateRandomColor(), tl, tw);
}

Fish.generateRandomColor = function() {
  function c() {
    return Math.floor(Math.random() * 255);
  }
  var color = "rgb(" + c() + "," + c() + "," + c() + ")";
  return color;
}

Fish.UP = 10;
Fish.DOWN = 10;
Fish.LEFT = 4;
Fish.RIGHT = 4;

Fish.prototype.tick = function() {
  this.ticks += this.direction;
  if (this.ticks > 100 || this.ticks < 0) this.direction *= -1;
  this.move();
  if (this.dead) return;
  this.draw();
}

Fish.prototype.draw = function() {

	// setup
	this.ctx.beginPath();
	this.ctx.moveTo(this.x,this.y);
	this.ctx.fillStyle = this.color;

	// body
	this.ctx.arc(this.x, this.y, this.radius, 10, Math.PI, true);

	// fins
	this.ctx.moveTo(this.x+this.radius/2, this.y);
	this.ctx.lineTo(this.x+this.radius + this.tailLength,this.y + this.tailWidth);
	this.ctx.lineTo(this.x+this.radius + this.tailLength,this.y - this.tailWidth);
	this.ctx.fill();

  // tail
  this.wiggleTail();
		
	// eyes
	this.ctx.moveTo(this.x,this.y);
	this.ctx.beginPath();
	this.ctx.fillStyle = "black";
	this.ctx.arc(this.x - this.radius / 2, this.y - this.radius / 4, this.radius / 10, 10, Math.PI, true);
	this.ctx.fill();
  this.ctx.closePath();	
  
}

Fish.prototype.detectBoundaries = function() {
	var boundaryX = this.x - this.radius * 2;
	var boundaryY = this.y - this.radius;
	var boundaryWidth = this.tailLength + this.radius * 2;
	var boundaryHeight = this.radius * 2;
	return new CollissionBoundary(boundaryX, boundaryY, boundaryWidth, boundaryHeight);
}
			
Fish.prototype.wiggleTail = function() {
  var dx = Math.random() * 2.5;
  var dy = Math.random() * 2.5;
  var np = Math.random() - .5;
  np = np / Math.abs(np);
	this.tailLength += np * dx;
	this.tailWidth += np * dy;
}

Fish.prototype.move = function() {
	this.x -= this.velX * Math.random() + this.velX / 2;
	this.y += Math.cos(this.ticks * .5) * this.velY * Math.random();
}

Fish.prototype.kill = function() {
  this.dead = true;
}