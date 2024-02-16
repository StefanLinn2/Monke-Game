const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.append(canvas);
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;
const graphics = new Image();
graphics.src = "https://opengameart.org/sites/default/files/monkeylad_further.png"
graphics.onload = function () {
    tile_canvas.width = graphics.width;
    tile_canvas.height = graphics.height;
    let ttx = tile_canvas.getContext('2d');
    ttx.drawImage(graphics, 0, 0);
    document.body.append(tile_canvas);
}

let tile_canvas = document.createElement('canvas');

let human = true;
let edit_mode = false;

let controls = {
    left: false,
    right: false,
    up: false,
    down: false
};

function updateControlsForHuman() {
    for (let i = 0; i < player_char.length; i++) {
        if (player_char[i].human) {
            player_char[i].right = pressedKeys['d'];
            player_char[i].left = pressedKeys['a'];
            player_char[i].up = pressedKeys['w'];
            player_char[i].down = pressedKeys['s'];
        }
    }
}

function updateControlsForRobot() {
    for (let i = 0; i < player_char.length; i++) {
        if (player_char[i].human === false) {
            switch (player_char[i].state) {
                case 'start':
                    if (player_char[i].onGround && player_char[i].x === 0 && player_char[i].y === 484) {
                        player_char[i].right = true;
                        player_char[i].state = 'got_first_banana';
                        console.log('1st');
                    }
                    break;

                case 'got_first_banana':
                    if (player_char[i].x <= 155 && player_char[i].x > block[3].x + block[3].width && player_char[i].y === 540 - player_char[i].height && player_char[i].onGround) {
                        player_char[i].left = true;
                        player_char[i].up = true;
                        player_char[i].right = false;
                        player_char[i].state = 'on_block_3';
                        console.log('2nd')
                    }
                    break;

                case 'on_block_3':
                    if (player_char[i].x <= block[3].x + block[3].width && player_char[i].x >= block[3].x + (block[3].width / 3) && player_char[i].y === block[3].y - player_char[i].height) {
                        player_char[i].up = false;
                        player_char[i].left = true;
                        player_char[i].state = 'centering_block_3';
                        console.log('3th');
                    }
                    break;

                case 'centering_block_3':
                    if (player_char[i].x < block[3].x + 2 * (block[3].width / 3)) {
                        player_char[i].left = false;
                        player_char[i].state = 'centered_block_3_moving_4'
                        player_char[i].right = true;
                        player_char[i].up = true;
                        console.log('4th');
                    }
                    break;
                case 'centered_block_3_moving_4':
                    if (player_char[i].x > block[3].x + block[3].width) {
                        player_char[i].right = false;
                        player_char[i].up = false;
                        player_char[i].state = 'on_block_4'
                        console.log('5th');
                    }
                    break;
                case 'on_block_4':
                    if (player_char[i].x < block[4].x && player_char[i].onGround) {
                        player_char[i].right = true;
                        player_char[i].state = 'centering_block_4'
                        console.log('6th')
                    }
                    break;
                case 'centering_block_4':
                    if (player_char[i].x > block[4].x) {
                        player_char[i].right = false;
                        player_char[i].state = 'centered_block_4_moving_block_5'
                        player_char[i].left = true;
                        player_char[i].up = true;
                        console.log('7th')
                    }
                    break;
                case 'centered_block_4_moving_block_5':
                    if (player_char[i].x <= block[5].x + block[5].width) {
                        player_char[i].up = false;
                        player_char[i].left = false;
                        player_char[i].state = 'to_block_6';
                        console.log('8th');
                    }
                    break;
                case 'to_block_6':
                    player_char[i].up = true;
                    player_char[i].state = 'jumping_to_block_6'
                    console.log('9th');
                    break;
                case 'jumping_to_block_6':
                    if (player_char[i].y + player_char[i].height <= block[6].y) {
                        player_char[i].left = true;
                        player_char[i].state = 'stopping_on_block_6'
                        console.log('10th')
                    }
                    break;
                case 'stopping_on_block_6':
                    if (player_char[i].x <= block[6].x + block[6].width) {
                        player_char[i].up = false;
                        player_char[i].left = false;
                        player_char[i].state = 'jump_banana2'
                        console.log('11th')
                    }
                    break;
                case 'jump_banana2':
                    player_char[i].up = true;
                    player_char[i].state = 'stop_jumping_on_6'
                    console.log('12th')
                    break;
                case 'stop_jumping_on_6':
                    player_char[i].up = false;
                    player_char[i].state = 'to_block_7';
                    console.log('13th')
                    break;
                case 'to_block_7':
                    if (player_char[i].x < block[7].x - (block[7].x - (block[6].x + block[6].width)) / 2 - 60) {
                        player_char[i].right = true;
                        player_char[i].up = true;
                        player_char[i].state = 'landing_on_7';
                        console.log('14th');
                    }
                    break;
                case 'landing_on_7':
                    if (player_char[i].x >= block[7].x - (block[7].x - (block[6].x + block[6].width)) / 2) {
                        player_char[i].right = false;
                        player_char[i].up = false;
                        player_char[i].state = 'walk_ledge_7';
                        console.log('15th');
                    }
                    break;
                case 'walk_ledge_7':
                    if (player_char[i].x > block[7].x - player_char[i].width) {
                        player_char[i].right = true;
                        player_char[i].state = 'stop_ledge_7'
                        console.log('16th')
                    }
                    break;
                case 'stop_ledge_7':
                    if (player_char[i].x >= block[7].x + block[7].width - 25) {
                        player_char[i].right = false;
                        player_char[i].state = 'walk_to_banana_4'
                        console.log('17th')
                    }
                    break;
                case 'walk_to_banana_4':
                    if (player_char[i].y == block[2].y - player_char[i].height) {
                        player_char[i].right = true;
                        player_char[i].state = 'jump_banana_4';
                        console.log('18th');
                    }
                    break;
                case 'jump_banana_4':
                    if (player_char[i].x >= 340) {
                        player_char[i].up = true;
                        player_char[i].state = 'walk_to_banana_5';
                        console.log('19th');
                    }
                    break;
                case 'walk_to_banana_5':
                    if (player_char[i].x >= 460) {
                        player_char[i].right = false;
                        player_char[i].up = false;
                        player_char[i].state = 'jump_to_block_8';
                        console.log('20th')
                    }
                    break;
                case 'jump_to_block_8':
                    player_char[i].up = true;
                    player_char[i].right = true;
                    player_char[i].state = 'jumping_to_block_8';
                    console.log('21st');
                    break;
                case 'jumping_to_block_8':
                    if (player_char[i].x >= 515) {
                        player_char[i].right = false;
                        player_char[i].state = 'landing_8'
                        console.log('22nd')
                    }
                    break;
                case 'landing_8':
                    if (player_char[i].x >= 535 && player_char[i].y <= 540 - player_char[i].height - 60) {
                        player_char[i].right = true;
                    }
                    if (player_char[i].x >= 570 + 45) {
                        player_char[i].right = false;
                    }
                    if (player_char[i].right == false && player_char[i].y <= block[8].y - player_char[i].height - 30) {
                        player_char[i].state = 'on_block_9';
                    }
                    console.log('23rd');
                    break;
                    //update line
                case 'on_block_9':
                    if (player_char[i].x >= 630 && player_char[i].x <= 645 && player_char[i].y <= block[9].y - player_char[i].height - 86) {
                        player_char[i].right = true;
                    }
                    if (player_char[i].x >= 680) {
                        player_char[i].right = false;
                    }
                    if (player_char[i].right == false && player_char[i].x >= 680 && player_char[i].y <= block[10].y - player_char[i].height - 30) {
                        player_char[i].state = "on_block_10";
                    }
                    console.log('24th');
                    break;
                case 'on_block_10':
                    if (player_char[i].x >= 700 && player_char[i].y <= block[10].y + 30) {
                        player_char[i].right = true;
                        player_char[i].state = 'jumping_to_block_11';
                        console.log('25th');
                    }
                    break;
                case 'jumping_to_block_11':
                    if (player_char[i].x >= 750) {
                        player_char[i].right = false;
                        player_char[i].up = false;
                        player_char[i].state = "on_block_11";
                        console.log('26th')
                    }
                    break;
                case 'on_block_11':
                    if (player_char[i].x >= 770 && player_char[i].y == block[11].y - player_char[i].height) {
                        player_char[i].right = true;
                    }
                    if (player_char[i].x >= 780) {
                        player_char[i].right = false;
                        player_char[i].state = 'jumping_to_block_12';
                        console.log('27th');
                    }
                    break;
                case 'jumping_to_block_12':
                    if (player_char[i].x >= 790 && player_char[i].x <= block[12].x + (block[12].x - block[11].x) / 2) {
                        player_char[i].up = true;
                        player_char[i].right = true;
                    }
                    if (player_char[i].x > block[12].x + (block[12].x - block[11].x) / 2 - 100) {
                        player_char[i].right = false;
                        player_char[i].up = false;
                        player_char[i].state = 'on_block_12';
                        console.log('28th')
                    }
                    break;
                case 'on_block_12':
                    if (player_char[i].x >= block[12].x - player_char[i].width && player_char[i].x < block[12].x + block[12].width && player_char[i].onGround == true) {
                        player_char[i].up = true;
                        player_char[i].right = true;
                    }
                    if (player_char[i].x >= block[13].x - 30) {
                        player_char[i].up = false;
                        player_char[i].right = false;
                        player_char[i].state = 'on_block_13';
                        console.log('29th')
                    }
                    break;
                case 'on_block_13':
                    if (player_char[i].x > block[13].x - player_char[i].width && player_char[i].x <= block[13].x + 30 & player_char[i].onGround == true) {
                        player_char[i].up = true;
                        player_char[i].right = true;
                    }
                    if (player_char[i].x >= block[2].x) {
                        player_char[i].up = false;
                        player_char[i].right = false;
                        player_char[i].state = 'on_block_2';
                        console.log('30th');
                    }
                    break;
                case 'on_block_2':
                    if (player_char[i].onGround && player_char[i].x >= block[2].x) {
                        player_char[i].right = true;
                    }
                    if (player_char[i].x >= block[2].x + block[2].width - player_char[i].width - 50) {
                        player_char[i].right = false;
                        player_char[i].up = true;
                    }
                    if (win_status == true) {
                        player_char[i].up = false;
                        console.log('31st');
                    }
                    break;

            }
        }
    }
}

