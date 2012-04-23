function Sea(ctx, x, y, width, height, color, waves) {
  this.ctx = ctx;
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

Sea.prototype.everyTime = function() {
	this.odd = !this.odd;
}

Sea.prototype.draw = function () {
	if (this.waves) {
		// console.log(start_i);
		if (this.odd) {
			start_i += 4.3;
		} else {			
			start_i -= 4.3;
		}
		this.ctx.fillStyle = "blue";
		this.ctx.strokeStyle = "blue";
		var wave_width = this.wave_width;
		for (i=start_i-100;i<=width+100;i+=this.wave_width) {
			this.ctx.beginPath();
			this.ctx.moveTo(i, this.y+10);
			this.ctx.bezierCurveTo(i, this.y+50, 100+i, this.y+50, i-50, this.y+50);
			this.ctx.fill();
		}
	}
	this.ctx.fillStyle=this.color;
	this.ctx.fillRect(this.x, this.sea_y - 20, this.width, this.height);
};
