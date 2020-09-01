var dog, happy, hungry, database;
var foods, foodstock;
var fedtime, lastfed, feed, addfood, foodobj;
function preload() {
    happy = loadImage("happy dog.png");
    hungry = loadImage("Dog.png");
}

function setup(){
    database = firebase.database();
    createCanvas(1000,500);
    dog = createSprite(250,300,150,150);
    dog.addImage(hungry);
    dog.scale = 0.2;
    foodstock = database.ref('Food');
    foodstock.on("value",readstock);
    foodobj = new Food();
    feed = createButton("feed");
    feed.position(700, 95);
    feed.mousePressed(feeddog);
    addfood = createButton("add food");
    addfood.position(800, 95);
    addfood.mousePressed(addfood);
}

function draw(){
    background("white");
    foodobj.display();
    fedtime = database.ref('feedtime');
    fedtime.on("value",function(data){
        lastfed = data.val();
    })
    if(lastfed >= 12) {
        text("Last Feed"+lastfed%12+"pm",350, 30);
    } else if(lastfed == 0) {
        text("Last Feed: 12 AM",350, 30);
    } else {
        text("Last Feed"+lastfed+"am",350, 30);
    }
    drawSprites();
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
    foodobj.updateFoodStock(foods);
}
function showError() {
    console.log("could not read database");
}
function feeddog() {
    dog.addImage(happy);
    foodobj.updateFoodStock(foodobj.getFoodStock()-1);
    database.ref('/').update({
        Food: foodobj.getFoodStock(),feedtime: hour()
    })
}
function addFoods() {
    foods ++ ;
    database.ref('/').update({
        Food: foods
    })
}