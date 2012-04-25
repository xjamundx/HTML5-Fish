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
	this.seaY = y + this.wave_height * .9;
	this.odd = true;
  this.count = 0;
  this.startI = 1;
}

Sea.prototype.tick = function() {
  this.count++;
  if (this.count === 50) {
  	this.odd = !this.odd;
  	this.count = 0;
  }  
	this.startI += (this.odd ? -1 : 1) * 2.5;
}

Sea.prototype.draw = function () {
	this.ctx.fillStyle = this.color;
	this.ctx.fillRect(this.x, this.seaY - 20, this.width, this.height);
	if (this.waves) {
		// console.log(start_i);
		this.ctx.fillStyle = "blue";
		this.ctx.strokeStyle = "blue";
		var wave_width = this.wave_width;
		for (i = this.startI - 100; i <= width; i += this.wave_width) {
			this.ctx.beginPath();
			this.ctx.moveTo(i, this.y + 10);
			this.ctx.bezierCurveTo(i, this.y + 50, 100 + i, this.y + 50, i - 50, this.y + 50);
			this.ctx.fill();
			this.ctx.closePath();
		}
	}
}
