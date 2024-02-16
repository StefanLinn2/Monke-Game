const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.append(canvas);
const ctx = canvas.getContext('2d');

let gravity = 0.5;

let npcWidth = 30;
let npcHeight = 30;

let npcs = [];

for (let i = 0; i < canvas.width; i += npcWidth) {
  npcs.push({ x: i, y: 520, width: npcWidth, height: npcHeight });
}

npcs.push({ x: 300, y: 400, width: npcWidth, height: npcHeight});
npcs.push({ x: 100, y: 100, width: npcWidth, height: npcHeight});

let main_char = {
  x: 0,
  y: 0,
  width: 30,
  height: 30,
  acceleration: 3,
  dx: 0,
  dy: 0,
  friction: 0.8
};
//console.log((main_char.acceleration * main_char.friction)/(1 - main_char.friction))

let bananas = [
  { x: 150, y: 490, width: 30, height: 30 },
  { x: 400, y: 400, width: 30, height: 30 },
  { x: 250, y: 300, width: 30, height: 30 }
];

function draw_bananas() {
  bananas.forEach(banana => {
    ctx.fillStyle = '#FFDC52';
    ctx.fillRect(banana.x, banana.y, banana.width, banana.height);
  });
}

let score = 0;

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Score: ' + score, canvas.width - 120, 30);
}

function draw_main_character() {
  ctx.fillStyle = '#A99F93';
  ctx.fillRect(main_char.x, main_char.y, main_char.width, main_char.height);
}

function draw_npcs() {
  npcs.forEach(npc => {
    ctx.fillStyle = '#B16100';
    ctx.fillRect(npc.x, npc.y, npc.width, npc.height);
  });
}

function applyGravity(onGround) {
  
  npcs.forEach(npc => {
    if (check_collision(main_char,npc)) {
      onGround = true;
      main_char.y = npc.y - main_char.height;
      main_char.dy = 0;
    }
  });

  if (!onGround) {
    main_char.dy += gravity;
  }
  return onGround
}

function update_main_char() {
  let onGround = false;
  onGround = applyGravity(onGround);

  if (isKeyPressed('KeyA')) {
    main_char.dx -= main_char.acceleration;
  }
  if (isKeyPressed('KeyS')) {
    main_char.dy += main_char.acceleration;
  }
  if (isKeyPressed('KeyD')) {
    main_char.dx += main_char.acceleration;
  }
  if (isKeyPressed('KeyW') && onGround) {
    main_char.dy = -10;
  }

  main_char.dx *= main_char.friction;

  main_char.x += main_char.dx;
  main_char.y += main_char.dy;

  if (main_char.x < 0) {
    main_char.x = 0;
  } else if (main_char.x + main_char.width > canvas.width) {
    main_char.x = canvas.width - main_char.width;
  }

  if (main_char.y < 0) {
    main_char.y = 0;
  } else if (main_char.y + main_char.height > canvas.height) {
    main_char.y = canvas.height - main_char.height;
  }

  bananas.forEach((banana, index) => {
    if (check_collision(main_char, banana)) {
      bananas.splice(index, 1);
      score += 100;
    }
  });
}

let pressedKeys = {};

function isKeyPressed(keyCode) {
  return pressedKeys[keyCode] === true;
}

document.addEventListener('keydown', function(event) {
  pressedKeys[event.code] = true;
});

document.addEventListener('keyup', function(event) {
  pressedKeys[event.code] = false;
});

function stop_main_char(direction) {
  if (direction == 'up' || direction == 'down') {
    main_char.dy = 0;
  } else if (direction == 'left' || direction == 'right') {
    main_char.dx = 0;
  }
}

function check_collision(area1, area2) {
  return (
    area1.x + area1.width >= area2.x &&
    area1.x <= area2.x + area2.width &&
    area1.y + area1.height >= area2.y &&
    area1.y <= area2.y + area2.height
  );
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update_main_char();
  draw_main_character();
  draw_npcs();
  draw_bananas();
  drawScore();
}



setInterval(draw, 16);
