/**
 * numberLuck!
 * Kiana Rezaee
 * You are a being rules by things beyond your understanding, for me math is one of them 
 * We constantly depend on numbers to define us. Our age, data and more but there are also more superstious uses
 * Humans love to try and guess using numbers. Bidding, coin flips, dice, and such. 
 * But does true randomness exist? 
 * In the case of even coin flips... it seems not
 * But js promises randomness! use RandomLuck to find out what you can achieve based on luck and numbers alone...
 * Does the award align with you?
 * 
 * Instructions:
 * - Black Cat will be following your mouse
 * - Catch lucky items to survive longer 
 * - If you catch unlucky items, you will lose your 9 lucky hearts once you reach 20 you win!
 * - Click on numbers to see what random rewards will be given to you throughout your play
 * - act quickly and see how long you last!


//black cat is created in three seperate parts
let BlackCat = {
    body: {
        x: 320,
        y: 520,
        size: 50,
        image: undefined
    },
    paw: {
        x: 0,
        y: 480,
        rect: {
            width: 40,
            height: 900,
        },
        hand: {
            size: 40,
        },
        thumb: {
            size: 15,
        },
        speed: 20,
    } 
};

//pixel font exists 
let pixelFont;

//music exists
let music;

//timer exists
let timer = {
    counter: 0,
};

//ace is a variable with an image and counter displayed in the top corner
let ace = { 
    counter: 9,
    image: undefined,
    x: 580, 
    y: 20,
    size: 50,
};

//angle is used for movement later
let angle=0

//array of items
const items = [
    { name: 'ladybug', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/LadyBug.png', lucky: true, x: 0, y: 200, size: 100, speed: 4 },
    { name: 'itchyfoot', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/FootItch.png', lucky: false, x: -100, y: 300, size: 100, speed: 3 },
    { name: 'fish', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/Fish.png', lucky: true, x: -20, y: 200, size: 120, speed: 4 },
    { name: 'rice', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/ChopsticksRice.png', lucky: false, x: -50, y: 100, size: 100, speed: 3 },
    { name: 'wheel', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/FortuneWheel.png', lucky: true, x: -40, y: 50, size: 100, speed: 4 },
    { name: 'owl', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/Owl.png', lucky: false, x: -80, y: 150, size: 100, speed: 3 },
    { name: 'clover', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/FourLeaf.png', lucky: true, x: -70, y: 170, size: 100, speed: 4 },
    { name: 'mirror', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/Mirror.png', lucky: false, x: -79, y: 60, size: 100, speed: 3 },
    { name: 'horseshoeup', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/HorseShoe.png', lucky: true, x: -59, y: 60, size: 100, speed: 3 },
    { name: 'horseshoedown', image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/HorseShoeDown.png', lucky: false, x: -59, y: 60, size: 100, speed: 3 }
];

//used in preload 
let itemImages = {};

//the begining gamestate
let gameState = "start"; 

//bounce used in animation 
let bounceY = 0; 

//gravity
let bounceDirection = 1; 

//possible achievements
let achievements = [];

//start off without seeing them
let displayAchievements = false;

function preload() {
    //loads black cat 
    BlackCat.body.image = loadImage('https://duzakh.github.io/cart253/mod-jam/assets/images/BlackCat.png'); 
    //loads all the times
    items.forEach(item => {
        itemImages[item.name] = loadImage(item.image);
    });
    //loads the hearts
    ace.image = loadImage('https://duzakh.github.io/cart253/mod-jam/assets/images/aceofhearts.PNG');
    //loads the music
    music = loadSound("https://duzakh.github.io/cart253/mod-jam/assets/sounds/music.mp3");
    //loads the font
    pixelFont = loadFont("https://duzakh.github.io/cart253/mod-jam/assets/Jacquard_24/Jacquard24-Regular.ttf");
}

//Lilac background
function setup() {
    createCanvas(640, 480);
    background("#b3b3ff");
}

function displayStartScreen() {
    //each of the following lines is text that comes up during gameplay, they are seperated for ease of reading
    textSize(30);
    textAlign(CENTER);
    textFont(pixelFont);
    fill(0); // Black color
    text("NumberLuck", width / 2, height / 3);
    
    textSize(16);
    textAlign(CENTER);
    fill(0); // Black 
    text("find out how many achievements you can reach!", width / 2, height / 2.5);
    text("type any number from 0-9 while trying to catch the omens,", width / 2, height / 2.3);
    text("when you get 20 aces you will realize your achievements.", width / 2, height / 2.1);
    text("In much of the ancient world, humans attempted to decode divine messages:", width / 2, height / 1.9);
    text("omens. Find out your numerophilosophy ", width / 2, height / 1.8);

    // Start the game
    textSize(20);
    fill(255); // Set to white
    text("Click to Start", width / 2, height / 1.3); // Positions it at the bottom
}

function draw() {
    //background in every frame
    background("#AEF359");
    //if the game state is start
    if (gameState === "start") {
    //displays the start screen
        displayStartScreen();
    //animates the cat to bounce
        animateCat();
    } else if (gameState === "game") {
    //animates and move the cat with the mouse
        moveCat();
        BlackCat.body.x = mouseX; 
        BlackCat.paw.x = BlackCat.body.x - 40; 
    //show the aces
        drawLives();
    //display the ace coutner
        displayCounter();
    //draw the paw
        drawPaw();
    //increase the timer counter in each frame    
        timer.counter++;
    //move all the items
        items.forEach(moveSymbol);
    //draw all the items
        items.forEach(drawSymbol);
    //check collisions for all the items
        items.forEach(checkCollision);
    //the final gamestate which displays the achievements 
    } else if (gameState === "achievements") {
        displayAchievementsScreen();
    }
}

function moveSymbol() {
    items.forEach(item => {
        item.x += item.speed *0.2;
        // Updates the y position using a sine wave
        // sine wave's offset is based on x position and angle
        item.y = item.y + 1 * sin(angle + item.x * 0.02);

        if (item.x > width) {
            // If the item is unlucky, decrease the ace counter
            if (!item.lucky) {
                decreaseLife(); // Reduce the counter by 1
            }
            // Puts the item back at the start
            resetSymbol();
        }
    });
}

// i try to use this function to create random achievements when pressing a number 0-9
//each represents a philosophical thought
//does not function properly, the achievements are meant to all display at the end together, instead they display as soon as you press
function keyPressed() {
    if (gameState === "game" && keyCode >= 48 && keyCode <= 57) {
        let randomEffect = floor(random(1, 8));
        switch (randomEffect) {
            case 1:
                // The black cat disappears."
                achievements.push("Schrödinger's Cat");
                BlackCat.body.image = undefined;
                break;
            case 2: 
                //The counter disappears
                achievements.push("Immaterial Goods");
                ace.counter = undefined;
                break;
            case 3:
                // A second black cat appears.
                achievements.push("Dunbar's Number");
                BlackCat.second = { x: BlackCat.body.x + 50, y: BlackCat.body.y, size: 50, image: BlackCat.body.image };
                break;
            case 4:
                // Every object becomes lucky.
                achievements.push("Wu Wei");
                items.forEach(item => item.lucky = true);
                break;
            case 5:
                // Every object becomes lucky.
                achievements.push("Zoroaster's Light");
                background(255);
                break;
            case 6:
                //: Everything displays a ?
                achievements.push("Pyrrhonis's Question");
                items.forEach(item => item.image = undefined);
                break;
        }
        //does not function i think
        if (ace.counter === 20) {
            gameState = "achievements";
        }
    }
}
// Cat bouncing
function moveCat() {
    // Updates the bounce position
    bounceY += bounceDirection * 0.5; // 0.5 is the value for speed of bounce

    // Reverse direction if it exceeds bounds
    if (bounceY > 5 || bounceY < -5) {
        bounceDirection *= -1; // Reverse direction
    }
    // Draw the bouncing cat (lower position)
    image(BlackCat.body.image, mouseX, height / 2 + 50 + bounceY, 200, 200); 
}

// Function to draw the heart icon 
function drawLives() {
    // ace heart icon 
    image(ace.image, ace.x, ace.y, ace.size, ace.size);
}
// Cat bouncing
function animateCat() {
    // Updates the bounce position
    bounceY += bounceDirection * 0.5; // 0.5 is the value for speed of bounce
    // Reverse direction if it exceeds bounds
    if (bounceY > 5 || bounceY < -5) {
        bounceDirection *= -1; // Revere direction
    }
    // Draw the bouncing cat (lower position)
    image(BlackCat.body.image, width / 2 - 100, height / 2 + 50 + bounceY, 200, 200); 
}

// Function to draw the paw
function drawPaw() {
    fill(0); 
    //rectangle for the outstretched arm
    rect(BlackCat.paw.x, mouseY, BlackCat.paw.rect.width, BlackCat.paw.rect.height);
    //circles for the hand and thumb
    ellipse(BlackCat.paw.x + BlackCat.paw.hand.size / 2, mouseY, BlackCat.paw.hand.size);
    ellipse(BlackCat.paw.x + BlackCat.paw.hand.size, mouseY, BlackCat.paw.thumb.size);
}
// Fucntion to display the text
function displayCounter() {
    textSize(24);
    textFont(pixelFont); //sets the font to the pixel one in my assets
    fill(0); // black

    // Display the counter next to the heart icon
    text(ace.counter, 
        //adds the ace x
        ace.x - ace.size + 40, 
        ace.y + ace.size / 2);
}

// Function that draws the objects
function drawSymbol() {
    items.forEach(item => {
        image(itemImages[item.name], item.x, item.y, item.size, item.size);
    });
}

function checkCollision(symbol) {
    //distance is a variable 
    //it calculates it between the cat paw x and symbol x
    //also calcualtes it where the players y is and the symbol x
    let distance = dist(BlackCat.paw.x, mouseY, symbol.x, symbol.y);

    //when the paw and players position is in the middle of the symbol two things can happen
    if (distance < BlackCat.paw.hand.size + symbol.size / 2) {
        //when its lucky
        if (symbol.lucky) {
            ace.counter++; // Increase lucky ace
        //when its unlucky    
        } else {
            ace.counter--; // Decrease lucky ace
        }

        //makes sure the symbol returns onto the screen
        resetSymbol(); // Reset item position
    }
}

//puts the objects back to the start of the canvas
function resetSymbol() {
    items.forEach(item => {item.x = -item.size;
    //ramdom causes the y to be decided... randomly https://p5js.org/reference/p5/random/
    item.y = random(0, height - item.size);
})}

function displayAchievementsScreen() {
    background("#b3b3ff");
    textFont(pixelFont);
    textSize(24);
    fill(0);
    text("Achievements", width / 2 - 100, 50);
    achievements.forEach((achievement, index) => {
        text(achievement, 50, 100 + index * 30);
    });
}

function mousePressed() {
    // Plays music if it's not already playing and loops it
    if (music && !music.isPlaying()) {
        music.loop();
    }
    // checks to see if the game is on start, which it is at the beginning 
    if (gameState === "start") {
        //Changes the state to play when the mouse is pressed
        gameState = "game"; 
    }
}
