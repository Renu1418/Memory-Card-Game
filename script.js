document.addEventListener("DOMContentLoaded", () => {
    const nameScreen = document.getElementById('name-screen');  // Keep name input visible
    const gameContainer = document.getElementById('game-container');  // Game screen is always visible
    const playBtn = document.getElementById('play-btn');
    const playerNameInput = document.getElementById('player-name');
    const scoreElement = document.getElementById('score');
    const flipsLeftElement = document.getElementById('flips-left');
    const gameMessage = document.getElementById('game-message');
    const restartBtn = document.getElementById('restart-btn');

    let playerName = '';
    let score = 0;
    let flipsLeft = 15;
    let hasFlippedCard = false;
    let lockBoard = true;  // Start with the board locked
    let firstCard, secondCard;
    const cards = [
        { name: "apple", img: "images/apple.png" },
        { name: "car", img: "images/car.png" },
        { name: "child", img: "images/child.png" },
        { name: "home", img: "images/home.png" },
        { name: "lion", img: "images/lion.png" },
        { name: "monkey", img: "images/monkey.png" },
    ];

    // Function to start the game after entering name
    function playGame() {
        playerName = playerNameInput.value.trim();
        if (playerName === '') {
            alert('Please enter your name');
            return;
        }

        nameScreen.classList.add('hidden');  // Hide the name input screen
        lockBoard = false;  // Unlock the game board so that it can start
        initializeGame();
    }

    // Initialize the game by resetting and generating cards
    function initializeGame() {
        resetBoard();
        shuffleCards();
        generateCards();
    }

    // Reset game variables and UI
    function resetBoard() {
        score = 0;
        flipsLeft = 15;
        scoreElement.textContent = score;
        flipsLeftElement.textContent = flipsLeft;
        gameMessage.textContent = '';
        restartBtn.classList.add('hidden');
        hasFlippedCard = false;
    }

    // Shuffle the cards randomly
    function shuffleCards() {
        cards.sort(() => Math.random() - 0.5);
    }

    // Generate cards dynamically and add event listeners
    function generateCards() {
        const memoryGame = document.querySelector('.memory-game');
        memoryGame.innerHTML = '';  // Clear previous cards
        const doubledCards = [...cards, ...cards];  // Duplicate cards

        doubledCards.sort(() => Math.random() - 0.5);

        doubledCards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.setAttribute('data-card', card.name);

            cardElement.innerHTML = `
                <div class="front-face"></div>
                <div class="back-face"><img src="${card.img}" alt="${card.name}"></div>
            `;

            memoryGame.appendChild(cardElement);
            cardElement.addEventListener('click', flipCard);
        });
    }

    // Handle card flip logic
    function flipCard() {
        if (lockBoard || this === firstCard || this.classList.contains('done')) return;  // Game only works when board is unlocked

        this.classList.add('flipped');

        if (!hasFlippedCard) {
            hasFlippedCard = true;
            firstCard = this;
            return;
        }

        secondCard = this;
        checkForMatch();
    }

    // Check if two flipped cards match
    function checkForMatch() {
        const isMatch = firstCard.dataset.card === secondCard.dataset.card;

        if (isMatch) {
            disableCards();
            score++;
            scoreElement.textContent = score;
            if (score === cards.length) {
                gameOver(true); // Player wins
            }
        } else {
            unflipCards();
        }
        flipsLeft--;
        flipsLeftElement.textContent = flipsLeft;

        // Game over conditions
        if (flipsLeft === 0) {
            if (score < cards.length) {
                gameOver(false); // Player loses
            } else {
                gameOver(true); // Player wins (in case all cards are matched)
            }
        }
    }

    // Disable matched cards
    function disableCards() {
        firstCard.classList.add('done');
        secondCard.classList.add('done');
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        resetTurn();
    }

    // Unflip unmatched cards
    function unflipCards() {
        lockBoard = true;
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetTurn();
        }, 1500);
    }

    // Reset turn variables
    function resetTurn() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }

    // Handle game over logic
    function gameOver(won) {
        gameMessage.textContent = `${playerName}, you ${won ? 'won' : 'lost'}!`;
        restartBtn.classList.remove('hidden');
        lockBoard = true; // Stop any further interactions with the cards
    }

    // Restart the game
    function restartGame() {
        lockBoard = false;  // Unlock the game board for a new round
        initializeGame();
    }

    // Event listeners
    playBtn.addEventListener('click', playGame);
    restartBtn.addEventListener('click', restartGame);
    
    // Initialize the game layout on load but keep it locked
    generateCards();  // Game interface is always visible
});