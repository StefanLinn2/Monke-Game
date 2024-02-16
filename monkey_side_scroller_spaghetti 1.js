const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.append(canvas);
const ctx = canvas.getContext('2d');
//create environment

let x_coor = 0;
let y_coor = 0;
let unit_speed = 1
//throwing in unit_speed so it can be dynamic
//if unit speed adjusts, you will need to make it so that it
//doesn't glitch the last jump, make it smooth?
let unit_acceleration = 0.05
let unit_deceleration = 0.2
let unit_max_speed = 5

let w_key_press = false
let a_key_press = false
let s_key_press = false
let d_key_press = false
//we need some kind of T/F switch so the code can retain
//information that "this key is still held down"
//keyup/down event listener seems to have the limitation of
//detecting only the latest keystroke

let npc_area = { x: 300,
    y: 300,
    width: 30,
    height: 30 }
let main_char = { x: x_coor,
    y: y_coor,
    width: 30,
    height: 30,
    speed: 1,
    dx: 0, //horizonal velocity
    dy: 0 //vertical velocity
 }
//define the area blocks of the units
// let can_move_right = true
// let can_move_left = true
// let can_move_down = true
// let can_move_up = true

function draw_main_char() {
    ctx.fillRect(main_char.x, main_char.y, main_char.width , main_char.height)
}

function move_main_char(direction) {
    // //placeholder rectangle for unit

    // if (check_collision(main_character_area, npc_area)) {
    //     if (d_key_press == true && main_character_area.x + main_character_area.width > npc_area.x) {
    //         can_move_right = false;
    //         x_counter = npc_area.x - main_character_area.width;

    //     }
    //     if (a_key_press == true && main_character_area.x < npc_area.x + npc_area.width) {
    //         can_move_left = false;
    //         x_counter = npc_area.x + npc_area.width;

    //     }
    //     if (s_key_press == true && y_counter + main_character_area.height > npc_area.y) {
    //         can_move_down = false;
    //         y_counter = npc_area.y - main_character_area.height;

    //     }
    //     if (w_key_press == true && y_counter < npc_area.y + npc_area.height) {
    //         can_move_up = false;
    //         y_counter = npc_area.y + npc_area.height;

    //     }
    // }
    if (d_key_press == true && x_coor <= 570 && can_move_right == true) {
        if (unit_speed < unit_max_speed) {
            unit_speed = unit_speed + unit_acceleration;
            if (unit_speed > unit_max_speed) {
                unit_speed = unit_max_speed;
            }
        }
        // let prevX = x_counter; // store the last y coordinate
        x_coor = x_coor + unit_speed;
        // if (check_collision(main_character_area, npc_area)){
        //     x_counter = prevX; // throw unit back to where it was
        // }
    }
    if (s_key_press == true && y_coor <= 570 && can_move_down == true) {
        if (unit_speed < unit_max_speed) {
            unit_speed = unit_speed + unit_acceleration;
            if (unit_speed > unit_max_speed) {
                unit_speed = unit_max_speed;
            }
        }
        // let prevY = y_counter; // store last y coordinate
        y_coor = y_coor + unit_speed
        // if (check_collision(main_character_area, npc_area)){
        //     y_counter = prevY; // throw unit back at last location
        // }
    }
    if (w_key_press == true && y_coor >= 0 && can_move_up == true) {
        y_coor = y_coor - unit_speed
    }
    if (a_key_press == true && x_coor >= 0 && can_move_left == true) {
        x_coor = x_coor - unit_speed
    }
    console.log("npc L:" + npc_area.x + " monke R: " + (x_coor + 30) + "\n"
        + " npc R: " + (npc_area.x + npc_area.width) + " monke L: " + x_coor + "\n"
        + " npc U: " + npc_area.y + " monke D " + (y_coor + 30) + "\n" +
        " npc D: " + (npc_area.y + 30) + " monke U:" + y_coor + "\n" +
        " RLDW: " + can_move_right + " " + can_move_left + " " + can_move_down + " " + can_move_up
        + "\n" + " col check: " + check_collision(main_char, npc_area)
        + "\n" + unit_speed + " " + unit_max_speed)
    //check this stupid can move status
    //console.log(check_collision(main_character_area, npc_area) + " unit speed is" + unit_speed)
}



function draw_npc() {
    ctx.fillRect(npc_area.x, npc_area.y, npc_area.width, npc_area.height)
}
//separate unit from main character

function check_collision(area1, area2) {
    return (
        area1.x + area1.width + unit_speed > area2.x &&
        area1.x - unit_speed < area2.x + area2.width &&
        area1.y + area1.height + unit_speed > area2.y &&
        area1.y - unit_speed < area2.y + area2.height
    )
}
//collision check function that takes 2 inputs?
//for dynamic future stuff??


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw_main_char();
    draw_npc();
}
//draw function calls on draw functions for individual units

document.addEventListener('keydown', function (event) {
    if (event.code == 'KeyD') {
        d_key_press = true
    }
    if (event.code == 'KeyA') {
        a_key_press = true
    }
    if (event.code == 'KeyW') {
        w_key_press = true
    }
    if (event.code == 'KeyS') {
        s_key_press = true
    }
})
document.addEventListener('keyup', function (event) {
    if (event.code == 'KeyD') {
        d_key_press = false;
    }
    if (event.code == 'KeyA') {
        a_key_press = false;
    }
    if (event.code == 'KeyW') {
        w_key_press = false;
    }
    if (event.code == 'KeyS') {
        s_key_press = false;
    }

})

setInterval(draw, 16)

//the character should move when the WASD keys are pressed
//we only care that it is moved for now, worry about speed
//later on