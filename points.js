/*
	@Author: Ashish Kushwaha (AshishKingdom)
*/

class Points {
	constructor() {
		this.x = random(canvasWidth);
		this.y = random(canvasHeight);
		this.xv = random(-2,2);
		this.yv = random(-2,2);
	}
	checkBoundaries() {
		if(this.x>canvasWidth||this.x<0||this.y>canvasHeight||this.y<0){
			this.x = random(canvasWidth);
			this.y = random(canvasHeight);
			this.xv = random(-2,2);
			this.yv = random(-2,2);
		}
	}
	updatePosition() {
		this.x += this.xv;
		this.y += this.yv;
	}
	draw() {
		stroke(52, 235, 198, 100);
		strokeWeight(4);
		point(this.x, this.y);
	}
}