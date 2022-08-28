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
const NUMBER_OF_ENEMIES_ROWS = 3;

const getRandomNumber = (a) => Math.floor(Math.random() * a);
const getEnemyRowPosition = (numberOfRows) =>
  ENEMY_POSITION_CORRECTION + CELL_HEIGHT * getRandomNumber(numberOfRows);

// for better calculation of the collision between the player and enemies -
// due to the fact that the player's picture is narrower than the size of the cell
const PLAYER_WIDTH_CORRECTION = 80;
//for better positioning of the player in the cell. depends on the picture of player.
const PLAYER_POSITION_CORRECTION = 3;

// ===========SCORE block ====================================================
const score = document.createElement("div");
document.body.append(score);
score.style.fontSize = "2rem";
score.style.fontFamily = "Arial";
let wins = 0;
let looses = 0;
score.textContent = "Losses - " + looses + " _ " + "Wins - " + wins;

// ===========ENEMY================================================================
const Enemy = function (x, y, speed) {
  this.speed = speed;
  this.x = x;
  this.y = y;
  this.rowPosition = (this.y - ENEMY_POSITION_CORRECTION) / CELL_HEIGHT + 1;
  this.sprite = "images/enemy-bug.png";
};
Enemy.prototype.update = function (dt) {
  this.x = this.x + this.speed * dt;
  if (this.x > FIELD_WIDTH) {
    this.x = -CELL_WIDTH;
    this.y = getEnemyRowPosition(NUMBER_OF_ENEMIES_ROWS);
    this.rowPosition = (this.y - ENEMY_POSITION_CORRECTION) / CELL_HEIGHT + 1;
    this.speed = getRandomNumber(speedIncrease) + minEnemySpeed;
  }
  this.checkCollision();
};
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
Enemy.prototype.checkCollision = function () {
  const startCollision = player.x - PLAYER_WIDTH_CORRECTION;
  const stopCollision = player.x + PLAYER_WIDTH_CORRECTION;

  if (
    this.rowPosition === player.rowPosition &&
    this.x >= startCollision &&
    this.x <= stopCollision
  ) {
    player.setStartPosition();
    looses += 1;
    score.textContent = "Losses - " + looses + " _ " + "Wins - " + wins;
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
    wins += 1;
    score.textContent = "Losses - " + looses + " _ " + "Wins - " + wins;
    this.setStartPosition();
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

// ================gems
// const Gem = function (x, y) {
//   this.x = x;
//   this.y = y;
//   this.rowPosition = (this.y - ENEMY_POSITION_CORRECTION) / CELL_HEIGHT + 1;
//   this.sprite = "images/Gem Blue.png";
// };
// Enemy.prototype.update = function (dt) {
//   this.x = this.x + this.speed * dt;

//   this.checkCollision();
// };
// Enemy.prototype.render = function () {
//   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };
// Enemy.prototype.checkCollision = function () {
//   const startCollision = player.x - PLAYER_WIDTH_CORRECTION;
//   const stopCollision = player.x + PLAYER_WIDTH_CORRECTION;

//   if (
//     this.rowPosition === player.rowPosition &&
//     this.x >= startCollision &&
//     this.x <= stopCollision
//   ) {
//     player.setStartPosition();
//     looses += 1;
//     score.textContent = "Losses - " + looses + " _ " + "Wins - " + wins;
//   }
// };

const player = new Player(PLAYER_START_POSITION);
// const gem = new Gem ();
const allEnemies = [];

function createNewBug(numberOfEnemies) {
  for (let i = 0; i < numberOfEnemies; i += 1) {
    const x = getRandomNumber(FIELD_WIDTH);
    const y = getEnemyRowPosition(NUMBER_OF_ENEMIES_ROWS);
    const speed = getRandomNumber(speedIncrease) + minEnemySpeed;
    const newEnemy = new Enemy(x, y, speed);
    allEnemies.push(newEnemy);
  }
}

createNewBug(numberOfEnemies);

document.addEventListener("keyup", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
