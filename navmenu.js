/*
	@Author: Ashish Kushwaha (AshishKingdom)
*/
class NavMenu {
	constructor(n, xOff, i) {
		this.id = i;
		this.name = n;
		textFont(pageFont);
		textSize(32);
		this.width = textWidth(n);
		this.xOff = xOff;
		this.x1 = xOff-navMenuCW*2;
		this._x1 = xOff
		this.x2 = xOff+this.width+navMenuCW*2;
		this._x2 = xOff+this.width;
		this.y1 = 0;
		this.y2 = navMenuCH+canvasHeight*0.04;
		this.active = false;
	}
	draw() {
		noStroke();	
		if(this.active) {
			fill(36, 150, 191);//40, 118, 138);
		} else {
			fill(25);
		}
		//background designed box
		beginShape();
		vertex(this.x1, this.y1);// vertex(this.xOff-navMenuCW*2,0);
		vertex(this.xOff, this.y2);// vertex(this.xOff,navMenuCH+canvasHeight*0.04);
		vertex(this._x2, this.y2);// vertex(this.xOff+this.width,navMenuCH+canvasHeight*0.04);
		vertex(this.x2,this.y1)// vertex(this.xOff+this.width+navMenuCW*2,0);
		endShape(CLOSE);
		if(this.active) {
			stroke(255);
			strokeWeight(4);
			noFill();
			beginShape();
			vertex(this.xOff-navMenuCW*2,-1);
			vertex(this.xOff,navMenuCH+canvasHeight*0.04);
			vertex(this.xOff+this.width,navMenuCH+canvasHeight*0.04);
			vertex(this.xOff+this.width+navMenuCW*2,-1);
			endShape();
		}
		else if(mouseX>this.x1&&mouseX<this.x2&&mouseY>this.y1&&mouseY<this.y2){
			stroke(52, 235, 198);
			strokeWeight(5);
			noFill();
			beginShape();
			vertex(this.xOff-navMenuCW*2,-1);
			vertex(this.xOff,navMenuCH+canvasHeight*0.04);
			vertex(this.xOff+this.width,navMenuCH+canvasHeight*0.04);
			vertex(this.xOff+this.width+navMenuCW*2,-1);
			endShape();
		}
		//text
		noStroke()
		textFont(pageFont);
		textSize(32);//canvasHeight*0.05);
		fill(255);
		text(this.name, this.xOff, navMenuCH+canvasHeight*0.02);
	}
	checkMouse() {
		if(mouseX>this.x1&&mouseX<this.x2&&mouseY>this.y1&&mouseY<this.y2) {
			//this menu was selected.
			navMenus[active_menu].active =  false;
			this.active = true;
			active_menu = this.id;
		}
	}
}