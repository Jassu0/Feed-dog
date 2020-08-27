var dog, happy, hungry, database;
var foods, foodstock;
function preload() {
    happy = loadImage("happy dog.png");
    hungry = loadImage("Dog.png");
}

function setup(){
    database = firebase.database();
    createCanvas(500,500);
    dog = createSprite(250,300,150,150);
    dog.addImage(hungry);
    dog.scale = 0.2;
    foodstock = database.ref('Food');
    foodstock.on("value",readstock);
}

function draw(){
    background("white");
    if(keyWentDown(UP_ARROW)) {
        writestock(foods);
        dog.addImage(happy);
    }
    
    drawSprites();
    fill (0);
    text("food remaining"+foods,170,200);
    textSize(15);
    text("Press up arrow to feed the dog",130,50);
}

function writestock(x){
    if(x <= 0) {
        x = 0;
    } else {
        x -= 1;
    }
   database.ref("/").set({
       Food:x
   });
}
function readstock(data) {
    foods = data.val();
}
function showError() {
    console.log("could not read database");
}