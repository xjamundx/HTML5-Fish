function Sea(x, y, width, height, color, waves) {
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
};

Sea.prototype.draw = function () {
	if (this.waves) {
		// console.log(start_i);
		if (this.odd) {
			start_i += 4.3;
		} else {			
			start_i -= 4.3;
		}
		ctx.fillStyle = "blue";
		ctx.strokeStyle = "blue";
		var wave_width = this.wave_width;
		for (i=start_i-100;i<=width+100;i+=this.wave_width) {
			ctx.beginPath();
			ctx.moveTo(i, this.y+10);
			ctx.bezierCurveTo(i, this.y+50, 100+i, this.y+50, i-50, this.y+50);
			ctx.fill();
		}
	}
	ctx.fillStyle=this.color;
	ctx.fillRect(this.x, this.sea_y - 20, this.width, this.height);
};
