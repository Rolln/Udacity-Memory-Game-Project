//Game direction by Matthew Cranford

//Global Scope
const deck = document.querySelector(".deck");
let toggledCards = []; //array to store open cards
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;

//Modal Tests
//time = 121;
//displayTime(); //2:01
//moves = 16;
//checkScore(); //2 stars

//Write stats to modal
//toggleModal(); //Open Modal

function shuffleDeck() {
  //Array.from used to display a node list as an array
  const cardsToShuffle = Array.from(document.querySelectorAll(".deck li"));

  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    // .appendChild instead of .innerHTML to store a node element
    deck.appendChild(card);
  }
}
shuffleDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//click event handler
deck.addEventListener("click", function() {
  const clickTarget = event.target;
  if (isClickValid(clickTarget)) {
    if (clockOff) {
      startClock();
      clockOff = false;
    }
  }
  toggleCard(clickTarget);
  addToggleCard(clickTarget);
  if (toggledCards.length === 2) {
    checkForMatch(clickTarget);
    addMove();
    checkScore();
  }
  const TOTAL_PAIRS = 8;
  if (matched === TOTAL_PAIRS) {
    gameOver();
  }
});

//Flip Cards
function toggleCard(card) {
  card.classList.toggle("open");
  card.classList.toggle("show");
}

//Pushes open cards into the toggledCards array
function addToggleCard(clickTarget) {
  toggledCards.push(clickTarget);
  //console.log(toggledCards);
}

//Check matching cards
function checkForMatch() {
  if (
    toggledCards[0].firstElementChild.className ===
    toggledCards[1].firstElementChild.className
  ) {
    toggledCards[0].classList.toggle("match");
    toggledCards[1].classList.toggle("match");
    toggledCards = [];
    matched++;

    //console.log(matched);
  } else {
    setTimeout(function() {
      toggleCard(toggledCards[0]);
      toggleCard(toggledCards[1]);
      toggledCards = [];
    }, 1000);
  }
}

function isClickValid(clickTarget) {
  return (
    clickTarget.classList.contains("card") &&
    !clickTarget.classList.contains("match") &&
    toggledCards.length < 2 &&
    !toggledCards.includes(clickTarget)
  );
}

//Count number of moves
function addMove() {
  moves++;
  const movesText = document.querySelector(".moves");
  movesText.innerHTML = moves;
}

function checkScore() {
  if (moves === 16 || moves === 24) {
    hideStar();
  }
}

function hideStar() {
  const starList = document.querySelectorAll(".stars li");
  for (star of starList) {
    if (star.style.display !== "none") {
      star.style.display = "none";
      break;
    }
  }
}
// hideStar();
// hideStar();

function startClock() {
  clockId = setInterval(() => {
    time++;
    displayTime();
  }, 1000);
}

//Clock
function stopClock() {
  clearInterval(clockId);
}

function displayTime() {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const clock = document.querySelector(".clock");
  clock.innerHTML = time;
  if (seconds < 10) {
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

function toggleModal() {
  const modal = document.querySelector(".modal_background");
  modal.classList.toggle("hide");
}

toggleModal(); //Open modal
toggleModal(); //Close modal

function writeModalStats() {
  const timeStat = document.querySelector(".modal_time");
  const clockTime = document.querySelector(".clock").innerHTML;
  const movesStat = document.querySelector(".modal_moves");
  const starsStat = document.querySelector(".modal_stars");
  const stars = getStars();

  timeStat.innerHTML = `Time = ${clockTime}`;
  movesStat.innerHTML = `Moves = ${moves}`;
  starsStat.innerHTML = `Stars = ${stars}`;
}

function getStars() {
  stars = document.querySelectorAll(".stars li");
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== "none") {
      starCount++;
    }
  }
  return starCount;
}

document.querySelector(".modal_cancel").addEventListener("click", function() {
  toggleModal();
});

document.querySelector(".modal_replay").addEventListener("click", replayGame);

document.querySelector(".restart").addEventListener("click", resetGame);

function resetGame() {
  resetClockAndTime();
  resetMoves();
  resetStars();
  resetCards();
  shuffleDeck();
}

function resetClockAndTime() {
  stopClock();
  clockOff = true;
  time = 0;
  displayTime();
}

function resetMoves() {
  moves = 0;
  document.querySelector(".moves").innerHTML = moves;
}

function resetStars() {
  stars = 0;
  const starList = document.querySelectorAll(".stars li");
  for (star of starList) {
    star.style.display = "inline";
  }
}

function gameOver() {
  stopClock();
  writeModalStats();
  toggleModal();
}

function replayGame() {
  resetGame();
  toggleModal();
}

function resetCards() {
  const cards = document.querySelectorAll(".deck li");
  for (let card of cards) {
    card.className = "card";
  }
}
