const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.appendChild(canvas);
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const graphics = new Image();
const tile_canvas = document.createElement('canvas');
graphics.src = "./monkeylad_further.png"
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
    if (editMode) {
        let gridSize = 30;
        let xGrid = Math.floor((event.offsetX + cameraPosition) / gridSize) * gridSize;
        let yGrid = Math.floor(event.offsetY / gridSize) * gridSize;
        block.push({ x: xGrid, y: yGrid, width: gridSize, height: gridSize });
        console.log(event.offsetX + cameraPosition, event.offsetY, xGrid, yGrid);
    } else {
        console.log(event.offsetX + cameraPosition, event.offsetY);
    }
});
tile_canvas.addEventListener('mousedown', function (event) {
    console.log('tile click')
});

let inGameTime = 0;
let editMode = true;
let gravity = 0.5;
let trainingSize = 1000;

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
        bananasCollected: 0,
        isAlive: true,
        controller: updateControlsForHuman,
        loggedFacingDirection: null,
    },
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
        choreography: generateRandomChoreography(1000),
        bananasCollected: 0,
        isAlive: true,
        controller: readAIChoreography,
        loggedFacingDirection: null,
    },
]

for (let i = 0; i < trainingSize; i++) {
    monke.push(
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
            choreography: generateRandomChoreography(1000),
            bananasCollected: 0,
            isAlive: true,
            controller: readAIChoreography,
            loggedFacingDirection: null,
        }
    )
}

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

function findRightMostMonkey() {
    let maxIndex = -1;
    let maxX = -Infinity;
    for (let i = 0; i < monke.length; i++) {
        if (monke[i].x > maxX) {
            maxX = monke[i].x;
            maxIndex = i;
        }
    }
    return { index: maxIndex, x: maxX }
}

let trainingLoopDuration = 6;

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
            if (monke[i].y > canvas.height + monke[i].height) {
                monke[i].y = canvas.height;
                monke[i].isAlive = false;
                monke[i].right = false;
                monke[i].left = false;
                monke[i].up = false;
                monke[i].down = false;
            }
        }
    }
    if (inGameTime / 60 >= trainingLoopDuration) {
        let obj = findRightMostMonkey();
        let index = obj.index;
        let x = obj.x;
        console.log(`the right most monkey is ${index} with x position ${x}`);
        trainingLoopDuration = ((x / 3) / 60);
        let winningChoreography = monke[index].choreography;
        monke = [
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
                bananasCollected: 0,
                isAlive: true,
                controller: updateControlsForHuman,
                loggedFacingDirection: null,
            },
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
                choreography: winningChoreography,
                bananasCollected: 0,
                isAlive: true,
                controller: readAIChoreography,
                loggedFacingDirection: null,
            },
        ]
        for (let i = 0; i < trainingSize; i++) {
            monke.push(
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
                    choreography: mutateChoreography(winningChoreography),
                    bananasCollected: 0,
                    isAlive: true,
                    controller: readAIChoreography,
                    loggedFacingDirection: null,
                }
            )
        }
        inGameTime = 0;
    }
}

let mutationFrequency = 0.1

