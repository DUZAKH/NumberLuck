/**
 * numberLuck!
 * Kiana Rezaee
 * Instructions:
 * - see how many achievements you can reach!
 * - test your luck! click on any number from 0-9 to see what awaits you...
 * - each number will bring about a different occurance
 *
 * Made with p5
 * https://p5js.org/
 */


// Setting up the black cat charecter as a variable so it can change throughout the game
let BlackCat = {
    //the body is separate to the paw as it is a drawing
    body: {
        x: 320,
        y: 520,
        size: 50,
        image: undefined
    },
    //the paw is what interacts with the different symbols in the game
    paw: {
        x: 0,
        y: 480,
        
        //this is the main arm, it is a rectangle 
        rect: {
            width: 40,
            height: 900,
        },
        //this is the round hand its a circle
        hand: {
            size: 40,
        },
        //this is the thumb it is a smaller circle
        thumb: {
            size: 15,
        },
        speed: 20,
    } 
};

//setting up the pixel font variable that i will use for the game hopefully
let pixelFont;

//music is undefined at the start before being loaded 
let music = undefined;


//timer 
let timer ={
    counter: 0,
}

//the ace of hearts and its counter
let ace = { 
    //image of an ace heart 
    counter: 9,
    image: undefined,
    x: 580, 
    y: 20,
    size: 50,
};

//I use this for the movement of symhols function in sine
// some credits to dio: https://editor.p5js.org/dio/sketches/FACyzYY0s
let angle= 0;

// My array of objects which the black cat interacts with 
//they each have an image, position, size, and speed

const items = [
    {
        name: 'ladybug',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/LadyBug.png',
        lucky: true,
        x: 0,
        y: 200,
        size: 100,
        speed: 4
    },
    {
        name: 'itchyfoot',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/FootItch.png',
        lucky: false,
        x: -100,
        y: 300,
        size: 100,
        speed: 3
    },
    {
        name: 'fish',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/Fish.png',
        lucky: true,
        x: -20,
        y: 200,
        size: 120,
        speed: 4
    },
    {
        name: 'rice',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/ChopsticksRice.png',
        lucky: false,
        x: -50,
        y: 100,
        size: 100,
        speed: 3
    },
    {
        name: 'wheel',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/FortuneWheel.png',
        lucky: true,
        x: -40,
        y: 50,
        size: 100,
        speed: 4
    },
    {
        name: 'owl',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/Owl.png',
        lucky: false,
        x: -80,
        y: 150,
        size: 100,
        speed: 3
    },
    {
        name: 'clover',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/FourLeaf.png',
        lucky: true,
        x: -70,
        y: 170,
        size: 100,
        speed: 4
    },
    {
        name: 'mirror',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/Mirror.png',
        lucky: false,
        x: -79,
        y: 60,
        size: 100,
        speed: 3
    },
    {
        name: 'horseshoeup',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/HorseShoe.png',
        lucky: true,
        x: -59,
        y: 60,
        size: 100,
        speed: 3
    },
    {
        name: 'horseshoedown',
        image: 'https://duzakh.github.io/cart253/mod-jam/assets/images/HorseShoeDown.png',
        lucky: false,
        x: -59,
        y: 60,
        size: 100,
        speed: 3
    }
];

//stores the item images
let itemImages = {};

// Game state is a variable that can change and it begins with the "start"
let gameState = "start"; 
// Variable for cat bounce effect
let bounceY = 0; 
// Direction of the bounce so it looks natural 
let bounceDirection = 1; 

// Preloads all the images and music
function preload() {
    // the image of BlackCat
    BlackCat.body.image = loadImage('https://duzakh.github.io/cart253/mod-jam/assets/images/BlackCat.png'); 
    //all the images in the array 
     items.forEach(item => {
        itemImages[item.name] = loadImage(item.image);
    });
    //the image of the ace of hearts used next to the counter
    ace.image = loadImage('https://duzakh.github.io/cart253/mod-jam/assets/images/aceofhearts.PNG');
    //preloads the music
    music= loadSound("https://duzakh.github.io/cart253/mod-jam/assets/sounds/music.mp3");
    //preloads the font
    pixelFont= loadFont("https://duzakh.github.io/cart253/mod-jam/assets/Jacquard_24/Jacquard24-Regular.ttf");
}

// Canvas and background
function setup() {
    createCanvas(640, 480);
    background("#AEF359"); //bright green
}


