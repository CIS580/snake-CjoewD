/* Global variables */
var frontBuffer = document.getElementById('snake');
var frontCtx = frontBuffer.getContext('2d');
var backBuffer = document.createElement('canvas');
backBuffer.width = frontBuffer.width;
backBuffer.height = frontBuffer.height;
var backCtx = backBuffer.getContext('2d');
var oldTime = performance.now();

var gameover = false;
var score = 0;
var click = 0;
var lastPop;

var input = {
    up: false,
    down: false,
    left: false,
    right: false,
    p: false
}

var segment = {
    x: 5,
    y: 10
}

var worm = [{ x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 4 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 8 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 12 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 16 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 20 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 24 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 28 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 32 }];

var food = [];

var rock = [];

function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
function loop(newTime) {
        var elapsedTime = newTime - oldTime;
        oldTime = newTime;

        if (input.p) restart();

        if (input.up || input.down || input.right || input.left) {
            update(elapsedTime);
        }
        if(!gameover) render(elapsedTime);

        // Flip the back buffer
        frontCtx.drawImage(backBuffer, 0, 0);

        // Run the next loop
        if (gameover) gameOver();
        window.requestAnimationFrame(loop);
}

window.onkeydown = function (event) {
    switch (event.keyCode) {
        case 38:
        case 87:
            if (!input.down) {
                input.up = true;
                input.down = false;
                input.left = false;
                input.right = false;
            }
            break;
        case 40:
        case 83:
            if (!input.up && !(!input.left && !input.right)) {
                input.up = false;
                input.down = true;
                input.left = false;
                input.right = false;
            }
            break;
        case 37:
        case 65:
            if (!input.right) {
                input.up = false;
                input.down = false;
                input.left = true;
                input.right = false;
            }
            break;
        case 39:
        case 68:
            if (!input.left) {
                input.up = false;
                input.down = false;
                input.left = false;
                input.right = true;
            }
            break;
        case 80:
            input.p = true;
            break;
    }
}

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {elapsedTime} A DOMHighResTimeStamp indicting
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
    click++;

    // TODO: Grow the snake periodically
    var temp = click + 1;
    if (temp % 50 == 0) {
        //Grows Snake
        worm.push(lastPop);
    }

    // TODO: Spawn an apple periodically
    else if (click == 250) {
        click = 1;
        
        //Spawns Apple
        var segment = { x: (getRandomNumber(8, (backBuffer.width))) / 8 * 8 - 4, y: (getRandomNumber(8, (backBuffer.height))) / 8 * 8 - 4 }
        food.push(segment);
    }

    // TODO: Move the snake
    var segment;
    if (input.up) segment = { x: worm[0].x, y: worm[0].y - 4 };
    else if (input.down) segment = { x: worm[0].x, y: worm[0].y + 4 };
    else if (input.left) segment = { x: worm[0].x - 4, y: worm[0].y };
    else segment = { x: worm[0].x + 4, y: worm[0].y };
    worm.unshift(segment);
    lastPop = worm.pop();

    // TODO: Determine if the snake has moved out-of-bounds (offscreen)
    if (worm[0].y < 0 || worm[0].y > 480 || worm[0].x < 0 || worm[0].x > 760) {
        gameover = true;
    }

    // TODO: Determine if the snake has eaten an apple
    for (i = 0; i < food.length; i++) {
        if (worm[0].x > food[0].x - 8 && worm[0].x < food[0].x + 8 && worm[0].y > food[0].y - 8 && worm[0].y < food[0].y + 8) {
            food.shift();
            score += 100;
            break;
        }
        food.push(food.shift());
    }

    // TODO: Determine if the snake has eaten its tail
    for (i = 1; i < worm.length-1; i++) {
        if (worm[0].x == worm[i].x && worm[0].y == worm[i].y) {
            gameover = true;
        }
    }

  // TODO: [Extra Credit] Determine if the snake has run into an obstacle
    for (i = 0; i < rock.length; i++) {
        if (worm[0].x > rock[i].x - 8 && worm[0].x < rock[i].x + 8 && worm[0].y > rock[i].y - 8 && worm[0].y < rock[i].y + 8) {
            gameover = true;
        }
    }
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {elapsedTime} A DOMHighResTimeStamp indicting
  * the number of milliseconds passed since the last frame.
  */
