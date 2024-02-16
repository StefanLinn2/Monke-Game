//create environment
const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.append(canvas);
const ctx = canvas.getContext('2d');

//initial coordinates
let x_coor = 0;
let y_coor = 0;

//gravity
let gravity = 0.1;

//unit specs below:

let npcWidth = 30;
let npcHeight = 30;

let npcs = [];

// create floor of NPC blocks 0.00001 pixels apart
for (let i = 0; i < canvas.width; i += npcWidth + 0.01) {
    npcs.push({ x: i, y: 520, width: npcWidth, height: npcHeight });
}

// push the existing NPC block at x: 300, y: 300
npcs.push({ x: 300, y: 300, width: npcWidth, height: npcHeight });

//main char
let main_char = {
    x: x_coor,
    y: y_coor,
    width: 30,
    height: 30,
    speed: 3,
    max_speed: 5,
    acceleration: 0.1,
    dx: 0, //horizonal velocity
    dy: 0 //vertical velocity
}

//bananas
let bananas = [
    { x: 150, y: 490, width: 30, height: 30 },
    { x: 400, y: 400, width: 30, height: 30 },
    { x: 250, y: 300, width: 30, height: 30 }
];

// draw bananas
function draw_bananas() {
    bananas.forEach((banana, index) => {
      ctx.fillStyle = '#FFDC52';
      ctx.fillRect(banana.x, banana.y, banana.width, banana.height);
    });
  }

//score
let score = 0;

//draw score
function drawScore() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, canvas.width - 120, 30);
  }

//draw units below:
function draw_main_character() {
    ctx.fillStyle = '#A99F93';
    ctx.fillRect(main_char.x, main_char.y, main_char.width, main_char.height)
}

function draw_npcs() {
    npcs.forEach(npc => {
        ctx.fillStyle = '#B16100';
        ctx.fillRect(npc.x, npc.y, npc.width, npc.height);
    });
}

//environment
function applyGravity() {
    let onGround = false;
    let maxGravity = 5; // Maximum gravity value (can be adjusted)
    npcs.forEach(npc => {
        if (check_collision({
            x: main_char.x,
            y: main_char.y + main_char.height,
            width: main_char.width,
            height: maxGravity //this number is the buffer for how far to do last tick reposition
        }, npc)) {
            onGround = true;
            main_char.dy = 0; // Reset vertical velocity
            main_char.y = npc.y - main_char.height; // Position the main character on top of the NPC block
        }
    });

    if (!onGround) {

        main_char.dy += gravity;
        if (main_char.dy > maxGravity) {
            main_char.dy = maxGravity; // Limit the vertical velocity to the maximum gravity value
        }
    }
    console.log("dy: " + main_char.dy, "gravity: " + gravity, "onGround: " + onGround)
}

//unit controls below:

function update_main_char() {
    main_char.speed += main_char.acceleration;

    if (main_char.speed > main_char.max_speed) {
        main_char.speed = main_char.max_speed;
    }

    let new_x = main_char.x + main_char.dx;
    let new_y = main_char.y + main_char.dy;

    //stops no clipping through npcs

    let colliding = false;
    npcs.forEach(npc => {
        if (check_collision({ x: new_x, y: new_y, width: main_char.width, height: main_char.height }, npc)) {
            colliding = true;
        }
    });

    if (!colliding) {
        main_char.x = new_x;
        main_char.y = new_y;
    }
    console.log("colliding: " + colliding)

    //gravity
    applyGravity();

    //stops from going off canvas
    if (new_x < 0) {
        main_char.x = 0;
    } else if (new_x + main_char.width > canvas.width) {
        main_char.x = canvas.width - main_char.width;
    }

    if (new_y < 0) {
        main_char.y = 0;
    } else if (new_y + main_char.height > canvas.height) {
        main_char.y = canvas.height - main_char.height;
    }
    // Collect bananas
    bananas.forEach((banana, index) => {
        if (check_collision(main_char, banana)) {
          bananas.splice(index, 1); // Remove collected banana
          score += 100; // Increase score by 100
        }
      });
}

function move_main_char(direction) {
    if (direction == 'up') {
        main_char.dy = - main_char.speed;
    } else if (direction == 'left') {
        main_char.dx = - main_char.speed;
    } else if (direction == 'down') {
        main_char.dy = main_char.speed;
    } else if (direction == 'right') {
        main_char.dx = main_char.speed;
    }
}

function stop_main_char(direction) {
    if (direction == 'up' || direction == 'down') {
        main_char.dy = 0;
    } else if (direction == 'left' || direction == 'right') {
        main_char.dx = 0;
    }
}

function check_collision(area1, area2) {
    return (
        area1.x + area1.width > area2.x &&
        area1.x < area2.x + area2.width &&
        area1.y + area1.height > area2.y &&
        area1.y < area2.y + area2.height
    )
}

//draw functions calls on all other draw functions to
//create environment
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    update_main_char();
    if (check_collision(main_char, npcs)) {
        stop_main_char(direction);
    }
    draw_main_character();
    draw_npcs();
    draw_bananas();
    drawScore();
}

//user controls W A S D for movement
document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyD') {
        move_main_char('right')
    }
    if (event.code == 'KeyA') {
        move_main_char('left')
    }
    if (event.code == 'KeyW') {
        move_main_char('up')
    }
    if (event.code == 'KeyS') {
        move_main_char('down')
    }
})

document.addEventListener('keyup', function (event) {
    if (event.code == 'KeyD') {
        stop_main_char('right')
    } else if (event.code == 'KeyA') {
        stop_main_char('left')
    } else if (event.code == 'KeyW') {
        stop_main_char('up')
    } else if (event.code == 'KeyS') {
        stop_main_char('down')
    }
})

setInterval(draw, 16)


//goals:
//gravity and platforms
//bananas and pts (look up how to do counters in screen)

//moving npcs
//jump mechanics
//lofty tasks camera follow the character