let player_char = [
    {
        human: true,
        x: 100,
        y: 0,
        width: 32,
        height: 56,
        speed: 1.5,
        dx: 0,
        dy: 0,
        friction: 0.75,
        left: false,
        right: false,
        up: false,
        down: false,
        onGround: false,
        logged_a_d_keypress: null,
        state: 'start',
    }
    ,
    {
        human: false,
        x: 0,
        y: 0,
        width: 32,
        height: 56,
        speed: 1.5,
        dx: 0,
        dy: 0,
        friction: 0.75,
        left: false,
        right: false,
        up: false,
        down: false,
        onGround: false,
        logged_a_d_keypress: null,
        state: 'start',
    }
    ,
    {
        human: false,
        x: 0,
        y: 0,
        width: 32,
        height: 56,
        speed: 1.5,
        dx: 0,
        dy: 0,
        friction: 0.75,
        left: false,
        right: false,
        up: false,
        down: false,
        onGround: false,
        logged_a_d_keypress: null,
        state: 'start',
    }
]

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
        ctx.fillRect(
            banana[i].x - camera_position,
            banana[i].y,
            banana[i].width,
            banana[i].height);
    };
}

let score = 0;

function draw_score() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 210 + canvas.width / 2 - player_char[0].width / 2, 30);
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

