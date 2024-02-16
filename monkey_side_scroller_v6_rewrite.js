const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.append(canvas);
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const graphics = new Image();
graphics.src = "https://opengameart.org/sites/default/files/monkeylad_further.png"
//ctx.drawImage(graphics, 448, 208, 16, 24, 0,0, 16, 24)

let player_char = {
    x: 0,
    y: 0,
    width: 32,
    height: 48,
    speed: 1.5,
    dx: 0,
    dy: 0,
    friction: 0.75
}

let sprite_frames = [];
let sprite_width = 16;
let sprite_height = 24;
let num_frames = 5;

for (let i = 0; i < num_frames; i++){
    sprite_frames.push({
        sx: 448 + 32 + i * sprite_width,
        sy: 208,
        sw: sprite_width,
        sh: sprite_height
    })
}

let current_frame = 0;
let frame_count = 0;
let frame_delay = 5;
let is_moving = false;

let gravity = 0.5;


let block = [
    { x: 0, y: 540, width: canvas.width, height: 30 },
    //{ x: 400, y: 540, width: 200, height: 30 },
    //ground
    { x: 100, y: 460, width: 30, height: 30 },
    { x: 150, y: 400, width: 30, height: 30 },
    { x: 100, y: 320, width: 30, height: 30 },
    { x: 190, y: 220, width: 70, height: 30 },
    { x: 50, y: 240, width: 30, height: 30 },
]

function draw_player_char() {
    let frame;
    if (is_moving){
    frame = sprite_frames[current_frame];
    } else {
        frame = {
            sx:448,
            sy:208,
            sw:16,
            sh:24
        };
    }

    if (player_char.dx < 0) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            -player_char.x - player_char.width, player_char.y, player_char.width, player_char.height
        );
        ctx.restore();
    } else {
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            player_char.x, player_char.y, player_char.width, player_char.height
        );
    }
}

function update_animation(){
    frame_count ++;
    if (frame_count >= frame_delay){
        frame_count = 0;
        current_frame = (current_frame + 1) % num_frames;
    }
}

function draw_block() {
    for (let i = 0; i < block.length; i++) {
        ctx.fillStyle = 'brown';
        ctx.fillRect(block[i].x, block[i].y, block[i].width, block[i].height)
    }
}

let pressedKeys = {};
document.addEventListener('keydown', function (event) {
    pressedKeys[event.key] = true;
});
document.addEventListener('keyup', function (event) {
    pressedKeys[event.key] = false;
});

function update_player_char() {
    console.log(player_char.dx, player_char.dy)
    onGround = false;
    is_moving = (player_char.dx !== 0)
    player_char.dy += gravity
    update_animation();
    player_char.x += player_char.dx;
    for (let i = 0; i < block.length; i++) {
        if (check_collision(player_char, block[i])) {
            console.log("horizontal collision")
            if (player_char.dx > 0) {
                player_char.x = block[i].x - player_char.width;
                player_char.dx = 0;
            }
            if (player_char.dx < 0) {
                player_char.x = block[i].x + block[i].width;
                player_char.dx = 0;
            }
        }
    }
    player_char.y += player_char.dy;
    for (let i = 0; i < block.length; i++) {
        if (check_collision(player_char, block[i])) {
            console.log("vertical collision")
            if (player_char.dy > 0) {
                player_char.y = block[i].y - player_char.height;
                player_char.dy = 0;
                onGround = true;
            }
            if (player_char.dy < 0) {
                player_char.y = block[i].y + block[i].height;
                player_char.dy = 0;
            }
        }
    }

    player_char.dx *= player_char.friction;
    //player_char.dy *= player_char.friction;
    //air friction someday?

    if (player_char.dx == player_char.dy == 0){
        //ctx.drawImage(graphics, 448, 208, 16, 24, player_char.x, player_char.y, player_char.width, player_char.height);
    }

    if (pressedKeys['a']) {
        player_char.dx -= player_char.speed;
    }
    if (pressedKeys['s']) {
        player_char.dy += player_char.speed;
    }
    if (pressedKeys['d']) {
        player_char.dx += player_char.speed;
    }
    if (pressedKeys['w'] && onGround) {
        player_char.dy = -10;
    }

    if (player_char.x < 0) {
        player_char.x = 0;
    } else if (player_char.x + player_char.width > canvas.width) {
        player_char.x = canvas.width - player_char.width;
    }

    if (player_char.y < 0) {
        player_char.y = 0;
        player_char.dy = 0;
    } else if
        (player_char.y >= canvas.height) {
        player_char.y = canvas.height;
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('you ded', canvas.width / 2 - 20, canvas.height / 2)
    }



}


function check_collision(area1, area2) {
    return (
        area1.x + area1.width > area2.x &&
        area1.x < area2.x + area2.width &&
        area1.y + area1.height > area2.y &&
        area1.y < area2.y + area2.height
    );
}


function draw_game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update_player_char();
    draw_player_char();
    draw_block();
}

setInterval(draw_game, 16);