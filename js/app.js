"use strict";

const CELL_WIDTH = 101;
const CELL_HEIGHT = 83;

const NUMBER_OF_COLUMNS = 5;
const NUMBER_OF_ROWS = 5;

const FIELD_WIDTH = CELL_WIDTH * NUMBER_OF_COLUMNS;
const FIELD_HEIGHT = CELL_HEIGHT * NUMBER_OF_ROWS;

const PLAYER_START_POSITION = {
  x: CELL_WIDTH * Math.floor(NUMBER_OF_COLUMNS / 2),
  y: CELL_HEIGHT * NUMBER_OF_ROWS,
  rowPosition: NUMBER_OF_ROWS,
};

const minEnemySpeed = 100;
const speedIncrease = 70;
const numberOfEnemies = 5;

const ENEMY_POSITION_CORRECTION = 62;
const STAR_POSITION_CORRECTION = 72;
const NUMBER_OF_DANGER_ROWS = 3;

const getRandomNumber = (a) => Math.floor(Math.random() * a);
const getItemRowPosition = (numberOfRows) =>
  CELL_HEIGHT * getRandomNumber(numberOfRows);

// for better calculation of the collision between the player and enemies -
// due to the fact that the player's picture is narrower than the size of the cell
const PLAYER_WIDTH_CORRECTION = 80;
//for better positioning of the player in the cell. depends on the picture of player.
const PLAYER_POSITION_CORRECTION = 3;

// ===========SCORE block ====================================================
const bestScore = document.createElement("div");
document.body.append(bestScore);
bestScore.style.fontSize = "2rem";
bestScore.style.fontFamily = "Arial";
let bestLevel = 1;
let bestStars = 0;
bestScore.textContent =
  "BEST SCORE: ★ - " + bestStars + ", " + "LEVEL - " + bestLevel;

const score = document.createElement("div");
document.body.append(score);
score.style.fontSize = "2rem";
score.style.fontFamily = "Arial";
let level = 1;
let stars = 0;
score.textContent = "★ - " + stars + " _ " + "Level - " + level;
// ===========ENEMY================================================================
const Enemy = function (x, y, speed, victim) {
  this.speed = speed;
  this.x = x;
  this.y = y;
  this.victim = victim;

  this.rowPosition = (this.y - ENEMY_POSITION_CORRECTION) / CELL_HEIGHT + 1;
  this.sprite = "images/enemy-bug.png";
};
Enemy.prototype.update = function (dt) {
  this.x = this.x + this.speed * dt;
  if (this.x > FIELD_WIDTH) {
    this.x = -CELL_WIDTH;
    this.y =
      getItemRowPosition(NUMBER_OF_DANGER_ROWS) + ENEMY_POSITION_CORRECTION;
    this.rowPosition = (this.y - ENEMY_POSITION_CORRECTION) / CELL_HEIGHT + 1;
    this.speed = getRandomNumber(speedIncrease) + minEnemySpeed;
  }

  this.checkCollision();
};
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Enemy.prototype.checkCollision = function () {
  if (this.victim.y > 0) {
    const startCollision = this.victim.x - PLAYER_WIDTH_CORRECTION;
    const stopCollision = this.victim.x + PLAYER_WIDTH_CORRECTION;

    if (
      this.rowPosition === this.victim.rowPosition &&
      this.x >= startCollision &&
      this.x <= stopCollision
    ) {
      this.victim.setStartPosition();
      allEnemies.splice(1);
      bestStars = stars > bestStars ? stars : bestStars;
      bestLevel = level > bestLevel ? level : bestLevel;
      stars = 0;
      level = 1;
      score.textContent = "★ - " + stars + " _ " + "Level - " + level;
      bestScore.textContent =
        "BEST SCORE: ★ - " + bestStars + ", " + "LEVEL - " + bestLevel;
    }
  }
};

