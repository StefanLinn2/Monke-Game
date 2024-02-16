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

function updateControlsForHuman(player) {
    player.right = pressedKeys['d'];
    player.left = pressedKeys['a'];
    player.up = pressedKeys['w'];
    player.down = pressedKeys['s'];

}

function updateControlsForRobot(robot) {
    switch (robot.state) {
        case 'start':
            if (robot.onGround && robot.x === 0 && robot.y === 484) {
                robot.right = true;
                robot.state = 'got_first_banana';
                console.log('1st');
            }
            break;

        case 'got_first_banana':
            if (robot.x <= 155 && robot.x > block[3].x + block[3].width && robot.y === 540 - robot.height && robot.onGround) {
                robot.left = true;
                robot.up = true;
                robot.right = false;
                robot.state = 'on_block_3';
                console.log('2nd')
            }
            break;

        case 'on_block_3':
            if (robot.x <= block[3].x + block[3].width && robot.x >= block[3].x + (block[3].width / 3) && robot.y === block[3].y - robot.height) {
                robot.up = false;
                robot.left = true;
                robot.state = 'centering_block_3';
                console.log('3th');
            }
            break;

        case 'centering_block_3':
            if (robot.x < block[3].x + 2 * (block[3].width / 3)) {
                robot.left = false;
                robot.state = 'centered_block_3_moving_4'
                robot.right = true;
                robot.up = true;
                console.log('4th');
            }
            break;
        case 'centered_block_3_moving_4':
            if (robot.x > block[3].x + block[3].width) {
                robot.right = false;
                robot.up = false;
                robot.state = 'on_block_4'
                console.log('5th');
            }
            break;
        case 'on_block_4':
            if (robot.x < block[4].x && robot.onGround) {
                robot.right = true;
                robot.state = 'centering_block_4'
                console.log('6th')
            }
            break;
        case 'centering_block_4':
            if (robot.x > block[4].x) {
                robot.right = false;
                robot.state = 'centered_block_4_moving_block_5'
                robot.left = true;
                robot.up = true;
                console.log('7th')
            }
            break;
        case 'centered_block_4_moving_block_5':
            if (robot.x <= block[5].x + block[5].width) {
                robot.up = false;
                robot.left = false;
                robot.state = 'to_block_6';
                console.log('8th');
            }
            break;
        case 'to_block_6':
            robot.up = true;
            robot.state = 'jumping_to_block_6'
            console.log('9th');
            break;
        case 'jumping_to_block_6':
            if (robot.y + robot.height <= block[6].y) {
                robot.left = true;
                robot.state = 'stopping_on_block_6'
                console.log('10th')
            }
            break;
        case 'stopping_on_block_6':
            if (robot.x <= block[6].x + block[6].width) {
                robot.up = false;
                robot.left = false;
                robot.state = 'jump_banana2'
                console.log('11th')
            }
            break;
        case 'jump_banana2':
            robot.up = true;
            robot.state = 'stop_jumping_on_6'
            console.log('12th')
            break;
        case 'stop_jumping_on_6':
            robot.up = false;
            robot.state = 'to_block_7';
            console.log('13th')
            break;
        case 'to_block_7':
            if (robot.x < block[7].x - (block[7].x - (block[6].x + block[6].width)) / 2 - 60) {
                robot.right = true;
                robot.up = true;
                robot.state = 'landing_on_7';
                console.log('14th');
            }
            break;
        case 'landing_on_7':
            if (robot.x >= block[7].x - (block[7].x - (block[6].x + block[6].width)) / 2) {
                robot.right = false;
                robot.up = false;
                robot.state = 'walk_ledge_7';
                console.log('15th');
            }
            break;
        case 'walk_ledge_7':
            if (robot.x > block[7].x - robot.width) {
                robot.right = true;
                robot.state = 'stop_ledge_7'
                console.log('16th')
            }
            break;
        case 'stop_ledge_7':
            if (robot.x >= block[7].x + block[7].width - 25) {
                robot.right = false;
                robot.state = 'walk_to_banana_4'
                console.log('17th')
            }
            break;
        case 'walk_to_banana_4':
            if (robot.y == block[2].y - robot.height) {
                robot.right = true;
                robot.state = 'jump_banana_4';
                console.log('18th');
            }
            break;
        case 'jump_banana_4':
            if (robot.x >= 340) {
                robot.up = true;
                robot.state = 'walk_to_banana_5';
                console.log('19th');
            }
            break;
        case 'walk_to_banana_5':
            if (robot.x >= 460) {
                robot.right = false;
                robot.up = false;
                robot.state = 'jump_to_block_8';
                console.log('20th')
            }
            break;
        case 'jump_to_block_8':
            robot.up = true;
            robot.right = true;
            robot.state = 'jumping_to_block_8';
            console.log('21st');
            break;
        case 'jumping_to_block_8':
            if (robot.x >= 515) {
                robot.right = false;
                robot.state = 'landing_8'
                console.log('22nd')
            }
            break;
        case 'landing_8':
            if (robot.x >= 535 && robot.y <= 540 - robot.height - 60) {
                robot.right = true;
            }
            if (robot.x >= 570 + 45) {
                robot.right = false;
            }
            if (robot.right == false && robot.y <= block[8].y - robot.height - 30) {
                robot.state = 'on_block_9';
            }
            console.log('23rd');
            break;
        //update line
        case 'on_block_9':
            if (robot.x >= 630 && robot.x <= 645 && robot.y <= block[9].y - robot.height - 86) {
                robot.right = true;
            }
            if (robot.x >= 680) {
                robot.right = false;
            }
            if (robot.right == false && robot.x >= 680 && robot.y <= block[10].y - robot.height - 30) {
                robot.state = "on_block_10";
            }
            console.log('24th');
            break;
        case 'on_block_10':
            if (robot.x >= 700 && robot.y <= block[10].y + 30) {
                robot.right = true;
                robot.state = 'jumping_to_block_11';
                console.log('25th');
            }
            break;
        case 'jumping_to_block_11':
            if (robot.x >= 750) {
                robot.right = false;
                robot.up = false;
                robot.state = "on_block_11";
                console.log('26th')
            }
            break;
        case 'on_block_11':
            if (robot.x >= 770 && robot.y == block[11].y - robot.height) {
                robot.right = true;
            }
            if (robot.x >= 780) {
                robot.right = false;
                robot.state = 'jumping_to_block_12';
                console.log('27th');
            }
            break;
        case 'jumping_to_block_12':
            if (robot.x >= 790 && robot.x <= block[12].x + (block[12].x - block[11].x) / 2) {
                robot.up = true;
                robot.right = true;
            }
            if (robot.x > block[12].x + (block[12].x - block[11].x) / 2 - 100) {
                robot.right = false;
                robot.up = false;
                robot.state = 'on_block_12';
                console.log('28th')
            }
            break;
        case 'on_block_12':
            if (robot.x >= block[12].x - robot.width && robot.x < block[12].x + block[12].width && robot.onGround == true) {
                robot.up = true;
                robot.right = true;
            }
            if (robot.x >= block[13].x - 30) {
                robot.up = false;
                robot.right = false;
                robot.state = 'on_block_13';
                console.log('29th')
            }
            break;
        case 'on_block_13':
            if (robot.x > block[13].x - robot.width && robot.x <= block[13].x + 30 & robot.onGround == true) {
                robot.up = true;
                robot.right = true;
            }
            if (robot.x >= block[2].x) {
                robot.up = false;
                robot.right = false;
                robot.state = 'on_block_2';
                console.log('30th');
            }
            break;
        case 'on_block_2':
            if (robot.onGround && robot.x >= block[2].x) {
                robot.right = true;
            }
            if (robot.x >= block[2].x + block[2].width - robot.width - 50) {
                robot.right = false;
                robot.up = true;
            }
            if (win_status == true) {
                robot.up = false;
                console.log('31st');
            }
            break;

    }

}