let camera_position = 0;
//this is a placeholder, the actual camera position is defined in draw_game
function draw_player_char() {
    for (let i = 0; i < player_char.length; i++) {
        let rounded_position = {
            x: Math.round(player_char[i].x - camera_position),
            y: Math.round(player_char[i].y)
        };
        let frame;

        if (player_char[i].left === true) {
            player_char[i].logged_a_d_keypress = 'a';
        } else if (player_char[i].right === true) {
            player_char[i].logged_a_d_keypress = 'd';
        }

        if (player_char[i].left === true || player_char[i].right === true) {
            frame = sprite_frames[current_frame];
        } else if (player_char[i].logged_a_d_keypress === 'd' && player_char[i].onGround === true) {
            frame = {
                sx: 448 + 16,
                sy: 208,
                sw: 16,
                sh: 24
            };
            ctx.drawImage(
                graphics,
                frame.sx, frame.sy, frame.sw, frame.sh,
                rounded_position.x, rounded_position.y, player_char[i].width, player_char[i].height
            );
        } else if (player_char[i].logged_a_d_keypress === 'd' && player_char[i].onGround === false) {
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
                -(rounded_position.x + player_char[i].width), rounded_position.y, player_char[i].width, player_char[i].height
            );
            ctx.restore();
        } else if (player_char[i].logged_a_d_keypress === 'a' && player_char[i].onGround === true) {
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
                -(rounded_position.x + player_char[i].width), rounded_position.y, player_char[i].width, player_char[i].height
            );
            ctx.restore();
        } else if (player_char[i].logged_a_d_keypress === 'a' && player_char[i].onGround === false) {
            frame = {
                sx: 616,
                sy: 208,
                sw: 16,
                sh: 24,
            };
            ctx.drawImage(
                graphics,
                frame.sx, frame.sy, frame.sw, frame.sh,
                rounded_position.x, rounded_position.y, player_char[i].width, player_char[i].height
            );
        } else if (player_char[i].logged_a_d_keypress === null) {
            frame = {
                sx: 448,
                sy: 208,
                sw: 16,
                sh: 24
            };
            ctx.drawImage(
                graphics,
                frame.sx, frame.sy, frame.sw, frame.sh,
                rounded_position.x, rounded_position.y, player_char[i].width, player_char[i].height
            );
        }

        if (player_char[i].left === true && player_char[i].onGround === true) {
            ctx.save();
            ctx.scale(-1, 1);
            ctx.drawImage(
                graphics,
                frame.sx, frame.sy, frame.sw, frame.sh,
                -rounded_position.x - player_char[i].width, rounded_position.y, player_char[i].width, player_char[i].height
            );
            ctx.restore();
        } else if (player_char[i].left === true && player_char[i].onGround === false) {
            frame = {
                sx: 616,
                sy: 208,
                sw: 16,
                sh: 24,
            };
            ctx.drawImage(
                graphics,
                frame.sx, frame.sy, frame.sw, frame.sh,
                rounded_position.x, rounded_position.y, player_char[i].width, player_char[i].height
            );
        } else if (player_char[i].right === true && player_char[i].onGround === true) {
            ctx.drawImage(
                graphics,
                frame.sx, frame.sy, frame.sw, frame.sh,
                rounded_position.x, rounded_position.y, player_char[i].width, player_char[i].height
            );
        } else if (player_char[i].right === true && player_char[i].onGround === false) {
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
                -rounded_position.x - player_char[i].width, rounded_position.y, player_char[i].width, player_char[i].height
            );
            ctx.restore();
        }
    }
}