// =========== Player==================================================
const Player = function (position) {
  this.score = 0;
  this.startPosition = position;
  this.setStartPosition();
  this.sprite = "images/char-cat-girl.png";
};
Player.prototype.setStartPosition = function () {
  this.rowPosition = this.startPosition.rowPosition;
  this.x = this.startPosition.x;
  this.y = this.startPosition.y - PLAYER_POSITION_CORRECTION * this.rowPosition;
  console.log(this.y);
};
Player.prototype.update = function (dt) {
  //  reached right/left borders
  if (this.x > FIELD_WIDTH - CELL_WIDTH) {
    this.x = FIELD_WIDTH - CELL_WIDTH;
  } else if (this.x < 0) {
    this.x = 0;
  }
  //  reached the water or bottom border
  if (this.y > FIELD_HEIGHT) {
    this.y = FIELD_HEIGHT - PLAYER_POSITION_CORRECTION * this.rowPosition;
  } else if (this.y === 0) {
    this.setStartPosition();
    level += 1;
    score.textContent = "★ - " + stars + " _ " + "Level - " + level;
    createNewEnemy(1, player);
    star.newPosition();
  }
};
Player.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Player.prototype.handleInput = function (pressedKey) {
  switch (pressedKey) {
    case "right":
      this.x += CELL_WIDTH;
      break;
    case "left":
      this.x -= CELL_WIDTH;
      break;
    case "up":
      this.y -= CELL_HEIGHT - PLAYER_POSITION_CORRECTION;
      this.rowPosition -= 1;
      break;
    case "down":
      this.y += CELL_HEIGHT - PLAYER_POSITION_CORRECTION;
      this.rowPosition < NUMBER_OF_ROWS
        ? (this.rowPosition += 1)
        : this.rowPosition;
      break;
  }
};
Player.prototype.getPosition = function () {
  return [this.x, this.rowPosition];
};

const Star = function (hunter) {
  this.hunter = hunter;
  this.sprite = "images/Star.png";
};
Star.prototype.update = function (dt) {
  this.checkCollision();
};
Star.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Star.prototype.newPosition = function () {
  this.x = getRandomNumber(NUMBER_OF_COLUMNS) * CELL_WIDTH;
  this.y = getItemRowPosition(NUMBER_OF_DANGER_ROWS) + STAR_POSITION_CORRECTION;
  this.rowPosition = (this.y - STAR_POSITION_CORRECTION) / CELL_HEIGHT + 1;
};
Star.prototype.checkCollision = function () {
  if (
    this.rowPosition === this.hunter.rowPosition &&
    this.x === this.hunter.x
  ) {
    this.x = -101;
    this.y = -171;
    stars += 1;
    score.textContent = "★ - " + stars + " _ " + "Level - " + level;
  }
};

const player = new Player(PLAYER_START_POSITION);

const star = new Star(player);
star.newPosition();

const allEnemies = [];

function createNewEnemy(numberOfEnemies, victim) {
  for (let i = 0; i < numberOfEnemies; i += 1) {
    const x = getRandomNumber(FIELD_WIDTH);
    const y =
      getItemRowPosition(NUMBER_OF_DANGER_ROWS) + ENEMY_POSITION_CORRECTION;
    const speed = getRandomNumber(speedIncrease) + minEnemySpeed;
    const newEnemy = new Enemy(x, y, speed, victim);
    allEnemies.push(newEnemy);
  }
}

createNewEnemy(1, player);

document.addEventListener("keyup", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

(function addSwipeEventListener() {
  document.addEventListener("touchstart", handleTouchStart, false); //swipes handler for move player
  document.addEventListener("touchmove", handleTouchMove, false); //swipes handler for move player

  var xDown = null;
  var yDown = null;

  function handleTouchStart(evt) {
    const firstTouch = evt.touches[0];
    xDown = firstTouch.clientX; //finger down
    yDown = firstTouch.clientY; //finger down
  }

  function handleTouchMove(evt) {
    if (!xDown || !yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX; //finger up
    var yUp = evt.touches[0].clientY; //finger up

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 0) {
        /* left swipe */
        player.handleInput("left");
      } else {
        /* right swipe */
        player.handleInput("right");
      }
    } else {
      if (yDiff > 0) {
        /* up swipe */
        player.handleInput("up");
      } else {
        /* down swipe */
        player.handleInput("down");
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  }
})();
