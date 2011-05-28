function Fish(x, y, radius, color, tail_length, tail_width) {
	
	this.radius = radius;
	this.color = color;
	this.x = x;
	this.y = y;
	this.tail_length = tail_length;
	this.tail_width = tail_width;			
}

Fish.UP = 10;
Fish.DOWN = 10;
Fish.LEFT = 4;
Fish.RIGHT = 4;

Fish.prototype.draw = function() {

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
				
Fish.prototype.detectBoundaries = function() {
	boundary_x = this.x - this.radius * 2;
	boundary_y = this.y - this.radius;
	boundary_width = this.tail_length + this.radius * 2;
	boundary_height = this.radius * 2;
	return new CollissionBoundary(boundary_x,boundary_y,boundary_width,boundary_height);
}
			
Fish.prototype.wiggleTail = function(dx,dy) {
	this.tail_length += dx;
	this.tail_width += dy;
}

Fish.prototype.move = function(x,y) {
	this.x+=x;
	this.y+=y;
}
