"use strict";

/**
 * Globalt objekt som innehåller de attribut som ni skall använda.
 * Initieras genom anrop till funktionern initGlobalObject().
 */
let oGameData = {};

window.addEventListener('load', () => {
    initGlobalObject();
    prepGame();
    // if(checkForGameOver() === 1) {
    //     console.log("Spelare 1 vann");        
    // } else if(checkForGameOver() === 2) {
    //     console.log("Spelare 2 vann");
    // } else if(checkForGameOver() === 3) {
    //     console.log("Oavgjort");
    // } else {
    //     console.log("Spelet fortsätter");
    // }
});

/**
 * Initerar det globala objektet med de attribut som ni skall använda er av.
 * Funktionen tar inte emot några värden.
 * Funktionen returnerar inte något värde.
 */
function initGlobalObject() {

    //Datastruktur för vilka platser som är lediga respektive har brickor
    //Genom at fylla i här med antingen X eler O kan ni testa era rättningsfunktioner 
    oGameData.gameField = ['', '', '', '', '', '', '', '', ''];
    
    /* Testdata för att testa rättningslösning */
    //oGameData.gameField = ['X', 'X', 'X', '', '', '', '', '', ''];
    //oGameData.gameField = ['X', '', '', 'X', '', '', 'X', '', ''];
    //oGameData.gameField = ['X', '', '', '', 'X', '', '', '', 'X'];
    //oGameData.gameField = ['', '', 'O', '', 'O', '', 'O', '', ''];
    //oGameData.gameField = ['X', 'O', 'X', '0', 'X', 'O', 'O', 'X', 'O'];

    //Indikerar tecknet som skall användas för spelare ett.
    oGameData.playerOne = "X";

    //Indikerar tecknet som skall användas för spelare två.
    oGameData.playerTwo = "O";

    //Kan anta värdet X eller O och indikerar vilken spelare som för tillfället skall lägga sin "bricka".
    oGameData.currentPlayer = "";

    //Nickname för spelare ett som tilldelas från ett formulärelement,
    oGameData.nickNamePlayerOne = "";

    //Nickname för spelare två som tilldelas från ett formulärelement.
    oGameData.nickNamePlayerTwo = "";

    //Färg för spelare ett som tilldelas från ett formulärelement.
    oGameData.colorPlayerOne = "";

    //Färg för spelare två som tilldelas från ett formulärelement.
    oGameData.colorPlayerTwo = "";

    //Antalet sekunder för timerfunktionen
    oGameData.seconds = 5;

    //Timerns ID
    oGameData.timerId = null;

    //Från start är timern inaktiverad
    oGameData.timerEnabled = false;

    //Referens till element för felmeddelanden
    oGameData.timeRef = document.querySelector("#errorMsg");
}

const log = (msg) => console.log(msg);

/**
 * Kontrollerar för tre i rad genom att anropa funktionen checkWinner() och checkForDraw().
 * Returnerar 0 om spelet skall fortsätta, 
 * returnerar 1 om spelaren med ett kryss (X) är vinnare,
 * returnerar 2 om spelaren med en cirkel (O) är vinnare eller
 * returnerar 3 om det är oavgjort.
 * Funktionen tar inte emot några värden.
 */
function checkForGameOver() {
    if (checkWinner('X')){
    return 1;
    } else if (checkWinner('O')){
        return 2;
    } else if(checkForDraw()) {
        return 3;
    } else {
        return 0;
    }
}

// Säg till om ni vill få pseudokod för denna funktion
// Viktigt att funktionen returnerar true eller false baserat på om den inskickade spelaren är winner eller ej
function checkWinner(playerIn) {
    const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let isWinner = false;

    for (let combination of winningCombos) {
        // Läs in alla positioner från gameField som motsvarar nuvarande combination
        let a = oGameData.gameField[combination[0]];
        let b = oGameData.gameField[combination[1]];
        let c = oGameData.gameField[combination[2]];

        if(playerIn === a && playerIn === b && playerIn === c) {
            isWinner = true;
            return isWinner;
        }
    }

    return isWinner;
}

