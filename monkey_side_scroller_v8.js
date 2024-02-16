const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.append(canvas);
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const graphics = new Image();
graphics.src = "https://opengameart.org/sites/default/files/monkeylad_further.png"
//ctx.drawImage(graphics, 448, 208, 16, 24, 0,0, 16, 24)

let controls = {
    left: false,
    right: false,
    up: false,
    down: false
};

let human = true;
let edit_mode = true;

let tile_canvas = document.createElement('canvas');

// let graphics_loader = function(){
//     console.log('hi')
// }
// let foo = graphics_loader;
// foo();

graphics.onload = function(){
    tile_canvas.width = graphics.width;
    tile_canvas.height = graphics.height;
    let ttx = tile_canvas.getContext('2d');
    ttx.drawImage(graphics, 0,0);
    document.body.append(tile_canvas);
}

function updateControlsForHuman() {
    controls.right = pressedKeys['d'];
    controls.left = pressedKeys['a'];
    controls.up = pressedKeys['w'];
    controls.down = pressedKeys['s'];
}

let player_state = 'start';

function updateControlsForRobot() {
    switch (player_state) {
        case 'start':
            if (onGround && player_char.x === 0 && player_char.y === 484) {
                controls.right = true;
                player_state = 'got_first_banana';
                console.log('1st');
            }
            break;

        case 'got_first_banana':
            if (player_char.x <= 155 && player_char.x > block[3].x + block[3].width && player_char.y === 540 - player_char.height && onGround) {
                controls.left = true;
                controls.up = true;
                controls.right = false;
                player_state = 'on_block_3';
                console.log('2nd')
            }
            break;

        case 'on_block_3':
            if (player_char.x <= block[3].x + block[3].width && player_char.x >= block[3].x + (block[3].width / 3) && player_char.y === block[3].y - player_char.height) {
                controls.up = false;
                controls.left = true;
                player_state = 'centering_block_3';
                console.log('3th');
            }
            break;

        case 'centering_block_3':
            if (player_char.x < block[3].x + 2 * (block[3].width / 3)) {
                controls.left = false;
                player_state = 'centered_block_3_moving_4'
                controls.right = true;
                controls.up = true;
                console.log('4th');
            }
            break;
        case 'centered_block_3_moving_4':
            if (player_char.x > block[3].x + block[3].width) {
                controls.right = false;
                controls.up = false;
                player_state = 'on_block_4'
                console.log('5th');
            }
            break;
        case 'on_block_4':
            if (player_char.x < block[4].x && onGround) {
                controls.right = true;
                player_state = 'centering_block_4'
                console.log('6th')
            }
            break;
        case 'centering_block_4':
            if (player_char.x > block[4].x) {
                controls.right = false;
                player_state = 'centered_block_4_moving_block_5'
                controls.left = true;
                controls.up = true;
                console.log('7th')
            }
            break;
        case 'centered_block_4_moving_block_5':
            if (player_char.x <= block[5].x + block[5].width) {
                controls.up = false;
                controls.left = false;
                player_state = 'to_block_6';
                console.log('8th');
            }
            break;
        case 'to_block_6':
            controls.up = true;
            player_state = 'jumping_to_block_6'
            console.log('9th');
            break;
        case 'jumping_to_block_6':
            if (player_char.y + player_char.height <= block[6].y) {
                controls.left = true;
                player_state = 'stopping_on_block_6'
                console.log('10th')
            }
            break;
        case 'stopping_on_block_6':
            if (player_char.x <= block[6].x + block[6].width) {
                controls.up = false;
                controls.left = false;
                player_state = 'jump_banana2'
                console.log('11th')
            }
            break;
        case 'jump_banana2':
            controls.up = true;
            player_state = 'stop_jumping_on_6'
            console.log('12th')
            break;
        case 'stop_jumping_on_6':
            controls.up = false;
            player_state = 'to_block_7';
            console.log('13th')
            break;
        case 'to_block_7':
            if (player_char.x < block[7].x - (block[7].x - (block[6].x + block[6].width)) / 2 - 60) {
                controls.right = true;
                controls.up = true;
                player_state = 'landing_on_7';
                console.log('14th');
            }
            break;
        case 'landing_on_7':
            if (player_char.x >= block[7].x - (block[7].x - (block[6].x + block[6].width)) / 2) {
                controls.right = false;
                controls.up = false;
                player_state = 'walk_ledge_7';
                console.log('15th');
            }
            break;
        case 'walk_ledge_7':
            if (player_char.x > block[7].x - player_char.width) {
                controls.right = true;
                player_state = 'stop_ledge_7'
                console.log('16th')
            }
            break;
        case 'stop_ledge_7':
            if (player_char.x >= block[7].x + block[7].width - 25) {
                controls.right = false;
                player_state = 'walk_to_banana_4'
                console.log('17th')
            }
            break;
        case 'walk_to_banana_4':
            if (player_char.y == block[2].y - player_char.height) {
                controls.right = true;
                player_state = 'jump_banana_4';
                console.log('18th');
            }
            break;
        case 'jump_banana_4':
            if (player_char.x >= 340) {
                controls.up = true;
                player_state = 'walk_to_banana_5';
                console.log('19th');
            }
            break;
        case 'walk_to_banana_5':
            if (player_char.x >= 460) {
                controls.right = false;
                controls.up = false;
                player_state = 'jump_to_block_8';
                console.log('20th')
            }
        case 'jump_to_block_8':
            controls.up = true;
            controls.right = true;
            player_state = 'jumping_to_block_8';
            console.log('21st');
            break;
        case 'jumping_to_block_8':
            if (player_char.x >= 515) {
                controls.right = false;
                player_state = 'landing_8'
                console.log('22nd')
            }
            break;
        case 'landing_8':
            if (player_char.x >= 535 && player_char.y <= 540 - player_char.height - 60) {
                controls.right = true;
            }
            if (player_char.x >= 570 + 45) {
                controls.right = false;
            }
            if (controls.right == false && player_char.y <= block[8].y - player_char.height - 30) {
                player_state = 'on_block_9';
            }
            console.log('23rd');
            break;
        case 'on_block_9':
            if (player_char.x >= 630 && player_char.x <= 645 && player_char.y <= block[9].y - player_char.height - 86) {
                controls.right = true;
            }
            if (player_char.x >= 680) {
                controls.right = false;
            }
            if (controls.right == false && player_char.x >= 680 && player_char.y <= block[10].y - player_char.height - 30) {
                player_state = "on_block_10";
            }
            console.log('24th');
            break;
        case 'on_block_10':
            if (player_char.x >= 700 && player_char.y <= block[10].y + 30) {
                controls.right = true;
                player_state = 'jumping_to_block_11';
                console.log('25th');
            }
            break;
        case 'jumping_to_block_11':
            if (player_char.x >= 750) {
                controls.right = false;
                controls.up = false;
                player_state = "on_block_11";
                console.log('26th')
            }
            break;
        case 'on_block_11':
            if (player_char.x >= 770 && player_char.y == block[11].y - player_char.height) {
                controls.right = true;
            }
            if (player_char.x >= 780) {
                controls.right = false;
                player_state = 'jumping_to_block_12';
                console.log('27th');
            }
            break;
        case 'jumping_to_block_12':
            if (player_char.x >= 790 && player_char.x <= block[12].x + (block[12].x - block[11].x) / 2) {
                controls.up = true;
                controls.right = true;
            }
            if (player_char.x > block[12].x + (block[12].x - block[11].x) / 2 - 100) {
                controls.right = false;
                controls.up = false;
                player_state = 'on_block_12';
                console.log('28th')
            }
            break;
        case 'on_block_12':
            if (player_char.x >= block[12].x - player_char.width && player_char.x < block[12].x + block[12].width && onGround == true) {
                controls.up = true;
                controls.right = true;
            }
            if (player_char.x >= block[13].x - 30) {
                controls.up = false;
                controls.right = false;
                player_state = 'on_block_13';
                console.log('29th')
            }
            break;
        case 'on_block_13':
            if (player_char.x > block[13].x - player_char.width && player_char.x <= block[13].x + 30 & onGround == true) {
                controls.up = true;
                controls.right = true;
            }
            if (player_char.x >= block[2].x) {
                controls.up = false;
                controls.right = false;
                player_state = 'on_block_2';
                console.log('30th');
            }
            break;
        case 'on_block_2':
            if (onGround && player_char.x >= block[2].x) {
                controls.right = true;
            }
            if (player_char.x >= block[2].x + block[2].width - player_char.width - 50) {
                controls.right = false;
                controls.up = true;
            }
            if (win_status == true) {
                controls.up = false;
                console.log('31st');
            }
            break;

    }
}



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
    { x: 50, y: 230, width: 30, height: 30 },
    { x: 190, y: 240, width: 70, height: 30 },
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

