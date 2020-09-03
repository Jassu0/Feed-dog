var dog, happy, hungry, database;
var foods, foodstock;
var fedtime, lastfed, feed, addfood, foodobj;
var gamestate, garden, livingroom, bedroom, washroom;
function preload() {
    happy = loadImage("happy dog.png");
    hungry = loadImage("Dog.png");
    garden = loadImage("Garden.png");
    livingroom = loadImage("Living Room.png");
    bedroom = loadImage("Bed Room.png");
    washroom = loadImage("Wash Room.png");
}

function setup(){
    database = firebase.database();
    createCanvas(1000,500);
    dog = createSprite(850,300,150,150);
    dog.addImage(hungry);
    dog.scale = 0.2;
    foodstock = database.ref('Food');
    foodstock.on("value",readstock);
    foodobj = new Food();
    feed = createButton("feed");
    feed.position(500, 150);
    feed.mousePressed(feeddog);
    addfood = createButton("add food");
    addfood.position(600, 150);
    addfood.mousePressed(addfood);
    var readstate = database.ref('gamestate');
    readstate.on("value", function(data) {
        gamestate = data.val();
        console.log(gamestate);
    });
}

function draw(){
    background(46,100,50);
    foodobj.display();
    fedtime = database.ref('feedtime');
    fedtime.on("value",function(data){
        lastfed = data.val();
    })
    textSize(15);
    fill ("white")
    if(lastfed >= 12) {
        text("Last Feed: "+lastfed%12+"pm",350, 30);
    } else if(lastfed == 0) {
        text("Last Feed: 12 AM",350, 30);
    } else {
        text("Last Feed: "+lastfed+"am",350, 30);
    }
    if(gamestate != "hungry") {
       //feed.hide();
        //addfood.hide();
        //var time = hour();
        var time = 9;
        if(time == lastfed+1) {
            update("living");
            dog.addImage(livingroom);
        }
        if(time == lastfed+2) {
            update("wash");
            dog.addImage(washroom);
        }
        if(time == lastfed+3) {
            update("bed");
            dog.addImage(bedroom);
        }
        if(time == lastfed+4) {
            update("hungry");
            dog.addImage(hungry);
        }
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
    update("play");
    dog.addImage(garden);
}
function addFoods() {
    foods ++ ;
    database.ref('/').update({
        Food: foods
    })
}
function update(state) {
    database.ref('/').update({
        gamestate: state
    });
}