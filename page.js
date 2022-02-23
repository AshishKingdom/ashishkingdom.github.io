/*
	@Author: Ashish Kushwaha (AshishKingdom)
*/

var canvasWidth, canvasHeight;
var aspectRatio;
var navMenus = [];// = ["HOME", "PROJECTS", "ABOUT", "CONTACT"]
var navMenuCW, navMenuCH; //Navbar Menu Character Width and Height
var active_menu = 0;
var pageFont, pixelFont, selfImage;
var bgPoints = [];
var abtText;
abtText = "Hello! I am currently an undergraduate student pursuing B.Tech in Computer Science and Engineering from JSS Academy of Technical Education, Noida.";
abtText+=" I have interest in coding/developing video games, graphical simulation and algorithmic designs. I also have interest in AI/ML and in developing computer applications.";

var btmLinkText = {text:"Made with <3 by Ashish", x:0, y:0, w:0, h:0};
var clock;

function preload() {
	pageFont = loadFont("https://ashishkingdom.github.io/assets/RobotoMono-Regular.ttf");
	pixelFont = loadFont("https://ashishkingdom.github.io/assets/batmfa__.ttf");//PressStart2P-Regular.ttf");
	selfImage = loadImage("https://ashishkingdom.github.io/assets/ashish.png");

}

function desktopInterface() {
	drawBackground();
	drawNavBarD();
	//rendering the self image
	image(selfImage,canvasWidth*0.7	,canvasHeight*0.3,canvasWidth*0.25, canvasWidth*0.25);
	noStroke();
	fill(52, 235, 198);
	textFont(pixelFont);
	textSize(canvasHeight*0.11);
	text("ASHISH KUSHWAHA",canvasWidth*0.02,canvasHeight*0.25);
	fill(255);
	textFont(pageFont);
	textSize(canvasHeight*0.04);
	text(abtText,canvasWidth*0.02, canvasHeight*0.3, canvasWidth*0.6,canvasHeight*0.6);
	// stroke(255);
	// noFill();
	// strokeWeight(1);
	// rect(btmLinkText.x,btmLinkText.y-btmLinkText.h,btmLinkText.w,btmLinkText.h);
	fill(180+50*sin(clock), 2, 81);
	textSize(canvasHeight*0.04);
	text(btmLinkText.text, btmLinkText.x, btmLinkText.y);

	if(mouseX>btmLinkText.x&&mouseX<btmLinkText.x+btmLinkText.w&&mouseY>btmLinkText.y-btmLinkText.h&&mouseY<btmLinkText.y){
		// window.location = "https://github.com/AshishKingdom/ashishkingdom.github.io/";
		document.body.style.cursor = "pointer";
	} else {
		document.body.style.cursor = "default";
	}
}

function drawBackground() {
	background(5);
	for(var i=0;i<bgPoints.length;i++){
		bgPoints[i].draw();
		bgPoints[i].updatePosition();
		bgPoints[i].checkBoundaries();
		for(var j=i+1;j<bgPoints.length;j++){
			// for(var k=j+1;k<bgPoints.length;k++){
				var d1 = dist(bgPoints[i].x,bgPoints[i].y, bgPoints[j].x, bgPoints[j].y);
				// var d2 = dist(bgPoints[i].x,bgPoints[i].y, bgPoints[k].x, bgPoints[k].y);
				if(d1<100){
					strokeWeight(1);
					stroke(255,50);
					line(bgPoints[i].x,bgPoints[i].y, bgPoints[j].x, bgPoints[j].y);
				}
			// }
		}
	}
}

function drawNavBarD() {
	//fill(30);
	//rect(0,0,canvasWidth+1,canvasHeight*0.1);
	for(var i=0;i<navMenus.length;i++){
		navMenus[i].draw();
	}
}

function mobileInterface() {

}
function setup() {
	//set page title
	document.title = "Ashish's Portfolio";
	//create the canvas
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	aspectRatio = canvasWidth/canvasHeight;
	createCanvas(canvasWidth, canvasHeight);
	background(0);

	//nav menus
	textFont(pageFont);
	navMenuCH = canvasHeight*0.04;
	textSize(navMenuCH);
	navMenuCW = textWidth("A");
	
	navMenus.push(new NavMenu("HOME", navMenuCW*2, 0));
	navMenus.push(new NavMenu("PROJECTS", navMenus[0].xOff+navMenus[0].width+navMenuCW*4,1));
	navMenus.push(new NavMenu("ABOUT", navMenus[1].xOff+navMenus[1].width+navMenuCW*4,2));
	navMenus.push(new NavMenu("CONTACT", navMenus[2].xOff+navMenus[2].width+navMenuCW*4,3));
	navMenus[active_menu].active = true;

	//bottom link 'Made with <3 by Ashish'
	textSize(canvasHeight*0.04);
	textFont(pageFont);
	noStroke();
	btmLinkText.w = textWidth(btmLinkText.text);
	btmLinkText.h = canvasHeight*0.04;
	btmLinkText.x = (canvasWidth - btmLinkText.w)*0.5;
	btmLinkText.y = canvasHeight*0.95;

	//background animation stuff;
	for(var i=0;i<100;i++){
		bgPoints.push(new Points());
	}

	//set frame rate to @24fps	
	frameRate(24);
	clock = 0.0;
	document.body.style.backgroundColor = '#050505';
}

function draw() {
	if(aspectRatio>1) { //PC
		//background(255,0,0);
		desktopInterface();
	} else { //Mobile
		// background(0,255,0);
		mobileInterface();
	}
	clock+=0.07;
}

function mouseClicked() {
	for(var i=0;i<navMenus.length;i++)navMenus[i].checkMouse();
	if(mouseX>btmLinkText.x&&mouseX<btmLinkText.x+btmLinkText.w&&mouseY>btmLinkText.y-btmLinkText.h&&mouseY<btmLinkText.y){
		window.location = "https://github.com/AshishKingdom/ashishkingdom.github.io/";
		document.body.style.cursor = "link";
	}
}

function windowResized() { //update canvas width, height and aspect ratio whenever window size get changed
	canvasWidth = window.innerWidth;
	canvasHeight = window.innerHeight;
	aspectRatio = canvasWidth/canvasHeight;
	resizeCanvas(canvasWidth, canvasHeight);
}