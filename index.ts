// Initialize the race track
const RACE_TRACK = document.getElementById("raceTrack") as HTMLCanvasElement;
const TRACK_W = window.innerWidth - 20;
const TRACK_H = window.innerHeight - 20;

RACE_TRACK.height = TRACK_H;
RACE_TRACK.width = TRACK_W;

const ctx = RACE_TRACK.getContext('2d');
ctx.fillStyle = 'black';

// Establish draw loop

var boidList: Boid[] = [];
var boidInFocus = 0;

var isGoing = true;

function redraw() {
    ctx.clearRect(0, 0, TRACK_W, TRACK_H);
    
    boidList.forEach( boid => {
        ctx.beginPath();
        ctx.arc(boid.position.x, boid.position.y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(boid.position.x, boid.position.y);
        ctx.lineTo(boid.position.x + boid.velocity.x * 9, boid.position.y + boid.velocity.y * 9)
        ctx.stroke();
    });

    let drawn: Boid[] = [];

    // Now examine focused boid
    ctx.fillStyle = "yellow";
    boidList[boidInFocus].friendsList.forEach( friend => {
        ctx.beginPath();
        ctx.arc(friend.position.x, friend.position.y, 7, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        drawn.push(friend);
        friend.friendsList.forEach( cousin => {
            if (drawn.includes(cousin)) return;
            ctx.fillStyle="blue";
            ctx.beginPath();
            ctx.arc(cousin.position.x, cousin.position.y, 7, 0, 2 * Math.PI);
            ctx.fill();
            ctx.stroke();
            drawn.push(cousin);
            ctx.fillStyle="yellow"
        })
    });
    


    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(boidList[boidInFocus].position.x, boidList[boidInFocus].position.y, 7, 0, 2 * Math.PI);
    ctx.fill();

    ctx.fillStyle = "black";


    window.requestAnimationFrame(redraw);
}

function spawnBoid() {
    boidList.push(new Boid());
}

for (let i = 0; i < 200; i++) {
    spawnBoid();
}

window.requestAnimationFrame(redraw);

function tick() {
    boidList.forEach( boid => {
        boid.updateFriends(boidList);
        boid.updateFacing();
        boid.step();
    });
}

window.setInterval(tick, 10);

var RULE_1 = true;
var RULE_2 = true;
var RULE_3 = true;


var rightPress = false;
var leftPress = false;

document.addEventListener('keydown', event => {
    if (event.key == "ArrowRight" && !rightPress) {
        rightPress = true;
    }
    else if (event.key == "ArrowLeft" && !leftPress) {
        leftPress = true;
    }
});

document.addEventListener('keyup', event => {
    if (event.key == "ArrowRight" && rightPress) {
        rightPress = false;
    }
    else if (event.key == "ArrowLeft" && leftPress) {
        leftPress = false;
    }
});