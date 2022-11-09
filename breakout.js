var color1 = "darkgreen";

window.onload = function () {
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
    var ballRadius = 10;
    var x = canvas.width / 2;
    var y = canvas.height - 30;
    var ballSpeed = 2;
    var dx = ballSpeed;
    var dy = -ballSpeed;
    var paddleHeight = 10;
    var paddleWidth = 75;
    var paddleX = (canvas.width - paddleWidth) / 2;
    var rightPressed = false;
    var leftPressed = false;
    var brickRowCount = 5;
    var brickColumnCount = 3;
    var brickWidth = 75;
    var brickHeight = 20;
    var brickPadding = 10;
    var brickOffsetTop = 30;
    var brickOffsetLeft = 30;
    var score = 0;
    var highScore = 0;
    var lives = 3;
    var paused = false;

    var startBtn = {
        top: 0,
        left: 0,
        width: 0,
        height: 0,
    };

    var bricks = [];

    for (var c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (var r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }

    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("mousemove", mouseMoveHandler, false);

    var pauseBtn = document.getElementById("pause");
    pauseBtn.addEventListener("click", togglePauseGame, false);

    var resetBtn = document.getElementById("reset");
    resetBtn.addEventListener("click", startNewGame, false);

    var continueBtn = document.getElementById("continue");
    continueBtn.addEventListener("click", continuePlaying, false);

    var reloadBtn = document.getElementById("reload");
    reloadBtn.addEventListener("click", function () {
        location.reload();
    });

    var sliderLabel = document.getElementById("gameSpeed");
    var speedSlider = document.getElementById("speedSlider");
    speedSlider.addEventListener("input", function () {
        sliderLabel.innerHTML = speedSlider.value;
        ballSpeed = 2 * speedSlider.value;
        dx = ballSpeed * Math.sign(dx);
        dy = ballSpeed * Math.sign(dy);
    });

    function keyDownHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = true;
        } else if (e.keyCode == 37) {
            leftPressed = true;
        }
    }

    function keyUpHandler(e) {
        if (e.keyCode == 39) {
            rightPressed = false;
        } else if (e.keyCode == 37) {
            leftPressed = false;
        }
    }

    function mouseMoveHandler(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        if (relativeX > 0 && relativeX < canvas.width) {
            paddleX = relativeX - paddleWidth / 2;
        }
    }

    function collisionDetection() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                var b = bricks[c][r];
                if (b.status == 1) {
                    if (
                        x > b.x &&
                        x < b.x + brickWidth &&
                        y > b.y &&
                        y < b.y + brickHeight
                    ) {
                        dy = -dy;
                        b.status = 0;
                        score++;
                        highScore++;
                        checkWinState();
                    }
                }
            }
        }
    }

    function drawBall() {
        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawPaddle() {
        ctx.beginPath();
        ctx.rect(
            paddleX,
            canvas.height - paddleHeight,
            paddleWidth,
            paddleHeight
        );
        ctx.fillStyle = color1;
        ctx.fill();
        ctx.closePath();
    }

    function drawBricks() {
        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                if (bricks[c][r].status == 1) {
                    var brickX =
                        r * (brickWidth + brickPadding) + brickOffsetLeft;
                    var brickY =
                        c * (brickHeight + brickPadding) + brickOffsetTop;
                    bricks[c][r].x = brickX;
                    bricks[c][r].y = brickY;
                    ctx.beginPath();
                    ctx.rect(brickX, brickY, brickWidth, brickHeight);
                    ctx.fillStyle = color1;
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    function drawScore() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Score: " + score, 60, 20);
    }

    function drawLives() {
        ctx.font = "16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBricks();
        drawBall();
        drawPaddle();
        drawScore();
        drawHighScore();
        drawLives();
        collisionDetection();

        if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
            dx = -dx;
        }
        if (y + dy < ballRadius) {
            dy = -dy;
        } else if (y + dy > canvas.height - ballRadius) {
            if (x > paddleX && x < paddleX + paddleWidth) {
                dy = -dy;
            } else {
                lives--;
                checkWinState();
                x = canvas.width / 2;
                y = canvas.height - 30;
                dx = ballSpeed;
                dy = -ballSpeed;
                paddleX = (canvas.width - paddleWidth) / 2;
            }
        }

        if (rightPressed && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        } else if (leftPressed && paddleX > 0) {
            paddleX -= 7;
        }

        //TODO: adjust speed
        x += dx;
        y += dy;

        //TODO: pause game check
        if (paused == false) {
            requestAnimationFrame(draw);
        }
    }

    /*
                Additions to starter code
            */

    //Additional variables used to help make dimensions/locations easier to reuse
    //controls game speed
    //pause game variable
    //high score tracking variables
    //other variables?

    //event listeners added
    //game speed changes handler
    //pause game event handler
    //start a new game event handler
    //continue playing
    //reload click event listener

    //Drawing a high score
    function drawHighScore() {
        ctx.font = "bold 16px Arial";
        ctx.fillStyle = color1;
        ctx.fillText("High Score: " + highScore, canvas.width / 2, 20);
    }

    //draw the menu screen, including labels and button
    function drawMenu() {
        //draw the rectangle menu backdrop
        setShadow();
        ctx.fillStyle = "lightgreen";
        ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20);

        //draw the menu header
        ctx.font = "bold 30pt Arial";
        ctx.textAlign = "center";
        ctx.fillStyle = "navy";
        ctx.fillText("Breakout", canvas.width / 2, 70);
        //start game button area
        ctx.fillStyle = "navy";
        startBtn.top = 140;
        startBtn.left = canvas.width / 3;
        startBtn.width = canvas.width / 3;
        startBtn.height = 40;
        ctx.fillRect(
            startBtn.left,
            startBtn.top,
            startBtn.width,
            startBtn.height
        );

        resetShadow();

        ctx.font = "bold 20pt Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "lightgreen";
        ctx.fillText(
            "Start Game",
            startBtn.left + startBtn.width / 2,
            startBtn.top + startBtn.height / 2
        );
        //event listener for clicking start
        document.addEventListener("click", startGameClick, false);
        //need to add it here because the menu should be able to come back after
        //we remove the it later
    }

    //function used to set shadow properties
    function setShadow() {
        ctx.shadowBlur = 5;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.shadowColor = "navy";
    }

    //function used to reset shadow properties to 'normal'
    function resetShadow() {
        ctx.shadowBlur = null;
        ctx.shadowOffsetX = null;
        ctx.shadowOffsetY = null;
        ctx.shadowColor = null;
    }

    //function to clear the menu when we want to start the game
    function clearMenu() {
        //remove event listener for menu,
        //we don't want to trigger the start game click event during a game
        document.removeEventListener("click", startGameClick, false);
    }

    //function to start the game
    //this should check to see if the player clicked the button
    //i.e., did the user click in the bounds of where the button is drawn
    //if so, we want to trigger the draw(); function to start our game
    function startGameClick(e) {
        var relativeX = e.clientX - canvas.offsetLeft;
        var relativeY = e.clientY - canvas.offsetTop;
        if (
            relativeX >= startBtn.left &&
            relativeX <= startBtn.left + startBtn.width &&
            relativeY >= startBtn.top &&
            relativeY <= startBtn.top + startBtn.height
        ) {
            console.log("hello");
            clearMenu();
            draw();
        }
    }

    //function to handle game speed adjustments when we move our slider
    function adjustGameSpeed() {
        //update the slider display
        //update the game speed multiplier
    }

    //function to toggle the play/paused game state
    function togglePauseGame() {
        //toggle state
        //if we are not paused, we want to continue animating (hint: zyBook 8.9)
        if (paused) {
            paused = false;
            requestAnimationFrame(draw);
        } else {
            paused = true;
        }
    }

    //function to check win state
    //if we win, we want to accumulate high score and draw a message to the canvas
    //if we lose, we want to draw a losing message to the canvas
    function checkWinState() {
        if (lives <= 0) {
            ctx.fillStyle = "black";
            ctx.fillRect(
                0,
                startBtn.top - 10,
                canvas.width,
                startBtn.height + 20
            );
            ctx.font = "25pt Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "red";
            ctx.fillText(
                "YOU DIED",
                startBtn.left + startBtn.width / 2,
                startBtn.top + startBtn.height / 2
            );
            paused = true;
        }
        if (score == brickRowCount * brickColumnCount) {
            ctx.font = "bold 20pt Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillStyle = "Black";
            ctx.fillText(
                "You Win!",
                startBtn.left + startBtn.width / 2,
                startBtn.top + startBtn.height / 2
            );
            paused = true;
        }
    }

    //function to clear the board state and start a new game (no high score accumulation)
    function startNewGame(resetScore) {
        highScore = 0;
        lives = 3;
        resetBoard();
        paused = false;
        draw();
    }

    //function to reset the board and continue playing (accumulate high score)
    //should make sure we didn't lose before accumulating high score
    function continuePlaying() {
        if (lives == 0) {
            alert('You lost. Click "Reset" instead');
        } else {
            resetBoard();
            paused = false;
            draw();
        }
    }

    //function to reset starting game info
    function resetBoard(resetLives) {
        //reset paddle position
        //reset bricks
        //reset score
        x = canvas.width / 2;
        y = canvas.height - 30;
        paddleX = (canvas.width - paddleWidth) / 2;
        score = 0;

        for (var c = 0; c < brickColumnCount; c++) {
            for (var r = 0; r < brickRowCount; r++) {
                bricks[c][r].status = 1;
            }
        }
    }

    //draw the menu.
    //we don't want to immediately draw... only when we click start game
    drawMenu();
}; //end window.onload function
