import { keyPressed, Sprite, SpriteSheet } from 'kontra';
import Global from '../global';
import { gameOver } from '../gameOver'

export class Player {
  constructor(x, y) {
    var self = this;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.friction = 0.2;
    this.maxVelocity = 3;
    this.health = 100;
    this.direction = 'down';
    this.invincibility = false;
    this.invincibilityCount = 0;
    this.sprite = undefined;
    this.spriteSheet = undefined;
    this.spriteSheet = SpriteSheet({
      image: Global.tileSheetImg,
      frameWidth: 32,
      frameHeight: 32,
      animations: {
        idle: {
          frames: 188,
          loop: false,
        }
      }
    });
    this.sprite = new Sprite({
      x: x,
      y: y,
      animations: self.spriteSheet.animations,
      render: function () {
        this.context.save();
        if (self.invincibility) {
          if (self.invincibilityCount < 120 && self.invincibilityCount > 115) {
            this.context.globalAlpha = 1;
          } else if (self.invincibilityCount < 90 && self.invincibilityCount > 85) {
            this.context.globalAlpha = 1;
          } else if (self.invincibilityCount < 60 && self.invincibilityCount > 55) {
            this.context.globalAlpha = 1;
          } else if (self.invincibilityCount < 30 && self.invincibilityCount > 25) {
            this.context.globalAlpha = 1;
          } else if (self.invincibilityCount < 15 && self.invincibilityCount > 10) {
            this.context.globalAlpha = 1;
          } else if (self.invincibilityCount < 5 && self.invincibilityCount > 3) {
            this.context.globalAlpha = 1;
          } else {
            this.context.globalAlpha = 0.5;
          }
        }
        this.draw();
        this.context.restore();
      }
    });
  }

  update() {
    if (keyPressed('left')) {
      this.direction = 'left'
      if (this.xVelocity > this.maxVelocity * -1) {
        this.xVelocity = this.xVelocity - this.friction;
      }
    }
    else if (keyPressed('right')) {
      this.direction = 'right'
      if (this.xVelocity < this.maxVelocity) {
        this.xVelocity = this.xVelocity + this.friction;
      }
    } else {
      this.xVelocity = this.xVelocity > 0 ? this.xVelocity - this.friction : this.xVelocity + this.friction;
      if (this.xVelocity <= this.friction && this.xVelocity >= -this.friction) {
        this.xVelocity = 0;
      }
    }
    if (keyPressed('up')) {
      this.direction = 'up'
      if (this.yVelocity > this.maxVelocity * -1) {
        this.yVelocity = this.yVelocity - this.friction;
      }
    }
    else if (keyPressed('down')) {
      this.direction = 'down'
      if (this.yVelocity < this.maxVelocity) {
        this.yVelocity = this.yVelocity + this.friction;
      }
    } else {
      this.yVelocity = this.yVelocity > 0 ? this.yVelocity - this.friction : this.yVelocity + this.friction;
      if (this.yVelocity <= this.friction && this.yVelocity >= -this.friction) {
        this.yVelocity = 0;
      }
    }

    this.sprite.x += this.xVelocity;
    this.sprite.y += this.yVelocity;

    if (this.sprite.x > Global.canvas.width) {
      this.sprite.x = -this.sprite.width;
    }

    this.invincibilityCount--;
    if (this.invincibility == true && this.invincibilityCount <= 0) {
      this.invincibility = false;
    }
    //Swings sword
    //TODO: Add swing charge
    //TODO: Add knockback
    //TODO: Add sword sprite
    //TODO: Add swing based off mouse
    if (keyPressed('space')) {
      Global.enemies.forEach((enemy) => {
        if (Global.player.direction == 'up') {
          if (enemy.sprite.x > Global.player.sprite.x - 15 && enemy.sprite.x < Global.player.sprite.x + 15 && enemy.sprite.y > Global.player.sprite.y - 35 && enemy.sprite.y < Global.player.sprite.y - 15) {
            enemy.health = 0
          }
        }
        if (Global.player.direction == 'left') {
          if (enemy.sprite.x < Global.player.sprite.x - 15 && enemy.sprite.x > Global.player.sprite.x - 35 && enemy.sprite.y < Global.player.sprite.y + 15 && enemy.sprite.y > Global.player.sprite.y - 15) {
            enemy.health = 0
          }
        }
        if (Global.player.direction == 'down') {
          if (enemy.sprite.x > Global.player.sprite.x - 15 && enemy.sprite.x < Global.player.sprite.x + 15 && enemy.sprite.y < Global.player.sprite.y + 35 && enemy.sprite.y > Global.player.sprite.y + 15) {
            enemy.health = 0
          }
        }
        if (Global.player.direction == 'right') {
          if (enemy.sprite.x > Global.player.sprite.x + 15 && enemy.sprite.x < Global.player.sprite.x + 35 && enemy.sprite.y < Global.player.sprite.y + 15 && enemy.sprite.y > Global.player.sprite.y - 15) {
            enemy.health = 0
          }
        }
      });
    }
    this.sprite.update();
  }
  render() {
    this.sprite.render();

    //Player's health bar
    var ctx = Global.canvas.getContext("2d");
    ctx.fillStyle = "#008000";
    ctx.fillRect(this.sprite.x - 2, this.sprite.y - 10, this.health * 0.35, 7);


    if (this.health <= 0) {
      gameOver();
    }
  }
}