function draw_block() {
    for (let i = 0; i < block.length; i++) {
        ctx.fillStyle = 'brown';
        ctx.fillRect(
            block[i].x - camera_position,
            block[i].y,
            block[i].width,
            block[i].height)
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
        block.push({ x: event.offsetX + player_char[0].x - canvas.width / 2 + player_char[0].width / 2, y: event.offsetY, width: 30, height: 30 })
        console.log(event.x, event.y);
    }
});

tile_canvas.addEventListener('mousedown', function (event) {
    console.log('tile click')
});
//use mouse down to start creation of block, 'mouseup' to create the size

let onGround = false;

function update_player_char() {
    for (let i = 0; i < player_char.length; i++) {
        player_char[i].dy += gravity;
        player_char[i].x += player_char[i].dx;
        player_char[i].dx *= player_char[i].friction;

        for (let j = 0; j < block.length; j++) {
            if (check_collision(player_char[i], block[j])) {
                if (player_char[i].dx > 0) {
                    player_char[i].x = block[j].x - player_char[i].width;
                    player_char[i].dx = 0;
                }
                if (player_char[i].dx < 0) {
                    player_char[i].x = block[j].x + block[j].width;
                    player_char[i].dx = 0;
                }
            }
        }

        player_char[i].y += player_char[i].dy;

        for (let j = 0; j < block.length; j++) {
            if (check_collision(player_char[i], block[j])) {
                if (player_char[i].dy > 0) {
                    player_char[i].y = block[j].y - player_char[i].height;
                    player_char[i].dy = 0;
                    player_char[i].onGround = true;
                }
                if (player_char[i].dy < 0) {
                    player_char[i].y = block[j].y + block[j].height;
                    player_char[i].dy = 0;
                }
            }
        }

        if (player_char[i].left === true) {
            player_char[i].dx -= player_char[i].speed;
        }
        if (player_char[i].down === true) {
            player_char[i].dy += player_char[i].speed;
        }
        if (player_char[i].right === true) {
            player_char[i].dx += player_char[i].speed;
        }
        if (player_char[i].up === true && player_char[i].onGround) {
            player_char[i].dy = -10;
            player_char[i].onGround = false;
        }

        if (player_char[i].y < 0) {
            player_char[i].y = 0;
            player_char[i].dy = 0;
        } else if (player_char[i].y >= canvas.height) {
            player_char[i].y = canvas.height;
            ctx.fillStyle = 'black';
            ctx.font = '20px Arial';
            ctx.fillText('you ded', canvas.width / 2 - 20, canvas.height / 2);
        }
        banana.forEach((banana_element, index) => {
            if (check_collision(player_char[i], banana_element)) {
                banana.splice(index, 1);
                score += 100;
            }
        });
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

win_status = false;
function draw_game() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // if (human === true) {
    //     updateControlsForHuman();
    // } else {
    //     updateControlsForRobot();
    // }
    updateControlsForHuman();
    updateControlsForRobot();
    update_player_char();
    update_animation();
    camera_position = Math.round(player_char[0].x - canvas.width / 2 + player_char[0].width / 2);
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