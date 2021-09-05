let button, oddsSlider;
let doSpin = false;
let win;
let startFrame=0;
let randAngle;

let radius;

let angle = 0;
let angleVel = 0;
let angleAcc = 0;
const k1 = 0.03;
const k2 = 0.01;

const leastVel = 4e-5;
let oneInX = 8;
let p = 1/oneInX;

let count = 0;




function setup() {
	createCanvas(windowWidth, windowHeight-30);
	
	button = createButton("Spin!");
	button.mousePressed(spin);
	
	oddsSlider = createSlider(2, 100, 100, 1);
	
	ellipseMode(RADIUS);
	
	radius = height/2.5;
	angle = Math.random() * TAU;
}

function spin() {
	doSpin = true;
	randAngle = random(TAU*6, TAU*7);
	
	angleVel = random(1, 2.5);
	
	startFrame = frameCount;
	count++;
}


function draw() {
	background(24,24,27);
	
	fill(255);
	textAlign(LEFT);
	textSize(32);
	text("1 in " + oddsSlider.value(),0, 32);
	
	oneInX = oddsSlider.value();
	p = 1/oneInX;
	
	angleAcc = - k1 * angleVel * angleVel;
	if (angleVel <= 0.07) angleAcc = - k2 * angleVel;
	
	angleVel += angleAcc; 
	angle += angleVel;


	push();
	translate(width/2,height/2);
	rotate(angle);
	
	
	
	noStroke();
	fill(51, 102, 204);
	arc(0, 0, radius, radius, p/2*TAU, (1-p/2) * TAU);
	
	fill(153, 0, 153);
	arc(0, 0, radius, radius, (1-p/2)*TAU, p/2*TAU);
	
	
	push();
	rotate(p/2*TAU);
	for (let i = 0; i < oneInX; i++) {
		stroke(0);
		strokeWeight(0.5);
		line(0, 0, radius, 0);
		rotate(p * TAU);
	}
	pop();
	
	fill(0);
	textStyle(BOLD);
	
	push();
	rotate(0.005*TAU);
	textSize(12);
	text("Arcana", height/3.1, -4);
	pop();
	
	//textSize(32);
	//text("NO", -height/5.2, 0);
	pop();
	
	stroke(0);
	strokeWeight(2);
	line(width/2+radius-10, height/2, width/2+radius+15, height/2);
	
	if (angleVel <= leastVel && doSpin === true) {
		angleVel = 0;
		doSpin = false;
		textAlign(CENTER);
		if ((angle%TAU) <= p/2*TAU || (angle%TAU) >= (1-p/2)*TAU) {
			alert("YOU WIN!!");
		}
		else {
			alert("You loose.");
		}
	}
}

function isWin(a) {
	return (a%TAU) <= p/2*TAU || (a%TAU) >= (1-p/2)*TAU;
}

function getResult(startAngle, startVel) {
	let a = startAngle;
	let av = startVel;
	let ac = 0;
	
	while (true) {
		ac = - k1 * av * av;
		if (av <= 0.07) ac = - k2 * av;
		
		av += ac; 
		a += av;
		
		if (av <= leastVel) break;
	}
	
	return a;
}

function findWinningVel(startAngle, steps, desired) {
	let bestResult = 100;
	let winningVel = -1;
	for (let i = 1; i <= steps; i++) {
		let vel = map(i, 1, steps, 1, 2.5);
		
		const result = Math.abs(getResult(startAngle, vel)%TAU-desired);
		if (result < bestResult) {
			bestResult = result;
			winningVel = vel;
		}
	}
	
	return winningVel;
}