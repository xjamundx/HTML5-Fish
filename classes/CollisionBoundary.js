function CollissionBoundary(x,y,width,height) {		
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
}

CollissionBoundary.prototype.draw = function() {
	ctx.fillStyle = "pink";
	ctx.fillRect(this.x,this.y,this.width,this.height);
}
