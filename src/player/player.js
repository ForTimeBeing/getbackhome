import { keyPressed, Sprite, SpriteSheet } from 'kontra';
import Global from '../global';

const CIRCLE_RADIUS = 30 // For distance of the hitbox from the player
const MIDDLE_OF_PLAYER_COORDS = 15  // Centers coords to center of player sprite
const MIDDLE_OF_ENEMY_COORDS = 10 // Centers coords to center of enemy sprite
const HIT_BOX_SIZE_X = 30 // Controls size of hitbox
const HIT_BOX_SIZE_Y = 30 // Controls size of hitbox

const DRAW_HITBOX = true // Allows hitbox to be drawn for debugging - Can be removed for space later

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

    //Swings sword
    //TODO: Add swing charge
    //TODO: Add knockback
    //TODO: Add sword sprite
    initPointer();
    onPointerDown(function (e, object) {
      Global.enemies.forEach((enemy) => {
        //Checks to see if an enemy is within the hitbox
        //Note: only checks to see if center of sprite is in the hitbox
        if ((enemy.sprite.x + MIDDLE_OF_ENEMY_COORDS >= (getPointOnLine().x + Global.player.sprite.x)) && (enemy.sprite.y + MIDDLE_OF_ENEMY_COORDS >= getPointOnLine().y + Global.player.sprite.y) &&
          (enemy.sprite.x + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().x + Global.player.sprite.x + HIT_BOX_SIZE_X) && (enemy.sprite.y + MIDDLE_OF_ENEMY_COORDS >= getPointOnLine().y + Global.player.sprite.y) &&
          (enemy.sprite.x + MIDDLE_OF_ENEMY_COORDS >= getPointOnLine().x + Global.player.sprite.x) && (enemy.sprite.y + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().y + Global.player.sprite.y + HIT_BOX_SIZE_Y) &&
          (enemy.sprite.x + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().x + Global.player.sprite.x + HIT_BOX_SIZE_X) && enemy.sprite.y + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().y + Global.player.sprite.y + 
          HIT_BOX_SIZE_Y){

            
            enemy.health = 0
          }
      });
    })
    


    //Sets player invincibility and damage from enemy x
    this.invincibilityCount--;
    if (this.invincibility == true && this.invincibilityCount <= 0) {
      this.invincibility = false;
    }
    Global.enemies.forEach((enemy) => {
      if (!Global.player.invincibility && Global.player.health > 0 && enemy.sprite.collidesWith(Global.player.sprite)) {
        Global.player.health -= 10;
        Global.player.invincibility = true;
        Global.player.invincibilityCount = 160;
      }
    });

    this.sprite.update();
  }
  render() {
    this.sprite.render();

    //Player's health bar
    var ctx = Global.canvas.getContext("2d");
    ctx.fillStyle = "#008000";
    ctx.fillRect(this.sprite.x - 2, this.sprite.y - 10, this.health * 0.35, 7);

    //Can be removed for space - Used for debugging
    if (DRAW_HITBOX == true){
      var drawLine = Global.canvas.getContext("2d");
      drawLine.beginPath();
      drawLine.moveTo(Global.player.sprite.x + MIDDLE_OF_PLAYER_COORDS, Global.player.sprite.y + MIDDLE_OF_PLAYER_COORDS);
      drawLine.lineTo(pointer.x, pointer.y);
      drawLine.stroke();

      var drawCircle = Global.canvas.getContext("2d");
      drawCircle.beginPath();
      drawCircle.arc((Global.player.sprite.x + MIDDLE_OF_PLAYER_COORDS), (Global.player.sprite.y + MIDDLE_OF_PLAYER_COORDS), CIRCLE_RADIUS, 0, 2 * Math.PI);
      drawCircle.lineWidth = 3;
      drawCircle.strokeStyle = '#FF0000';
      drawCircle.stroke();

      var drawHitbox = Global.canvas.getContext("2d");
      drawHitbox.rect(getPointOnLine().x + Global.player.sprite.x, getPointOnLine().y + Global.player.sprite.y, HIT_BOX_SIZE_X, HIT_BOX_SIZE_Y);
      drawHitbox.stroke();
    }
  }
}

function sendEnemyTowardsPlayer(){
  var dx = pointer.x - enemy.sprite.x + MIDDLE_OF_ENEMY_COORDS;
  var dy = pointer.y - enemy.sprite.y + MIDDLE_OF_ENEMY_COORDS;

  var angle = Math.atan2(dy,dx)


}

//Gets point on circle where the line intersects(For placing hitbox)
function getPointOnLine() {
  var dx = pointer.x - Global.player.sprite.x - MIDDLE_OF_PLAYER_COORDS;
  var dy = pointer.y - Global.player.sprite.y - MIDDLE_OF_PLAYER_COORDS;
  var a = Math.atan2(dy, dx)
  return {
    x: Math.cos(a) * CIRCLE_RADIUS,
    y: Math.sin(a) * CIRCLE_RADIUS
  }
}