function buildUpdateFunction(firstJump) {
    return function (robot) {
        switch (robot.state) {
            case 'start':
                if (robot.onGround && robot.x === 0 && robot.y === 484) {
                    robot.right = true;
                    robot.state = 'got_first_banana';
                    console.log('1st');
                }
                break;

            case 'got_first_banana':
                if (robot.x > firstJump && robot.y === 540 - robot.height && robot.onGround) {
                    robot.left = true;
                    robot.up = true;
                    robot.right = false;
                    robot.state = 'on_block_3';
                    console.log('2nd')
                }
                break;

            case 'on_block_3':
                if (robot.x <= block[3].x + block[3].width && robot.x >= block[3].x + (block[3].width / 3) && robot.y === block[3].y - robot.height) {
                    robot.up = false;
                    robot.left = true;
                    robot.state = 'centering_block_3';
                    console.log('3th');
                }
                break;

            case 'centering_block_3':
                if (robot.x < block[3].x + 2 * (block[3].width / 3)) {
                    robot.left = false;
                    robot.state = 'centered_block_3_moving_4'
                    robot.right = true;
                    robot.up = true;
                    console.log('4th');
                }
                break;
            case 'centered_block_3_moving_4':
                if (robot.x > block[3].x + block[3].width) {
                    robot.right = false;
                    robot.up = false;
                    robot.state = 'on_block_4'
                    console.log('5th');
                }
                break;
            case 'on_block_4':
                if (robot.x < block[4].x && robot.onGround) {
                    robot.right = true;
                    robot.state = 'centering_block_4'
                    console.log('6th')
                }
                break;
            case 'centering_block_4':
                if (robot.x > block[4].x) {
                    robot.right = false;
                    robot.state = 'centered_block_4_moving_block_5'
                    robot.left = true;
                    robot.up = true;
                    console.log('7th')
                }
                break;
            case 'centered_block_4_moving_block_5':
                if (robot.x <= block[5].x + block[5].width) {
                    robot.up = false;
                    robot.left = false;
                    robot.state = 'to_block_6';
                    console.log('8th');
                }
                break;
            case 'to_block_6':
                robot.up = true;
                robot.state = 'jumping_to_block_6'
                console.log('9th');
                break;
            case 'jumping_to_block_6':
                if (robot.y + robot.height <= block[6].y) {
                    robot.left = true;
                    robot.state = 'stopping_on_block_6'
                    console.log('10th')
                }
                break;
            case 'stopping_on_block_6':
                if (robot.x <= block[6].x + block[6].width) {
                    robot.up = false;
                    robot.left = false;
                    robot.state = 'jump_banana2'
                    console.log('11th')
                }
                break;
            case 'jump_banana2':
                robot.up = true;
                robot.state = 'stop_jumping_on_6'
                console.log('12th')
                break;
            case 'stop_jumping_on_6':
                robot.up = false;
                robot.state = 'to_block_7';
                console.log('13th')
                break;
            case 'to_block_7':
                if (robot.x < block[7].x - (block[7].x - (block[6].x + block[6].width)) / 2 - 60) {
                    robot.right = true;
                    robot.up = true;
                    robot.state = 'landing_on_7';
                    console.log('14th');
                }
                break;
            case 'landing_on_7':
                if (robot.x >= block[7].x - (block[7].x - (block[6].x + block[6].width)) / 2) {
                    robot.right = false;
                    robot.up = false;
                    robot.state = 'walk_ledge_7';
                    console.log('15th');
                }
                break;
            case 'walk_ledge_7':
                if (robot.x > block[7].x - robot.width) {
                    robot.right = true;
                    robot.state = 'stop_ledge_7'
                    console.log('16th')
                }
                break;
            case 'stop_ledge_7':
                if (robot.x >= block[7].x + block[7].width - 25) {
                    robot.right = false;
                    robot.state = 'walk_to_banana_4'
                    console.log('17th')
                }
                break;
            case 'walk_to_banana_4':
                if (robot.y == block[2].y - robot.height) {
                    robot.right = true;
                    robot.state = 'jump_banana_4';
                    console.log('18th');
                }
                break;
            case 'jump_banana_4':
                if (robot.x >= 340) {
                    robot.up = true;
                    robot.state = 'walk_to_banana_5';
                    console.log('19th');
                }
                break;
            case 'walk_to_banana_5':
                if (robot.x >= 460) {
                    robot.right = false;
                    robot.up = false;
                    robot.state = 'jump_to_block_8';
                    console.log('20th')
                }
                break;
            case 'jump_to_block_8':
                robot.up = true;
                robot.right = true;
                robot.state = 'jumping_to_block_8';
                console.log('21st');
                break;
            case 'jumping_to_block_8':
                if (robot.x >= 515) {
                    robot.right = false;
                    robot.state = 'landing_8'
                    console.log('22nd')
                }
                break;
            case 'landing_8':
                if (robot.x >= 535 && robot.y <= 540 - robot.height - 60) {
                    robot.right = true;
                }
                if (robot.x >= 570 + 45) {
                    robot.right = false;
                }
                if (robot.right == false && robot.y <= block[8].y - robot.height - 30) {
                    robot.state = 'on_block_9';
                }
                console.log('23rd');
                break;
            case 'on_block_9':
                if (robot.x >= 630 && robot.x <= 645 && robot.y <= block[9].y - robot.height - 86) {
                    robot.right = true;
                }
                if (robot.x >= 680) {
                    robot.right = false;
                }
                if (robot.right == false && robot.x >= 680 && robot.y <= block[10].y - robot.height - 30) {
                    robot.state = "on_block_10";
                }
                console.log('24th');
                break;
            case 'on_block_10':
                if (robot.x >= 700 && robot.y <= block[10].y + 30) {
                    robot.right = true;
                    robot.state = 'jumping_to_block_11';
                    console.log('25th');
                }
                break;
            case 'jumping_to_block_11':
                if (robot.x >= 750) {
                    robot.right = false;
                    robot.up = false;
                    robot.state = "on_block_11";
                    console.log('26th')
                }
                break;
            case 'on_block_11':
                if (robot.x >= 770 && robot.y == block[11].y - robot.height) {
                    robot.right = true;
                }
                if (robot.x >= 780) {
                    robot.right = false;
                    robot.state = 'jumping_to_block_12';
                    console.log('27th');
                }
                break;
            case 'jumping_to_block_12':
                if (robot.x >= 790 && robot.x <= block[12].x + (block[12].x - block[11].x) / 2) {
                    robot.up = true;
                    robot.right = true;
                }
                if (robot.x > block[12].x + (block[12].x - block[11].x) / 2 - 100) {
                    robot.right = false;
                    robot.up = false;
                    robot.state = 'on_block_12';
                    console.log('28th')
                }
                break;
            case 'on_block_12':
                if (robot.x >= block[12].x - robot.width && robot.x < block[12].x + block[12].width && robot.onGround == true) {
                    robot.up = true;
                    robot.right = true;
                }
                if (robot.x >= block[13].x - 30) {
                    robot.up = false;
                    robot.right = false;
                    robot.state = 'on_block_13';
                    console.log('29th')
                }
                break;
            case 'on_block_13':
                if (robot.x > block[13].x - robot.width && robot.x <= block[13].x + 30 & robot.onGround == true) {
                    robot.up = true;
                    robot.right = true;
                }
                if (robot.x >= block[2].x) {
                    robot.up = false;
                    robot.right = false;
                    robot.state = 'on_block_2';
                    console.log('30th');
                }
                break;
            case 'on_block_2':
                if (robot.onGround && robot.x >= block[2].x) {
                    robot.right = true;
                }
                if (robot.x >= block[2].x + block[2].width - robot.width - 50) {
                    robot.right = false;
                    robot.up = true;
                }
                if (win_status == true) {
                    robot.up = false;
                    console.log('31st');
                }
                break;

        }
    }
}

