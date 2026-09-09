// ========================================
// SIMON GAME
// ========================================


// Available colors
const colors = [
    "green",
    "red",
    "yellow",
    "blue"
];


// Get HTML elements
const startButton =
    document.getElementById("startButton");

const message =
    document.getElementById("message");

const levelText =
    document.getElementById("level");

const pads =
    document.querySelectorAll(".pad");


// Game variables
let gameSequence = [];

let playerSequence = [];

let level = 0;

let gameRunning = false;

let acceptingInput = false;


// ========================================
// START GAME
// ========================================

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    // Reset game
    gameSequence = [];

    playerSequence = [];

    level = 0;

    gameRunning = true;

    acceptingInput = false;


    // Update screen
    levelText.textContent = "0";

    message.textContent =
        "Watch the sequence";


    message.classList.remove(
        "game-over"
    );


    startButton.textContent =
        "Restart Game";


    // Start first level
    nextLevel();
}


// ========================================
// NEXT LEVEL
// ========================================

function nextLevel() {

    // Clear player's previous input
    playerSequence = [];

    acceptingInput = false;


    // Increase level
    level++;

    levelText.textContent =
        level;


    message.textContent =
        "Watch the sequence";


    // Generate random color
    const randomIndex =
        Math.floor(
            Math.random() * colors.length
        );


    const randomColor =
        colors[randomIndex];


    // Add color to sequence
    gameSequence.push(
        randomColor
    );


    // Play sequence
    playSequence();
}


// ========================================
// PLAY COMPUTER SEQUENCE
// ========================================

async function playSequence() {

    acceptingInput = false;


    // Disable buttons
    setPadsDisabled(true);


    // Small delay before sequence
    await sleep(500);


    // Play each color
    for (
        let i = 0;
        i < gameSequence.length;
        i++
    ) {

        const color =
            gameSequence[i];


        await flashPad(color);


        await sleep(250);
    }


    // Enable player input
    setPadsDisabled(false);

    acceptingInput = true;


    message.textContent =
        "Your turn";
}


// ========================================
// FLASH PAD
// ========================================

function flashPad(color) {

    return new Promise(
        function(resolve) {

            const pad =
                document.getElementById(
                    color
                );


            if (!pad) {
                resolve();
                return;
            }


            pad.classList.add(
                "active"
            );


            setTimeout(
                function() {

                    pad.classList.remove(
                        "active"
                    );


                    resolve();

                },
                450
            );

        }
    );
}


// ========================================
// PLAYER CLICK
// ========================================

pads.forEach(
    function(pad) {

        pad.addEventListener(
            "click",
            function() {

                // Ignore click when game isn't accepting input
                if (
                    !gameRunning ||
                    !acceptingInput
                ) {
                    return;
                }


                // Get selected color
                const selectedColor =
                    pad.dataset.color;


                // Add to player sequence
                playerSequence.push(
                    selectedColor
                );


                // Small click animation
                flashPlayerPad(pad);


                // Check answer
                checkAnswer();

            }
        );

    }
);


// ========================================
// PLAYER PAD ANIMATION
// ========================================

function flashPlayerPad(pad) {

    pad.classList.add("active");


    setTimeout(
        function() {

            pad.classList.remove(
                "active"
            );

        },
        180
    );
}


// ========================================
// CHECK PLAYER ANSWER
// ========================================

function checkAnswer() {

    // Position of the last clicked color
    const currentIndex =
        playerSequence.length - 1;


    // Correct color at this position
    const correctColor =
        gameSequence[currentIndex];


    // Player's color
    const playerColor =
        playerSequence[currentIndex];


    // ------------------------------------
    // WRONG ANSWER
    // ------------------------------------

    if (
        playerColor !== correctColor
    ) {

        gameOver();

        return;
    }


    // ------------------------------------
    // WHOLE SEQUENCE COMPLETED
    // ------------------------------------

    if (
        playerSequence.length ===
        gameSequence.length
    ) {

        acceptingInput = false;

        message.textContent =
            "Correct!";


        setTimeout(
            function() {

                nextLevel();

            },
            800
        );
    }
}


// ========================================
// GAME OVER
// ========================================

function gameOver() {

    gameRunning = false;

    acceptingInput = false;


    setPadsDisabled(true);


    message.textContent =
        "Game Over - Level " + level;


    message.classList.add(
        "game-over"
    );


    startButton.textContent =
        "Play Again";
}


// ========================================
// DISABLE / ENABLE PADS
// ========================================

function setPadsDisabled(
    disabled
) {

    pads.forEach(
        function(pad) {

            pad.disabled = disabled;

        }
    );
}


// ========================================
// WAIT FUNCTION
// ========================================

function sleep(milliseconds) {

    return new Promise(
        function(resolve) {

            setTimeout(
                resolve,
                milliseconds
            );

        }
    );
}