function mutateChoreography(oldChoreography) {
    let newChoreography = [];
    for (let i = 0; i < oldChoreography.length; i++) {
        if (Math.random() < (1 - mutationFrequency)) {
            newChoreography.push(oldChoreography[i]);
        }
        else {
            newChoreography.push(generateRandomChoreography(1)[0]);
        }
    }
    return newChoreography;
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
    { x: -30, y: 0, width: 30, height: 30 },
    { x: -30, y: 30, width: 30, height: 30 },
    { x: -30, y: 60, width: 30, height: 30 },
    { x: -30, y: 90, width: 30, height: 30 },
    { x: -30, y: 120, width: 30, height: 30 },
    { x: -30, y: 150, width: 30, height: 30 },
    { x: -30, y: 180, width: 30, height: 30 },
    { x: -30, y: 210, width: 30, height: 30 },
    { x: -30, y: 240, width: 30, height: 30 },
    { x: -30, y: 270, width: 30, height: 30 },
    { x: -30, y: 300, width: 30, height: 30 },
    { x: -30, y: 330, width: 30, height: 30 },
    { x: -30, y: 360, width: 30, height: 30 },
    { x: -30, y: 390, width: 30, height: 30 },
    { x: -30, y: 420, width: 30, height: 30 },
    { x: -30, y: 450, width: 30, height: 30 },
    { x: -30, y: 480, width: 30, height: 30 },
    { x: -30, y: 510, width: 30, height: 30 },
    { x: -30, y: 540, width: 30, height: 30 },
    { x: -30, y: 570, width: 30, height: 30 },
    { x: -30, y: 600, width: 30, height: 30 },
    { x: 0, y: 570, width: 30, height: 30 },
    { x: 30, y: 570, width: 30, height: 30 },
    { x: 60, y: 570, width: 30, height: 30 },
    { x: 90, y: 570, width: 30, height: 30 },
    { x: 120, y: 570, width: 30, height: 30 },
    { x: 150, y: 570, width: 30, height: 30 },
    { x: 180, y: 570, width: 30, height: 30 },
    { x: 210, y: 570, width: 30, height: 30 },
    { x: 240, y: 570, width: 30, height: 30 },
    { x: 270, y: 570, width: 30, height: 30 },
    { x: 300, y: 570, width: 30, height: 30 },
    { x: 330, y: 570, width: 30, height: 30 },
    { x: 360, y: 570, width: 30, height: 30 },
    { x: 390, y: 570, width: 30, height: 30 },
    { x: 420, y: 570, width: 30, height: 30 },
    { x: 450, y: 570, width: 30, height: 30 },
    { x: 480, y: 570, width: 30, height: 30 },
    { x: 510, y: 570, width: 30, height: 30 },
    { x: 540, y: 570, width: 30, height: 30 },
    { x: 570, y: 570, width: 30, height: 30 },
    { x: 1200, y: 570, width: 30, height: 30 },
    { x: 1230, y: 570, width: 30, height: 30 },
    { x: 1260, y: 570, width: 30, height: 30 },
    { x: 1290, y: 570, width: 30, height: 30 },
    { x: 1320, y: 570, width: 30, height: 30 },
    { x: 1350, y: 570, width: 30, height: 30 },
    { x: 1380, y: 570, width: 30, height: 30 },
    { x: 1410, y: 570, width: 30, height: 30 },
    { x: 660, y: 480, width: 30, height: 30 },
    { x: 780, y: 420, width: 30, height: 30 },
    { x: 900, y: 420, width: 30, height: 30 },
    { x: 1020, y: 420, width: 30, height: 30 },
]

let blockSpriteX = 453 + 16;
let blockSpriteY = 101 + 16;
let blockSpriteHeight = 16;
let blockSpriteWidth = 16;

function drawBlock() {
    for (i = 0; i < block.length; i++) {
        //ctx.fillStyle = 'brown';
        ctx.drawImage(
            graphics,
            blockSpriteX,
            blockSpriteY,
            blockSpriteWidth,
            blockSpriteHeight,
            block[i].x - cameraPosition,
            block[i].y,
            block[i].width,
            block[i].height
        )
        //ctx.fillRect(block[i].x - cameraPosition, block[i].y, block[i].width, block[i].height)
    }
}

function updateControlsForHuman(player) {
    player.right = pressedKeys['d'];
    player.left = pressedKeys['a'];
    player.up = pressedKeys['w'];
    player.down = pressedKeys['s'];
}

function updateControlsForAI(robot, currentChoreography) {
    robot.right = false;
    robot.left = false;
    robot.up = false;
    robot.down = false;
    if (currentChoreography.direction === 'right') {
        robot.right = true;
    }
    if (currentChoreography.direction === 'left') {
        robot.left = true;
    }
    if (currentChoreography.direction === 'up') {
        robot.up = true;
    }
    if (currentChoreography.direction === 'down') {
        robot.down = true;
    }
}

function readAIChoreography(robot) {
    let totalActionTime = 0;
    for (let i = 0; i < robot.choreography.length; i++) {
        totalActionTime += robot.choreography[i].duration;
        if (totalActionTime >= inGameTime) {
            updateControlsForAI(robot, robot.choreography[i]);
            break;
        }
        if (i === robot.choreography.length - 1) {
            robot.up = false;
            robot.down = false;
            robot.right = false;
            robot.left = false;
        }
    }
}

function generateRandomChoreography(numInstructions) {
    let directions = ['right', 'up', 'down'];
    let minDuration = 1;
    let maxDuration = 10;
    let choreography = [];
    for (let i = 0; i < numInstructions; i++) {
        let directionIndex = Math.floor(Math.random() * directions.length);
        let selectedDirection = directions[directionIndex];
        let selectedDuration = Math.floor(Math.random() * (maxDuration - minDuration + 1) + 1)
        choreography.push({ direction: selectedDirection, duration: selectedDuration })
    }
    return choreography;
}

function drawGameTime() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "right"
    ctx.fillText("Time: " + Math.floor(inGameTime / 60) + "s", canvas.width - 10, 20);
}

actionsPerFrame = 1
function drawGame() {
    for (let i = 0; i < actionsPerFrame; i++) {
        inGameTime++;
        for (let m of monke) {
            m.controller(m);
        }
        updateAnimation();
        updateMonke();
    }
    let index = findRightMostMonkey().index;
    cameraPosition = Math.round(monke[index].x - canvas.width / 2 + monke[index].width / 2)
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00aaff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMonke();
    drawBlock();
    drawGameTime();
};

setInterval(drawGame, 16);