//Kontrollera om alla platser i oGameData.GameField är fyllda. Om sant returnera true, annars false.
function checkForDraw() {
    if(oGameData.gameField.includes('')) {
        return false;
    } else {
        return true;
    }
}

// Nedanstående funktioner väntar vi med!
function prepGame() {
    log('prepGame()');

    const gameAreaRef = document.querySelector('#gameArea');
    gameAreaRef.classList.add('d-none');

    const startGameBtnRef = document.querySelector('#newGame');
    startGameBtnRef.addEventListener('click', initiateGame);
}

function initiateGame() {
    log('initiateGame()');
    
    const formRef = document.querySelector('#theForm');
    formRef.classList.add('d-none');

    const gameAreaRef = document.querySelector('#gameArea');
    gameAreaRef.classList.remove('d-none');

    const errorMsgRef = document.querySelector('#errorMsg');
    errorMsgRef.textContent = '';

    oGameData.nickNamePlayerOne = document.querySelector('#nick1').value;
    oGameData.colorPlayerOne = document.querySelector('#color1').value;
    oGameData.nickNamePlayerTwo = document.querySelector('#nick2').value;
    oGameData.colorPlayerTwo = document.querySelector('#color2').value;
    
    const tdRefs = document.querySelectorAll('td');
    for(let tdRef of tdRefs) {
        tdRef.textContent = '';
        tdRef.style.backgroundColor = '#ffffff';
    }

    let playerName = '';
    let playerChar = '';

    const random = Math.random();
    if(random < 0.5) {
        playerName = oGameData.nickNamePlayerOne;
        playerChar = oGameData.playerOne;
        oGameData.currentPlayer = oGameData.playerOne;
    } else {
        playerName = oGameData.nickNamePlayerTwo;
        playerChar = oGameData.playerTwo;
        oGameData.currentPlayer = oGameData.playerTwo;
    }

    let msgRef = document.querySelector('.jumbotron > h1');
    msgRef.textContent = `Aktuell spelare är ${playerName}`;
    
    gameAreaRef.addEventListener('click', executeMove);
}

function executeMove (event) {
    log('executeMove()');
    if(event.target.tagName === 'TD') {
        if(event.target.textContent === '') {
            let id = event.target.dataset.id;
            oGameData.gameField[id] = oGameData.currentPlayer;
            event.target.textContent = oGameData.currentPlayer;
            let name = '';
            if(oGameData.currentPlayer === 'X') {
                event.target.style.backgroundColor = oGameData.colorPlayerOne;
                name = oGameData.nickNamePlayerTwo;
                changePlayer('O');
            } else {
                event.target.style.backgroundColor = oGameData.colorPlayerTwo;
                name = oGameData.nickNamePlayerOne;
                changePlayer('X');
            }
            let msgRef = document.querySelector('.jumbotron > h1');
            msgRef.textContent = `Aktuell spelare är ${name}`;

            if(checkForGameOver() === 1) {
                gameOver(1);
            } else if(checkForGameOver() === 2) {
                gameOver(2);
            } else if(checkForGameOver() === 3) {
                gameOver(3);
            }
        }
    }
}

function changePlayer(player) {
    log('changePlayer()');
    oGameData.currentPlayer = player;
}



function gameOver(result) {
    log(result);
    const gameAreaRef = document.querySelector('#gameArea');
    gameAreaRef.removeEventListener('click', executeMove);
    gameAreaRef.classList.add('d-none');

    const formRef = document.querySelector('#theForm');
    formRef.classList.remove('d-none');

    let winner = '';
    if(result === 1) {
        winner = oGameData.nickNamePlayerOne;
    } else if(result === 2) {
        winner = oGameData.nickNamePlayerTwo;
    } else {
        winner = 'Ingen';
    }

    let msgRef = document.querySelector('.jumbotron > h1');
    msgRef.textContent = `${winner} vann! Spela igen?`;
    initGlobalObject();
}


function validateForm() {

}

function timer() {

}