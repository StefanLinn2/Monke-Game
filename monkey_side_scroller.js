const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const graphics = new Image();
const tile_canvas = document.createElement('canvas');
graphics.src = "https://opengameart.org/sites/default/files/monkeylad_further.png"
graphics.onload = function () {
    tile_canvas.width = graphics.width;
    tile_canvas.height = graphics.height;
    let ttx = tile_canvas.getContext('2d');
    ttx.drawImage(graphics, 0, 0);
    document.body.append(tile_canvas);
}

let pressedKeys = {};
let currentKeyDown = [];

document.addEventListener('keydown', function (event) {
    pressedKeys[event.key] = true;
    if (!currentKeyDown.includes(event.key)) {
        currentKeyDown.push(event.key);
    }
});
document.addEventListener('keyup', function (event) {
    pressedKeys[event.key] = false;
    let retainedKeyDown = []
    for (let i = 0; i < currentKeyDown.length; i++) {
        if (currentKeyDown[i] !== event.key) {
            retainedKeyDown.push(currentKeyDown[i]);
        }
    }
    currentKeyDown = retainedKeyDown;
});

canvas.addEventListener('mousedown', function (event) {
    console.log(event.offsetX + cameraPosition, event.offsetY);
});
tile_canvas.addEventListener('mousedown', function (event) {
    console.log('tile click')
});

let inGameTime = 0;
let edit_mode = true;
let gravity = 0.5;

let monke = [
    {
        x: 0,
        y: 0,
        width: 32,
        height: 48,
        dx: 0,
        dy: 0,
        onGround: false,
        left: false,
        right: false,
        up: false,
        down: false,
        speed: 1.5,
        friction: 0.75,
        controller: null,
        bananasCollected: 0,
        isAlive: true,
        controller: updateControlsForHuman,
        loggedFacingDirection: null,
    },
]

function collisionCheck(area1, area2) {
    return (
        area1.x + area1.width > area2.x &&
        area1.x < area2.x + area2.width &&
        area1.y + area1.height > area2.y &&
        area1.y < area2.y + area2.height
    );
}

function resolveXCollision(char) {
    for (let j = 0; j < block.length; j++) {
        if (collisionCheck(char, block[j])) {
            if (char.dx > 0) {
                char.x = block[j].x - char.width;
                char.dx = 0;
            }
            if (char.dx < 0) {
                char.x = block[j].x + block[j].width;
                char.dx = 0;
            }
        }
    }
}

function resolveYCollision(char) {
    for (let j = 0; j < block.length; j++) {
        if (collisionCheck(char, block[j])) {
            if (char.dy > 0) {
                char.y = block[j].y - char.height;
                char.dy = 0;
                char.onGround = true;
            }
            if (char.dy < 0) {
                char.y = block[j].y + block[j].width;
                char.dy = 0;
            }
        }
    }
}

function updateMonke() {
    for (i = 0; i < monke.length; i++) {
        if (monke[i].isAlive) {
            monke[i].dy += gravity;
            monke[i].x += monke[i].dx;
            monke[i].dx *= monke[i].friction;
            resolveXCollision(monke[i]);
            monke[i].y += monke[i].dy;
            monke[i].onGround = false;
            resolveYCollision(monke[i]);

            if (monke[i].left && monke[i].right) {
                if (currentKeyDown[currentKeyDown.length - 1] === 'd' ||
                    (currentKeyDown[currentKeyDown.length - 1] === 'w' &&
                        currentKeyDown[currentKeyDown.length - 2] === 'd')) {
                    monke[i].left = false;
                    monke[i].dx += monke[i].speed;
                    monke[i].loggedFacingDirection = 'right';
                } else
                    if (currentKeyDown[currentKeyDown.length - 1] === 'a' ||
                        (currentKeyDown[currentKeyDown.length - 1] === 'w' &&
                            currentKeyDown[currentKeyDown.length - 2] === 'a')) {
                        monke[i].right = false;
                        monke[i].dx -= monke[i].speed;
                        monke[i].loggedFacingDirection = 'left';
                    }
            } else {
                if (monke[i].left === true) {
                    monke[i].dx -= monke[i].speed;
                    monke[i].loggedFacingDirection = 'left';
                }
                if (monke[i].right === true) {
                    monke[i].dx += monke[i].speed;
                    monke[i].loggedFacingDirection = 'right';
                }
            }
            if (monke[i].down === true) {
                monke[i].dy += monke[i].speed;
            }
            if (monke[i].up === true && monke[i].onGround) {
                monke[i].dy = -10;
                monke[i].onGround = false;
            }
            if (monke[i].y < 0) {
                monke[i].y = monke[i].dy = 0;
            }
            if (monke[i].y > canvas.height) {
                monke[i].y = canvas.height;
                monke[i].isAlive = false;
            }
        }

    }
}

let monkeSpriteWalkFrames = [];
let monkeSpriteWalkWidth = 16;
let monkeSpriteWalkHeight = 24;
let monkeSpriteWalkNumFrames = 5;

for (i = 0; i < monkeSpriteWalkNumFrames; i++) {
    monkeSpriteWalkFrames.push(
        {
            x: 448 + 32 + i * monkeSpriteWalkWidth,
            y: 208,
            width: monkeSpriteWalkWidth,
            height: monkeSpriteWalkHeight,
        }
    )
}