function cleanAI(robot) {
    let robotChoreography = robot.choreography;
    let action;
    let actionTime = 0;
    for (let potentialAction of robotChoreography) {
        if (typeof potentialAction === 'number') {
            actionTime += potentialAction;
        }
        else {
            actionTime++;
        }
        if (actionTime >= inGameTime) {
            action = potentialAction;
            break;
        }
    }
    if (typeof action === 'number') {
        return;
    }
    robot.up = false;
    robot.down = false;
    robot.left = false;
    robot.right = false;
    if (action === 'right') {
        robot.right = true;
    }
    if (action === 'left') {
        robot.left = true;
    }
    if (action === 'up') {
        robot.up = true;
    }
    if (action === 'down') {
        robot.down = true;
    }
}
function createRandomChoreography(length) {
    let choreography = [];
    for (let i = 0; i < length; i++) {
        if (Math.random() < 0.5) {
            choreography.push(Math.floor(10 * Math.random()) + 1);
        } else {
            let randomNumber = Math.floor(Math.random() * 4);
            if (randomNumber === 0) {
                choreography.push('right');
            }
            if (randomNumber === 1) {
                choreography.push('left');
            }
            if (randomNumber === 2) {
                choreography.push('up');
            }
            if (randomNumber === 3) {
                choreography.push('down');
            }
        }
    }
    return choreography;
}

