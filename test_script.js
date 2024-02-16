const canvas = document.createElement('canvas');
canvas.width = canvas.height = 600;
canvas.style.border = '1px solid black';
document.body.append(canvas);
const ctx = canvas.getContext('2d');

function poopsquare() {
    ctx.fillRect(20, 20, 150, 100);
}


function draw(){
    poopsquare();
}
setInterval(draw,16)