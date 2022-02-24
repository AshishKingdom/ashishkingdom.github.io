/*
	@Author: Ashish Kushwaha (AshishKingdom)
*/

class Points {
	constructor() {
		this.x = random(width);
		this.y = random(height);
		this.xv = random(-2,2);
		this.yv = random(-2,2);
	}
	checkBoundaries() {
		if(this.x>width||this.x<0||this.y>height||this.y<0){
			this.x = random(width);
			this.y = random(height);
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

function drawPoints(p_obj) {
	for(var i=0;i<p_obj.length;i++){
		p_obj[i].draw();
		p_obj[i].updatePosition();
		p_obj[i].checkBoundaries();
		for(var j=i+1;j<p_obj.length;j++){
			var d1 = dist(p_obj[i].x,p_obj[i].y, p_obj[j].x, p_obj[j].y);
			// var d2 = dist(p_obj[i].x,p_obj[i].y, p_obj[k].x, p_obj[k].y);
			if(d1<100){
				strokeWeight(1);
				stroke(255,50);
				line(p_obj[i].x,p_obj[i].y, p_obj[j].x, p_obj[j].y);
			}
		}
	}
}