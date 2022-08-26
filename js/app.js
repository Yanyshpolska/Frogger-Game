"use strict";
const CANVAS = {
  width: 505,
  height: 606,
};
const CELL = {
  width: CANVAS.width / 5,
  height: 80,
};
const playerStartPosition = {
  width: CELL.width * 2,
  height: CELL.height * 5,
};

// Enemies our player must avoid
const Enemy = function () {
  //     Setting the Enemy initial location (you need to implement)
  //     Setting the Enemy speed (you need to implement)
  // this.speed = ;
  this.x = 0;
  //   this.y = 62;
  this.y = 146;
  //   this.y = 230;
  this.sprite = "images/enemy-bug.png";
};

//     Updates the Enemy location (you need to implement)
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
};
//     Handles collision with the Player (you need to implement)

Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// class extension is implemented using Subclass.prototype = Object.create(Superclass.prototype),
// not Subclass.prototype = new Superclass(params);

const Player = {
  x: playerStartPosition.width,
  y: playerStartPosition.height,
  sprite: "images/char-boy.png",
  render: function () {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  },
  //     The update method for the Player (can be similar to the one for the Enemy)
  update: function (dt) {
    if (this.x > 404) {
      this.x = 404;
    } else if (this.x < 0) {
      this.x = 0;
    }
    if (this.y > 404) {
      this.y = 404;
    } else if (this.y < 0) {
      this.y = 0;
    }
  },
  //     Recall that the player cannot move off screen (so you will need to check for that and handle appropriately).
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
        this.y += -83;
        break;
      case "down":
        this.y += 83;
        break;
    }
  },
};

// Place all enemy objects in an array called allEnemies
let allEnemies = [new Enemy()];
// // Place the player object in a variable called player
const player = {};
// player.prototype = Object.create(Player.prototype);
player.__proto__ = Player;
console.log(allEnemies);
console.log(player);

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