//draw function and general game if statements 
function draw() {
    // Background is in every frame so that the animation of the cat bouncing doesn't mess it up, it looked messed up at first because i didnt put this...
    background("#AEF359"); 

    if (gameState === "start") {
        // when the player starts the game, the display screen is shown this function is defined later
        displayStartScreen();
        // the bouncing cat animation function starts too, this continues throughout thte rest of the game also defined later
        animateCat(); 
    } else if (gameState=== "game"){
        moveCat(); 
        // this makes the cat moves with the mouse
        // I might want to map this later
        // need help doesnt work how I want
        BlackCat.body.x = mouseX; 
        // position of the paw relative to the cat, its shifted slightly to the left
        BlackCat.paw.x = BlackCat.body.x - 40; 

        // Draws the ace heart 
        drawLives();
        
        // draws the counter
        displayCounter();

        // Draws the paw
        drawPaw(); 

        timer.counter ++; 
        
        //moves all the objects in the item array
        items.forEach(moveSymbol);
        
        // draws all the objects =
        items.forEach(drawSymbol);

        // Checks for collisions between the paw and objects
        items.forEach(checkCollision);
    }

    //else if (gameState ==="end") {
        //displayDeathScreen();
        //}
}

// the two functions below are to draw the ace image and counter
// Function to draw the heart icon 
function drawLives() {
    // ace heart icon 
    image(ace.image, ace.x, ace.y, ace.size, ace.size);
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

// function to reduce the number of lives, used later on
function decreaseLife() {
    //if the counter is more than 0 it decreases by 1
    if (ace.counter > 0) {
        ace.counter--;  }
    //if the counter is equal to zero the gameover function starts
    //else if (ace.counter === 0){
        //gameOver();
    //}
}


// Function that moves the objects
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

// Function that draws the objects
function drawSymbol() {
    items.forEach(item => {
        image(itemImages[item.name], item.x, item.y, item.size, item.size);
    });
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

// Function to draw the paw
function drawPaw() {
    fill(0); 
    //rectangle for the outstretched arm
    rect(BlackCat.paw.x, mouseY, BlackCat.paw.rect.width, BlackCat.paw.rect.height);
    //circles for the hand and thumb
    ellipse(BlackCat.paw.x + BlackCat.paw.hand.size / 2, mouseY, BlackCat.paw.hand.size);
    ellipse(BlackCat.paw.x + BlackCat.paw.hand.size, mouseY, BlackCat.paw.thumb.size);
}

function displayStartScreen() {
    //each of the following lines is text that comes up during gameplay, they are seperated for ease of reading
    textSize(30);
    textAlign(CENTER);
    textFont(pixelFont);
    fill(0); // Black color
    text("Purrgatory! Your Existence and Mortality Exist by Chance", width / 2, height / 3);
    
    textSize(16);
    textAlign(CENTER);
    fill(0); // Black 
    text("You will lose you 9 Ace of Hearts, Black Cat can help you live...", width / 2, height / 2.5);
    text("Many cultures have tried to crack the code into your random existence,", width / 2, height / 2.3);
    text("mortality, and chance.", width / 2, height / 2.1);
    text("In much of the ancient world, humans attempted to decode divine messages:", width / 2, height / 1.9);
    text("omens. See how long your ace of hearts can survive when introduced to these omens!", width / 2, height / 1.8);

    // Start the game
    textSize(20);
    fill(255); // Set to white
    text("Click to Start", width / 2, height / 1.3); // Position it at the bottom
}

//function gameOver() {

//}


//main function for the ending screen 

//function displayDeathScreen() {
    //background("#AEF359");  
    //textSize(24);
    //fill(0);  
    //textAlign(CENTER,CENTER);
    //animateCat();
    
    // Display the death message
    //text(deathMessage, width / 2, height / 2);

    //displays the seconds you played

    //floor converts the calculated number into 
    //text(floor(timer.counter/60) + " seconds", 100, 50);
//}


// Checks for collision between the paw and symbols
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

function mousePressed() {
    // checks to see if the game is on start, which it is at the beginning 
    if (gameState === "start") {
        //Changes the state to play when the mouse is pressed
        gameState = "game"; 
    }
    
    // Plays music if it's not already playing and loops it
    if (music && !music.isPlaying()) {
        music.loop();
    }
}