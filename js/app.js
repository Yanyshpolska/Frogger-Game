"use strict";
const playerWidth = 80;

const CELL = {
  width: 101,
  height: 80,
};
const gameField = {
  width: CELL.width * 5,
  height: CELL.height * 5,
};
const playerStartPosition = {
  width: CELL.width * 2,
  height: CELL.height * 5,
};
const bugRacePosition = [62, 146, 230];
const getRandomNumber = (a) => Math.floor(Math.random() * a);

// ===========SCORE block треба спробувати його опустити вниз=============
const score = document.createElement("div");
let scorePoints = 0;
score.innerHTML = "SCORE: " + scorePoints;
document.body.after(score);
// ===========Об'єкт жука==================================================
const Enemy = {
  x: -CELL.width,
  sprite: "images/enemy-bug.png",

  update: function (dt) {
    this.x = this.x + this.speed * dt;
    //  запускає жука заново в рандомний ряд
    if (this.x > gameField.width) {
      this.x = -CELL.width;
      this.y = bugRacePosition[getRandomNumber(bugRacePosition.length)];
      this.speed = getRandomNumber(70) + 100;
      this.rowPosition = bugRacePosition.indexOf(this.y) + 1;
    }
    this.kissPlayer();
  },
  render: function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
  kissPlayer: function () {
    const startColl = player.x - playerWidth;
    const stopColl = player.x + playerWidth;

    if (
      this.rowPosition === player.rowPosition &&
      this.x >= startColl &&
      this.x <= stopColl
    ) {
      player.x = playerStartPosition.width;
      player.y = playerStartPosition.height;
      player.rowPosition = 5;
    }
  },
};

// ===========Об'єкт Player==================================================
const Player = {
  x: playerStartPosition.width,
  y: playerStartPosition.height,
  score: 0,
  rowPosition: 5,
  sprite: "images/char-cat-girl.png",

  render: function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },

  update: function (dt) {},

  handleInput: function (pressedKey) {
    switch (pressedKey) {
      case "right":
        this.x += CELL.width;
        break;
      case "left":
        this.x += -CELL.width;
        break;
      case "up":
        this.y += -82;
        this.rowPosition > 1 ? (this.rowPosition -= 1) : this.rowPosition;
        break;
      case "down":
        this.y += 82;
        this.rowPosition < 5 ? (this.rowPosition += 1) : this.rowPosition;
        break;
    }
    //  перевірка чи не вийшов за межі поля
    if (this.x > 404) {
      this.x = 404;
    } else if (this.x < 0) {
      this.x = 0;
    }
    //   дійшов до води
    if (this.y > 400) {
      this.y = 400;
    } else if (this.y < 60) {
      scorePoints += 1;
      score.innerHTML = "SCORE: " + scorePoints;
      this.x = playerStartPosition.width;
      this.y = playerStartPosition.height;
      this.rowPosition = 5;
    }
  },
};
// ===============створюємо жуків
const allEnemies = [];

function createNewBug() {
  const newEnemy = {
    __proto__: Enemy,
    x: getRandomNumber(gameField.width),
    y: bugRacePosition[getRandomNumber(bugRacePosition.length)],
    speed: getRandomNumber(70) + 100,
  };
  newEnemy.rowPosition = bugRacePosition.indexOf(newEnemy.y) + 1;
  allEnemies.push(newEnemy);
}
// Place all enemy objects in an array called allEnemies
createNewBug();
// createNewBug();
// createNewBug();
// createNewBug();
// createNewBug();
// ===================створюємо гравця
const player = { __proto__: Player };

document.addEventListener("keyup", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };
  player.handleInput(allowedKeys[e.keyCode]);
});
