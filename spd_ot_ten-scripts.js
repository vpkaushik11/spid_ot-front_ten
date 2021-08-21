const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');

let level = 0.05;
let GAMMA = false;
let keys = {};
let AI = false;
let Co_Op = false;
let spa = 75;
let count = 1;
let p1_scoreText = document.getElementById("player1-score");
let p2_scoreText = document.getElementById("player2-score");

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : 10,
    vx : 4,
    vy : 4,
    speed : 5,
    color : "White"
}

// P1 Paddle
const P1 = {
    x : 0,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "White"
}

// P2 Paddle
const P2 = {
    x : canvas.width - 10,
    y : (canvas.height - 100)/2,
    width : 10,
    height : 100,
    score : 0,
    color : "White"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "Grey"
}

if(P1.score === 11 || P2.score === 11){
    GAMMA = false
} else {
    GAMMA =true;
}

function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}
if(AI){ // listening to the mouse if AI is true
    canvas.addEventListener("mousemove", getMousePos);

    function getMousePos(evt){
        let rect = canvas.getBoundingClientRect();
    
        P1.y = evt.clientY - rect.top - P1.height/2;
    }
} else {
    document.addEventListener('keydown', function(e){
        keys[e.code] = true;
        console.log(keys[e.code]);
        if(keys['ArrowUp']){
            P2.y -= spa;
        } else if(keys['ArrowDown']){
            P2.y += spa;
        } else if(keys['KeyW']){
            P1.y -= spa;
        }
        else if(keys['KeyS']){
            P1.y += spa;
        }
      });
    document.addEventListener('keyup', function(e){
        keys[e.code] = false;
    });
}

// to reset ball when score happens
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.vx = -ball.vx;
    ball.speed = 5;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// collision detection
function collision(b,p){
    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;
    
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;
    
    return p.left < b.right && p.top < b.bottom && p.right > b.left && p.bottom > b.top;
}

// update function
function update(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    render();
    requestAnimationFrame(update);
    if( ball.x - ball.radius < 0 ){
        P2.score++;
        resetBall();
    }else if( ball.x + ball.radius > canvas.width){
        P1.score++;
        resetBall();
    }
    
    // the ball has a velocity
    ball.x += ball.vx;
    ball.y += ball.vy;
    
    // simple AI if needed
    if(AI){
        P2.y += ((ball.y - (P2.y + P2.height/2)))*level;
    }
    
    // when the ball collides with bottom and top walls we inverse the y velocity.
    if(ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
        ball.vy = -ball.vy;
    }
    
    // we check if the paddle hit the P1 or the P2 paddle
    let player = (ball.x + ball.radius < canvas.width/2) ? P1 : P2;
    
    // if the ball hits a paddle
    if(collision(ball,player)){
        // we check where the ball hits the paddle
        let collidePoint = (ball.y - (player.y + player.height/2));
        
        collidePoint = collidePoint / (player.height/2);

        let angleRad = (Math.PI/4) * collidePoint;
        
        let direction = (ball.x + ball.radius < canvas.width/2) ? 1 : -1;
        ball.vx = direction * ball.speed * Math.cos(angleRad);
        ball.vy = ball.speed * Math.sin(angleRad);
        
        // speed up the ball everytime a paddle hits it.
        ball.speed += 0.01;
    }
    p1_scoreText.textContent = "P1 Score: " + P1.score;
    p2_scoreText.textContent = "P2 Score: " + P2.score;
    
    if (P1.score == 11 || P2.score == 11){
        if(P1.score == 11){
            alert("Player 1 Wins");
        } else if(P2.score == 11){
            alert("Player 2 Wins");
        }
        GAMMA = false;
        window.location.reload();
    }
}

// render function
function render(){
    // draw the net
  drawNet();
    // draw the P1's paddle
  drawRect(P1.x, P1.y, P1.width, P1.height, P1.color);
    // draw the P2's paddle
  drawRect(P2.x, P2.y, P2.width, P2.height, P2.color);
    // draw the ball
  drawArc(ball.x, ball.y, ball.radius, ball.color);
}
function game(){
  if(GAMMA){
    spa = 75;
    ball.vx = 4;
    ball.vy = 4;
    ball.speed = 5;
    update();
    requestAnimationFrame(update);
  } else{
    ball.vx = 0;
    ball.vy = 0;
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    ball.speed = 0;
    spa = 0;
  }
}
game();
