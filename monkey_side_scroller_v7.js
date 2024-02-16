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
    height: 56,
    speed: 1.5,
    dx: 0,
    dy: 0,
    friction: 0.75
}

let gravity = 0.5;

let block = [
    { x: -30, y: 0, width: 30, height: canvas.height },
    { x: 0, y: 540, width: 700, height: 60 },
    { x: 1350, y: 540, width: 200, height: 60 },
    //ground
    { x: 100, y: 450, width: 30, height: 30 },
    { x: 180, y: 400, width: 30, height: 30 },
    { x: 100, y: 320, width: 30, height: 30 },
    { x: 190, y: 240, width: 70, height: 30 },
    { x: 50, y: 230, width: 30, height: 30 },
    { x: 570, y: 450, width: 30, height: 30 },
    { x: 640, y: 400, width: 30, height: 30 },
    { x: 710, y: 350, width: 30, height: 30 },
    { x: 780, y: 300, width: 30, height: 30 },
    { x: 920, y: 300, width: 30, height: 30 },
    { x: 1060, y: 300, width: 30, height: 30 }
]

let banana = [
    { x: 50, y: 90, width: 30, height: 30 },
    { x: 150, y: 490, width: 30, height: 30 },
    { x: 200, y: 170, width: 30, height: 30 },
    { x: 400, y: 400, width: 30, height: 30 },
    { x: 250, y: 300, width: 30, height: 30 },
    { x: 1500, y: 440, width: 30, height: 30 }
];

function draw_bananas() {
    for (let i = 0; i < banana.length; i++) {
        ctx.fillStyle = '#FFDC52';
        ctx.fillRect(banana[i].x - player_char.x + canvas.width / 2, banana[i].y, banana[i].width, banana[i].height);
    };
}

let score = 0;

function draw_score() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 210 + canvas.width / 2 - player_char.width / 2, 30);
}

let sprite_frames = [];
let sprite_width = 16;
let sprite_height = 24;
let num_frames = 5;

for (let i = 0; i < num_frames; i++) {
    sprite_frames.push({
        sx: 448 + 32 + i * sprite_width,
        sy: 208,
        sw: sprite_width,
        sh: sprite_height
    })
}

let current_frame = 0;
let frame_count = 0;
let frame_delay = 6;

function update_animation() {
    frame_count++;
    if (frame_count >= frame_delay) {
        frame_count = 0;
        current_frame = (current_frame + 1) % num_frames;
    }
}

function draw_player_char() {
    let rounded_position = {
        x: canvas.width / 2 - player_char.width / 2,
        y: Math.round(player_char.y)
    }
    let frame;

    if (pressedKeys['a']) {
        logged_a_d_keypress = 'a';
    } else if (pressedKeys['d']) {
        logged_a_d_keypress = 'd';
    }

    if (pressedKeys['a'] || pressedKeys['d']) {
        frame = sprite_frames[current_frame];
    }
    else if (logged_a_d_keypress === 'd' && onGround === true) {
        frame = {
            sx: 448 + 16,
            sy: 208,
            sw: 16,
            sh: 24
        };
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            rounded_position.x, rounded_position.y, player_char.width, player_char.height
        );
    } else if (logged_a_d_keypress === 'd' && onGround === false) {
        frame = {
            sx: 616,
            sy: 208,
            sw: 16,
            sh: 24,
        };
        ctx.save()
        ctx.scale(-1, 1)
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            -rounded_position.x - player_char.width, rounded_position.y, player_char.width, player_char.height
        );
        ctx.restore();
    } else if (logged_a_d_keypress === 'a' && onGround === true) {
        frame = {
            sx: 448 + 16,
            sy: 208,
            sw: 16,
            sh: 24
        };
        ctx.save()
        ctx.scale(-1, 1)
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            -rounded_position.x - player_char.width, rounded_position.y, player_char.width, player_char.height
        );
        ctx.restore();
    } else if (logged_a_d_keypress === 'a' && onGround === false) {
        frame = {
            sx: 616,
            sy: 208,
            sw: 16,
            sh: 24,
        };
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            rounded_position.x, rounded_position.y, player_char.width, player_char.height
        );
    } else if (logged_a_d_keypress === 'none') {
        frame = {
            sx: 448,
            sy: 208,
            sw: 16,
            sh: 24
        };
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            rounded_position.x, rounded_position.y, player_char.width, player_char.height
        );
    }

    if (pressedKeys['a'] && onGround === true) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            -rounded_position.x - player_char.width, rounded_position.y, player_char.width, player_char.height
        );
        ctx.restore();
    } else if (pressedKeys['a'] && onGround === false) {
        frame = {
            sx: 616,
            sy: 208,
            sw: 16,
            sh: 24,
        };
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            rounded_position.x, rounded_position.y, player_char.width, player_char.height
        );
    }
    else if (pressedKeys['d'] && onGround === true) {
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            rounded_position.x, rounded_position.y, player_char.width, player_char.height
        );
    } else if (pressedKeys['d'] && onGround === false) {
        frame = {
            sx: 616,
            sy: 208,
            sw: 16,
            sh: 24,
        };
        ctx.save()
        ctx.scale(-1, 1)
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            -rounded_position.x - player_char.width, rounded_position.y, player_char.width, player_char.height
        );
        ctx.restore();
    }
}

function draw_block() {
    for (let i = 0; i < block.length; i++) {
        ctx.fillStyle = 'brown';
        ctx.fillRect(block[i].x - player_char.x + canvas.width / 2 - player_char.width / 2, block[i].y, block[i].width, block[i].height)
    }
}

let pressedKeys = {};
let logged_a_d_keypress = 'none';
document.addEventListener('keydown', function (event) {
    pressedKeys[event.key] = true;
});
document.addEventListener('keyup', function (event) {
    pressedKeys[event.key] = false;
});

let onGround = false;

function update_player_char() {
    player_char.dy += gravity
    player_char.x += player_char.dx;
    player_char.dx *= player_char.friction;
    for (let i = 0; i < block.length; i++) {
        if (check_collision(player_char, block[i])) {
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
        onGround = false;
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
    banana.forEach((banana_element, index) => {
        if (check_collision(player_char, banana_element)) {
            banana.splice(index, 1);
            score += 100;
        }
    });
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
    update_animation();
    draw_player_char();
    draw_block();
    draw_bananas();
    draw_score();
}

setInterval(draw_game, 16);