let banana = [
    { x: 50, y: 90, width: 30, height: 30 },
    { x: 150, y: 490, width: 30, height: 30 },
    { x: 200, y: 170, width: 30, height: 30 },
    { x: 400, y: 400, width: 30, height: 30 },
    { x: 250, y: 300, width: 30, height: 30 },
    { x: 1500, y: 440, width: 30, height: 30 },
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

let player_char = [
    {
        controller: updateControlsForHuman,
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
        bananasCollected: 0,
        bananas: [...banana],
        is_alive: true,
    }
    ,

]
for (let i = 0; i < 1000; i++) {
    player_char.push(
        {
            controller: cleanAI,
            choreography: createRandomChoreography(1000),
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
            bananasCollected: 0,
            bananas: [...banana],
            is_alive: true,
        }
    )
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

let score = 0;

function draw_score() {
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 210 + canvas.width / 2 - player_char[0].width / 2, 30);
}


let inGameTime = 0;

function getGameTime() {
    return Math.round(inGameTime / 60);
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
    console.log(event.x, event.y);
});

tile_canvas.addEventListener('mousedown', function (event) {
    console.log('tile click')
});
//use mouse down to start creation of block, 'mouseup' to create the size

function findRightMostMonkey() {
    let maxIndex = -1;
    let maxX = -Infinity;
    for (let i = 0; i < player_char.length; i++) {
        if (player_char[i].x > maxX && player_char[i].is_alive === true) {
            maxX = player_char[i].x;
            maxIndex = i;
        }
    }
    return { index: maxIndex, x: maxX }
}

