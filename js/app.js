"use strict";
const CELL = {
  width: 101,
  height: 80,
};
const playerStartPosition = {
  width: CELL.width * 2,
  height: CELL.height * 5,
};

const bugRacePosition = [62, 146, 230];
// const bugSpeed =

const score = document.createElement("div");
score.innerHTML = "SCORE";
document.body.append(score);
// Enemies our player must avoid
// const Enemy = function (y, speed) {
//   //     Setting the Enemy initial location (you need to implement)
//   //     Setting the Enemy speed (you need to implement)
//   this.speed = speed;
//   this.x = 0;
//   this.y = bugRacePosition[Math.floor(Math.random() * bugRacePosition.length)];
//   this.sprite = "images/enemy-bug.png";
// };

//     Updates the Enemy location (you need to implement)
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
// Enemy.prototype.update = function (dt) {
//   this.x = this.x + this.speed * dt;
//   // You should multiply any movement by the dt parameter
//   // which will ensure the game runs at the same speed for
//   // all computers.
// };
// //     Handles collision with the Player (you need to implement)

// Enemy.prototype.render = function () {
//   ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
// };

const Enemy = {
  speed: Math.floor(Math.random() * 50 + 100),
  x: -100,
  y: bugRacePosition[Math.floor(Math.random() * bugRacePosition.length)],
  sprite: "images/enemy-bug.png",
  update: function (dt) {
    this.x = this.x + this.speed * dt;
    if (this.x > 505) {
      this.x = -100;
    }
  },
  render: function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
  kissPlayer: function (player) {
    if (this.x === player.x) {
      player.x = playerStartPosition.width;
      player.y = playerStartPosition.height;
    }
    console.log(player.x);
  },
};

const Player = {
  x: playerStartPosition.width,
  y: playerStartPosition.height,
  score: 0,
  sprite: "images/char-boy.png",
  render: function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
  //     The update method for the Player (can be similar to the one for the Enemy)
  update: function (dt) {},
  //     If the player reaches the water the game should be reset by moving the player back to the initial location (you can write a separate reset Player method to handle that).
  handleInput: function (pressedKey) {
    switch (pressedKey) {
      case "right":
        this.x += 101;
        break;
      case "left":
        this.x += -101;
        break;
      case "up":
        this.y += -82;
        break;
      case "down":
        this.y += 82;
        break;
    }
    if (this.x > 404) {
      this.x = 404;
    } else if (this.x < 0) {
      this.x = 0;
    }
    if (this.y > 400) {
      this.y = 400;
    } else if (this.y < 15) {
      this.x = playerStartPosition.width;
      this.y = playerStartPosition.height;
    }
  },
};

const allEnemies = [];

function createNewBug() {
  const newEnemy = {
    __proto__: Enemy,
    y: bugRacePosition[Math.floor(Math.random() * bugRacePosition.length)],
    speed: Math.floor(Math.random() * 70 + 100),
  };
  allEnemies.push(newEnemy);
}
// Place all enemy objects in an array called allEnemies
setTimeout(createNewBug(), 500);
setTimeout(createNewBug(), 5500);
setTimeout(createNewBug(), 2500);
setTimeout(createNewBug(), 2500);
setTimeout(createNewBug(), 2500);

// const enem = {};
// enem.__proto__ = Enemy;
// enem.speed = 0;
// enem.x = -100;
// allEnemies.push(enem);
// let allEnemies = [new Enemy(62, 100), new Enemy(146, 150)];
// // Place the player object in a variable called player
const player = { __proto__: Player };
// class extension is implemented using Subclass.prototype = Object.create(Superclass.prototype),
// not Subclass.prototype = new Superclass(params);
// player.prototype = Object.create(Player.prototype);
// player.__proto__ = Player;
// console.log(allEnemies);
// console.log(player);
allEnemies.forEach((enem) => enem.kissPlayer(player));

document.addEventListener("keyup", function (e) {
  var allowedKeys = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
  };

  player.handleInput(allowedKeys[e.keyCode]);
});

// If you would like you can add additional functionality to the game. You can add more code to the app.js file and to the Enemy and Player classes to accomplish that.
