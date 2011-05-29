function Shark(x, y, height, length, color, fin_width, fin_height, tail_length, tail_width) {
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

Shark.prototype.everyTime = function() {
	this.mouth_open = !this.mouth_open;
}				
	
Shark.prototype.detectBoundaries = function() {
	boundary_x = this.x - this.height;
	boundary_y = this.y - this.fin_height - this.height / 2;
	boundary_width = this.tail_length + this.length *3;
	boundary_height = this.fin_height + this.height;
	boundary =  new CollissionBoundary(boundary_x,boundary_y,boundary_width,boundary_height);
	return boundary;
}
			
Shark.prototype.draw = function() {

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
	ctx.moveTo(this.x + this.length * 3- 10, this.y - 10);
	ctx.lineTo(this.x + this.length * 2.5, this.y);
	ctx.lineTo(this.x + this.length * 3 + 3, this.y );
	ctx.stroke();
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
		
		// tooth 4
		ctx.moveTo(this.x  + this.length * 3 - 20, this.y);										
		ctx.lineTo(this.x  + this.length * 3 - 32, this.y);
		ctx.lineTo(this.x  + this.length * 3 - 30, this.y - 5);					
		ctx.lineTo(this.x  + this.length * 3 - 30, this.y - 10);
		
		// tooth 5
		ctx.moveTo(this.x  + this.length * 3 - 30, this.y);										
		ctx.lineTo(this.x  + this.length * 3 - 42, this.y);
		ctx.lineTo(this.x  + this.length * 3 - 40, this.y - 5);					
		ctx.lineTo(this.x  + this.length * 3 - 40, this.y - 10);
		
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

			
Shark.prototype.wiggleTail = function(dx,dy) {
	this.tail_length += dx;
	this.tail_width += dy;
}

Shark.prototype.move = function(x,y) {
	this.x+=x;
	this.y+=y;
}