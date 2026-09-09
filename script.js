

const colors = [
    "green",
    "red",
    "yellow",
    "blue"
];


const startButton =
    document.getElementById("startButton");

const message =
    document.getElementById("message");

const levelText =
    document.getElementById("level");

const scoreLabel =
    document.getElementById("scoreLabel");

const bestScoreText =
    document.getElementById("bestScore");

const pads =
    document.querySelectorAll(".pad");


let gameSequence = [];

let playerSequence = [];

let level = 0;

let score = 0;

const bestScoreKey = "simonBestScore";

let bestScore =
    Number(localStorage.getItem(bestScoreKey)) || 0;

bestScoreText.textContent = bestScore;

let gameRunning = false;

let acceptingInput = false;



startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    gameSequence = [];

    playerSequence = [];

    level = 0;

    score = 0;

    gameRunning = true;

    acceptingInput = false;


    levelText.textContent = "0";

    document.getElementById("score").textContent = "0";

    scoreLabel.textContent = "Score";

    message.textContent =
        "Watch the sequence";


    message.classList.remove(
        "game-over"
    );


    startButton.textContent =
        "Restart Game";


    nextLevel();
}



function nextLevel() {

    playerSequence = [];

    acceptingInput = false;


    level++;

    levelText.textContent =
        level;


    message.textContent =
        "Watch the sequence";


    const randomIndex =
        Math.floor(
            Math.random() * colors.length
        );


    const randomColor =
        colors[randomIndex];


    gameSequence.push(
        randomColor
    );


    playSequence();
}



async function playSequence() {

    acceptingInput = false;


    setPadsDisabled(true);


    await sleep(500);


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


    setPadsDisabled(false);

    acceptingInput = true;


    message.textContent =
        "Your turn";
}



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



pads.forEach(
    function(pad) {

        pad.addEventListener(
            "click",
            function() {

                if (
                    !gameRunning ||
                    !acceptingInput
                ) {
                    return;
                }


                const selectedColor =
                    pad.dataset.color;


                playerSequence.push(
                    selectedColor
                );


                flashPlayerPad(pad);


                checkAnswer();

            }
        );

    }
);



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



function checkAnswer() {

    const currentIndex =
        playerSequence.length - 1;


    const correctColor =
        gameSequence[currentIndex];


    const playerColor =
        playerSequence[currentIndex];



    if (
        playerColor !== correctColor
    ) {

        gameOver();

        return;
    }



    if (
        playerSequence.length ===
        gameSequence.length
    ) {

        acceptingInput = false;

        score++;

        document.getElementById("score").textContent = score;

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



function gameOver() {

    gameRunning = false;

    acceptingInput = false;


    setPadsDisabled(true);

    if (score > bestScore) {
        bestScore = score;

        localStorage.setItem(
            bestScoreKey,
            bestScore
        );

        bestScoreText.textContent = bestScore;
    }


    message.textContent =
        "Game Over - Score: " + score;

    scoreLabel.textContent = "Final Score";


    message.classList.add(
        "game-over"
    );


    startButton.textContent =
        "Play Again";
}



function setPadsDisabled(
    disabled
) {

    pads.forEach(
        function(pad) {

            pad.disabled = disabled;

        }
    );
}



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