let gameFrameCounter = 0;
let frameChangeThreshold = 6;
let currentFrame = 0;

function updateAnimation() {
    gameFrameCounter++;
    if (gameFrameCounter > frameChangeThreshold) {
        gameFrameCounter = 0;
        currentFrame = (currentFrame + 1) % monkeSpriteWalkNumFrames;
    }
}

function drawNeutralMonkeImage(roundedPosition, monkeObj) {
    ctx.drawImage(
        graphics,
        448,
        208,
        monkeSpriteWalkWidth,
        monkeSpriteWalkHeight,
        roundedPosition.x,
        roundedPosition.y,
        monkeObj.width,
        monkeObj.height
    )
}

function drawRightWalkingMonke(roundedPosition, monkeObj) {
    ctx.drawImage(
        graphics,
        monkeSpriteWalkFrames[currentFrame].x,
        monkeSpriteWalkFrames[currentFrame].y,
        monkeSpriteWalkFrames[currentFrame].width,
        monkeSpriteWalkFrames[currentFrame].height,
        roundedPosition.x,
        roundedPosition.y,
        monkeObj.width,
        monkeObj.height
    )
}

function drawRightFacingMonke(roundedPosition, monkeObj) {
    ctx.drawImage(
        graphics,
        448 + 16,
        208,
        monkeSpriteWalkWidth,
        monkeSpriteWalkHeight,
        roundedPosition.x,
        roundedPosition.y,
        monkeObj.width,
        monkeObj.height
    )
}

function drawRightJumpingMonke(roundedPosition, monkeObj) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(
        graphics,
        616,
        208,
        monkeSpriteWalkWidth,
        monkeSpriteWalkHeight,
        -roundedPosition.x - monke[i].width,
        roundedPosition.y,
        monkeObj.width,
        monkeObj.height
    )
    ctx.restore();
}

function drawLeftWalkingMonke(roundedPosition, monkeObj) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(
        graphics,
        monkeSpriteWalkFrames[currentFrame].x,
        monkeSpriteWalkFrames[currentFrame].y,
        monkeSpriteWalkFrames[currentFrame].width,
        monkeSpriteWalkFrames[currentFrame].height,
        -roundedPosition.x - monke[i].width,
        roundedPosition.y,
        monkeObj.width,
        monkeObj.height
    )
    ctx.restore();
}

function drawLeftFacingMonke(roundedPosition, monkeObj) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(
        graphics,
        448 + 16,
        208,
        monkeSpriteWalkWidth,
        monkeSpriteWalkHeight,
        -roundedPosition.x - monke[i].width,
        roundedPosition.y,
        monkeObj.width,
        monkeObj.height
    )
    ctx.restore();
}

function drawLeftJumpingMonke(roundedPosition, monkeObj) {
    ctx.drawImage(
        graphics,
        616,
        208,
        monkeSpriteWalkWidth,
        monkeSpriteWalkHeight,
        roundedPosition.x,
        roundedPosition.y,
        monkeObj.width,
        monkeObj.height
    )
}

function drawMonke() {
    for (i = 0; i < monke.length; i++) {
        let roundedPosition = {
            x: Math.round(monke[i].x - cameraPosition),
            y: Math.round(monke[i].y)
        }

        if (monke[i].loggedFacingDirection === null) {
            drawNeutralMonkeImage(roundedPosition, monke[i]);
        } else if (monke[i].right && !monke[i].left && monke[i].onGround) {
            drawRightWalkingMonke(roundedPosition, monke[i]);
        } else if (monke[i].loggedFacingDirection === 'right' && monke[i].onGround) {
            drawRightFacingMonke(roundedPosition, monke[i]);
        } else if (monke[i].loggedFacingDirection === 'right' && !monke[i].onGround) {
            drawRightJumpingMonke(roundedPosition, monke[i]);
        } else if (monke[i].left && !monke[i].right && monke[i].onGround) {
            drawLeftWalkingMonke(roundedPosition, monke[i]);
        } else if (monke[i].loggedFacingDirection === 'left' && monke[i].onGround) {
            drawLeftFacingMonke(roundedPosition, monke[i]);
        } else if (monke[i].loggedFacingDirection === 'left' && !monke[i].onGround) {
            drawLeftJumpingMonke(roundedPosition, monke[i]);
        }
    }
}

let block = [
    { x: -30, y: 0, width: 30, height: canvas.height },
    { x: 0, y: 570, width: 700, height: 60 },
    { x: 1350, y: 570, width: 200, height: 60 },
]

function drawBlock() {
    for (i = 0; i < block.length; i++) {
        ctx.fillStyle = 'brown';
        ctx.fillRect(block[i].x - cameraPosition, block[i].y, block[i].width, block[i].height)
    }
}

function updateControlsForHuman(player) {
    player.right = pressedKeys['d'];
    player.left = pressedKeys['a'];
    player.up = pressedKeys['w'];
    player.down = pressedKeys['s'];
}

function drawGame() {
    inGameTime++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let m of monke) {
        m.controller(m);
    }
    updateAnimation();
    updateMonke();
    cameraPosition = Math.round(monke[0].x - canvas.width / 2 + monke[0].width / 2)
    drawMonke();
    drawBlock();
};

setInterval(drawGame, 16);