let startTime = null;

function startGameTimer() {
    startTime = performance.now();
}

function getGameTime() {
    if (startTime === null) {
        return 0;
    }
    let currentTime = performance.now();
    return Math.floor((currentTime - startTime) / 1000);
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

    if (controls.left === true) {
        logged_a_d_keypress = 'a';
    } else if (controls.right === true) {
        logged_a_d_keypress = 'd';
    }

    if (controls.left === true || controls.right === true) {
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

    if (controls.left === true && onGround === true) {
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            -rounded_position.x - player_char.width, rounded_position.y, player_char.width, player_char.height
        );
        ctx.restore();
    } else if (controls.left === true && onGround === false) {
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
    else if (controls.right === true && onGround === true) {
        ctx.drawImage(
            graphics,
            frame.sx, frame.sy, frame.sw, frame.sh,
            rounded_position.x, rounded_position.y, player_char.width, player_char.height
        );
    } else if (controls.right === true && onGround === false) {
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
canvas.addEventListener('mousedown', function (event) {
    if (edit_mode) {
        block.push({ x: event.offsetX + player_char.x - canvas.width / 2 + player_char.width / 2, y: event.offsetY, width: 30, height: 30 })
        console.log(event.x, event.y);
    }
});

tile_canvas.addEventListener('mousedown', function (event) {
    console.log('tile click')
});
//use mouse down to start creation of block, 'mouseup' to create the size

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

    if (controls.left === true) {
        player_char.dx -= player_char.speed;
    }
    if (controls.down === true) {
        player_char.dy += player_char.speed;
    }
    if (controls.right === true) {
        player_char.dx += player_char.speed;
    }
    if (controls.up === true && onGround) {
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

win_status = false;
function draw_game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (human === true) {
        updateControlsForHuman();
    } else {
        updateControlsForRobot();
    }
    update_player_char();
    update_animation();
    draw_player_char();
    draw_block();
    draw_bananas();
    draw_score();
    if (startTime !== null) {
        let gameTime = getGameTime();
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        ctx.fillText('Time: ' + gameTime + 's', 20, 30);
    }
    if (score === 600) {
        startTime = null;
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        win_status = true;
        ctx.fillText('You won!', canvas.width / 2 - 40, canvas.height / 2);
    }
}
startGameTimer();
setInterval(draw_game, 16);