let firstWinnerIndex = null;
function update_player_char() {
    for (let i = 0; i < player_char.length; i++) {
        if (player_char[i].is_alive) {
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
//study me
            player_char[i].y += player_char[i].dy;
            player_char[i].onGround = false;
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
                player_char[i].is_alive = false;
                if (player_char[i].controller === updateControlsForHuman) {
                    ctx.fillStyle = 'black';
                    ctx.font = '20px Arial';
                    ctx.fillText('human player, you ded!', canvas.width / 2 - 100, 30);
                }
            }
            player_char[i].bananas.forEach((banana_element, index) => {
                if (check_collision(player_char[i], banana_element)) {
                    player_char[i].bananasCollected += 1;
                    player_char[i].bananas.splice(index, 1);
                }
            });
            if (firstWinnerIndex === null && player_char[i].bananasCollected === banana.length) {
                console.log(`Player ${i} has won!`);
                firstWinnerIndex = i;
            }

        } else {
            if (player_char[i].y >= canvas.height && player_char[i].controller === updateControlsForHuman) {
                ctx.fillStyle = 'black';
                ctx.font = '20px Arial';
                ctx.fillText('human player, you ded!', canvas.width / 2 - 100, 30);
            }
        }
    }
    if (inGameTime / 60 === 10) {
        let { index, x } = findRightMostMonkey();
        console.log(`the right most monkey is ${index} with x position ${x}`, player_char[index].is_alive);
        let winner_choreography = player_char[index].choreography;
        player_char = [
            {
                controller: updateControlsForHuman,
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
                bananasCollected: 0,
                bananas: [...banana],
                is_alive: true,
            }
            ,
        ];
        player_char.push(
            {
                controller: cleanAI,
                choreography: winner_choreography,
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
                bananasCollected: 0,
                bananas: [...banana],
                is_alive: true,
            }
        )
        for (let i = 0; i < 1000; i++) {
            player_char.push(
                {
                    controller: cleanAI,
                    choreography: modify_choreography(winner_choreography),
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
                    bananasCollected: 0,
                    bananas: [...banana],
                    is_alive: true,
                }
            )
        }
        inGameTime = 0;
    }
}

function modify_choreography(original_choreography) {
    let choreography = [];
    for (let i = 0; i < original_choreography.length; i++) {
        if (Math.random() < 0.9) {
            choreography.push(original_choreography[i]);
        }
        else {
            if (Math.random() < 0.5) {
                choreography.push(Math.floor(10 * Math.random()) + 1);
            } else {
                let randomNumber = Math.floor(Math.random() * 4);
                if (randomNumber === 0) {
                    choreography.push('right');
                }
                if (randomNumber === 1) {
                    choreography.push('left');
                }
                if (randomNumber === 2) {
                    choreography.push('up');
                }
                if (randomNumber === 3) {
                    choreography.push('down');
                }
            }
        }
    }
    return choreography
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
    inGameTime++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let p of player_char) {
        p.controller(p);
    }
    update_player_char();
    update_animation();
    camera_position = Math.round(player_char[0].x - canvas.width / 2 + player_char[0].width / 2);
    draw_player_char();
    draw_block();
    draw_bananas();
    draw_score();
    let gameTime = getGameTime();
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Time: ' + gameTime + 's', 20, 30);
    if (firstWinnerIndex !== null) {
        ctx.fillText(`Player ${firstWinnerIndex} won!`, canvas.width / 2 - 40, canvas.height / 2);
    }
    if (score === 600) {
        startTime = null;
        ctx.fillStyle = 'black';
        ctx.font = '20px Arial';
        win_status = true;
        ctx.fillText('You won!', canvas.width / 2 - 40, canvas.height / 2);
    }
}
setInterval(draw_game, 16);