function render(elapsedTime) {
    backCtx.fillStyle = 'white';
  backCtx.fillRect(0, 0, backBuffer.width, backBuffer.height);

    // TODO: Draw the game objects into the backBuffer

    //Draws Apples
  backCtx.beginPath();
  backCtx.lineWidth = 3;
  backCtx.strokeStyle = 'green';
  backCtx.fillStyle = 'red';
  for (i = 0; i < food.length; i++) {
      backCtx.beginPath();
      backCtx.arc(food[i].x, food[i].y, 4, 0, 2 * Math.PI, false); //(x,y,radius, for circle = 0, for circle = 2* MAth.PI)
      backCtx.stroke();
      backCtx.fill();
  }

    //Draws Snake
  backCtx.beginPath();
  backCtx.lineWidth = 3;
  backCtx.strokeStyle = 'black';
  backCtx.fillStyle = 'green';
  for (i = 0; i < worm.length; i++) {
      backCtx.beginPath();
      backCtx.arc(worm[worm.length - 1 - i].x, worm[worm.length - 1 - i].y, 4, 0, 2 * Math.PI, false); //(x,y,radius, for circle = 0, for circle = 2* MAth.PI)
      backCtx.stroke();
      backCtx.fill();
  }

    //Draws Rocks
  backCtx.beginPath();
  backCtx.lineWidth = 3;
  backCtx.strokeStyle = 'black';
  backCtx.fillStyle = 'grey';
  for (i = 0; i < rock.length; i++) {
      backCtx.beginPath();
      backCtx.arc(rock[i].x, rock[i].y, 4, 0, 2 * Math.PI, false); //(x,y,radius, for circle = 0, for circle = 2* MAth.PI)
      backCtx.stroke();
      backCtx.fill();
  }

    //Show score
  backCtx.fillStyle = "white";
  backCtx.fillRect(10, 10, 70, 11);
  backCtx.fillStyle = "black";
  backCtx.font = "bold 12px Arial";
  backCtx.fillText("Score: " + score, 10, 20);
}

/**
  * @function gameOver
  * Shows the game is over
  */
function gameOver() {
    input.up = false;
    input.down = false;
    input.left = false;
    input.right = false;

    frontCtx.fillStyle = "black";
    frontCtx.font = "bold 100px Arial";
    frontCtx.fillText("Game Over!", 100, 200);
}

/**
  * @function init
  * creates elements for the start of the game
  */
function init() {
    //Creates Rocks
    for (i = 0; i < 20; i++) {
        var segment = { x: (getRandomNumber(8, (backBuffer.width))) / 8 * 8 - 4, y: (getRandomNumber(8, (backBuffer.height))) / 8 * 8 - 4 }
        rock.push(segment);
    }

    //Create Single Apple
    var segment = { x: (getRandomNumber(8, (backBuffer.width))) / 8 * 8 - 4, y: (getRandomNumber(8, (backBuffer.height))) / 8 * 8 - 4 }
    food.push(segment);
}

/**
  * @function restart
  * resets game
  */
function restart() {
    input.p = false;
    input.up = false;
    input.down = false;
    input.left = false;
    input.right = false;
    gameover = false;
    click = 0;
    score = 0;

    worm = [{ x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 4 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 8 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 12 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 16 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 20 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 24 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 28 }, { x: backBuffer.width / 2 + 4, y: backBuffer.height / 2 + 32 }];
    food = [];
    rock = [];

    init();
    render();
}

/* Launch the game */
init();
window.requestAnimationFrame(loop);
