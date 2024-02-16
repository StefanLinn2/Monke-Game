//create environment
const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.append(canvas);
const ctx = canvas.getContext('2d');

//initial coordinates
let x_coor = 0;
let y_coor = 0;

//unit specs below:
let npc = {
    x: 300,
    y: 300,
    width: 30,
    height: 30
}
let main_char = {
    x: x_coor,
    y: y_coor,
    width: 30,
    height: 30,
    speed: 1,
    max_speed: 3,
    acceleration: 0.1,
    dx: 0, //horizonal velocity
    dy: 0 //vertical velocity
}

let platform = {
    x: 0,
    y: 500,
    width: canvas.width,
    height: 2
}

console.log(main_char, platformRow)

//draw units below:

function draw_main_character() {
    ctx.fillRect(main_char.x, main_char.y, main_char.width, main_char.height)
}

function draw_npc() {
    ctx.fillRect(npc.x, npc.y, npc.width, npc.height)
}

function draw_platform(){
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
}


//unit controls below:

function update_main_char() {
    main_char.speed += main_char.acceleration;

    if(main_char.speed > main_char.max_speed){
        main_char.speed = main_char.max_speed;
    }

    let new_x = main_char.x + main_char.dx;
    let new_y = main_char.y + main_char.dy;

    //stops no clipping through npc
    if(!check_collision({x: new_x, y: new_y, width: main_char.width, height: main_char.height}, npc)) {
        main_char.x = new_x;
        main_char.y = new_y;
    }

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

function stop_main_char(direction){
    if (direction == 'up' || direction == 'down'){
        main_char.dy = 0;
    } else if (direction == 'left' || direction == 'right'){
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
    if (check_collision(main_char, npc)) {
        stop_main_char(direction);
    }
    draw_platform();
    draw_main_character();
    draw_npc();
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
//coins and pts (look up how to do counters in screen)

//moving npcs
//jump mechanics
//lofty tasks camera follow the character