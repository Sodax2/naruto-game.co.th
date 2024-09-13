//ตั้งค่าหน้าจอเกม
let board;
let boardWidth = 800;
let boardHeight = 300;
let context;

//ตั้งค่าตัวละครเกม
let playerWidth = 80; //ปรับขนาดตัวละคร
let playerHeight = 80; //ปรับขนาดตัวละคร
let playerX = 50;
let playerY = 215; //ระดับที่ตัวละครอยู่
let playerImg;
let player = {
    x:playerX,
    y:playerY,
    width:playerWidth,
    height:playerHeight
}
let gameOver = false;
let score = 0;
let time = 0;

//สร้างอุปสรรค
let boxImg;
let boxWidth = 50;
let boxHeight = 100;
let boxX = 700;
let boxY = 225;//ระดับที่ตัวอุปสรรคอยู่

//setting อุปสรรค
let boxesArray = [];
let boxSpeed = -6;

//Gravity & Velocity
let velocityY = 0;
let gravity = 0.30;

//สร้างตัวแปรกำหนดเวลา
let timeon = 60;

//ชีวิต
let live = 3;

//การกำหนดเหตุการณ์เริ่มต้นเกม
window.onload = function(){
    //Display
    board = document.getElementById('board');
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    //player
    playerImg = new Image();
    playerImg.src = "main.png.png";
    playerImg.onload = function() {
        context.drawImage(playerImg, player.x , player.y , player.width , player.height);
    }

    //request animation frame
    requestAnimationFrame(update);

    //ดักจับการกระโดด
    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keydown", refres);
   

    //สร้าง box
    boxImg = new Image();
    boxImg.src = "noob.png";
   
    Timelives();

}
function Timelives() {
    let timerandom = Math.floor(Math.random() * (5000)+600);
    //สุ่มเวลา1-5วิ
    setTimeout(()=>{
        createBox();
        Timelives();
    }, timerandom);
}

//function update
function update() {
    requestAnimationFrame(update); //update annimation ตลอดเวลา
   
    if(gameOver){ //ตรวจสอบว่าเกม over หรือเปล่า
        return;
    }
   
    context.clearRect(0 , 0 , board.width , board.height); //เคลียร์ภาพซ้อน
    velocityY += gravity;

    //create play Object
    player.y = Math.min(player.y + velocityY,playerY);
    context.drawImage(playerImg, player.x , player.y , player.width , player.height);
   
    //create array box
    for(let i = 0 ; i < boxesArray.length;i++) {
        let box = boxesArray[i];
        box.x += boxSpeed;
        context.drawImage(box.img , box.x , box.y , box.width , box.height);

        //ตรวจสอบเงื่อนไขการชนของอุปสรรค
        if(onCollision(player,box)) {
            if(live > 1){
            live--;
            gameOver = true;

            //แจ้งเตือนผู้เล่น
            context.font = "normal bold 40px Arial";
            context.textAlign = "center";
            context.fillText("Game Over !!",boardWidth/2 , boardHeight/2 );//แสดงเกม over
            context.font = "normal bold 30px Arial";
            context.fillText("Score : " +(score+1),boardWidth/2 , 200 );//แสดงคะแนนหลังจบ
            }
           
            else if(live ==1) {
            live--;
            if(live==0) {
            gameOver = true;

            //แจ้งเตือนผู้เล่น
            context.font = "normal bold 40px Arial";
            context.textAlign = "center";
            context.fillText("Game Over !!",boardWidth/2 , boardHeight/2 );//แสดงเกม over
            context.font = "normal bold 30px Arial";
            context.fillText("Score : " +(score+1),boardWidth/2 , 200 );//แสดงคะแนนหลังจบ
            }
            }
               
            }
    }
//นับคะแนน
score++;
context.font = "normal bold 20px Arial";
context.textAlign = "left";
context.fillText("Score : "+ score , 10 , 30 );
context.fillText("Live : "+ live , 10 , 50 );

//นับเวลา
time +=.02;
context.font = "normal bold 20px Arial";
context.textAlign = "right";
context.fillText("Time : "+ (time.toFixed(2)) , 765 , 30 );//

if (time >= timeon) {
    gameOver = true;

    //แจ้งเตือนผู้เล่น
    context.font = "normal bold 40px Arial";
    context.textAlign = "center";
    context.fillText("Game Over !!",boardWidth/2 , boardHeight/2 );//แสดงเกม over
    context.font = "normal bold 30px Arial";
    context.fillText("Score : " +(score),boardWidth/2 , 200 );//แสดงคะแนนหลังจบ
    }
}




//function เคลื่อนย้ายตัวละคร
function movePlayer(e) {
    if(gameOver) {
        return;
    }
   
    if(e.code == "Space" && player.y == playerY) {
        velocityY = -9;
    }
}

function createBox() {
    if(gameOver) {
        return;
    }

    let box = {
        img:boxImg,
        x:boxX,
        y:boxY,
        width:boxWidth,
        height:boxHeight
    }

    boxesArray.push(box);

    if(boxesArray.length > 5) {
        boxesArray.shift;
    }
}

function onCollision(obj1 , obj2){
    return obj1.x < (obj2.x + obj2.width) &&
           (obj1.x + obj1.width) > obj2.x //ชนกันแนวนอน
            &&
           obj1.y < (obj2.y + obj2.height) &&
           (obj1.y + obj1.height) > obj2.y //ชนกันแนวตั้ง
}

//restart game
function restartGame(){
   
    if(live==0){
        location.reload();
    }
}

//refres
function refres() {
    if (gameOver==true && live > 0){
        score = 0;
        time = 0;
        gameOver = false;
        boxesArray = [];
    }
}