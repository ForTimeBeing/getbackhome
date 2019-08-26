import { keyPressed, Sprite, SpriteSheet, initPointer, pointer, onPointerDown, onPointerUp } from 'kontra';
import Global from '../global';
import { gameOver } from '../gameOver';

const CIRCLE_RADIUS = 30 // For distance of the hitbox from the player
const MIDDLE_OF_PLAYER_COORDS = 16  // Centers coords to center of player sprite
const MIDDLE_OF_ENEMY_COORDS = 10 // Centers coords to center of enemy sprite
const HIT_BOX_SIZE_X = 35 // Controls size of hitbox
const HIT_BOX_SIZE_Y = 35 // Controls size of hitbox

const DRAW_HITBOX = true // Allows hitbox to be drawn for debugging - Can be removed for space later

export class Player {
  constructor(x, y, spriteSheetImg) {
    var self = this;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.friction = 0.2;
    this.maxVelocity = 3;
    this.health = 100;
    this.damage = 10;
    this.holdDamage = false;
    this.direction = "";
    this.canDodge = true;
    this.dodgeCooldown = 0;
    this.invincibility = false;
    this.invincibilityCount = 0;
    this.deathVoice = false;
    this.sprite = undefined;
    this.spriteSheet = undefined;
    this.spriteSheet = SpriteSheet({
      image: spriteSheetImg,
      frameWidth: 32,
      frameHeight: 32,
      animations: {
        idle: {
          frames: 12
        },
        up: {
          frames: 0
        },
        upright: {
          frames: 3
        },
        right: {
          frames: 6
        },
        downright: {
          frames: 9
        },
        down: {
          frames: 12
        },
        downleft: {
          frames: 15
        },
        left: {
          frames: 18
        },
        upleft: {
          frames: 21
        },
        upwalking: {
          frames: [0,1,2],
          frameRate: 15
        },
        uprightwalking: {
          frames: [3,4,5],
          frameRate: 15
        },
        rightwalking: {
          frames: [6,7,8],
          frameRate: 15
        },
        downrightwalking: {
          frames: [9,10,11],
          frameRate: 15
        },
        downwalking: {
          frames: [12,13,14],
          frameRate: 15
        },
        downleftwalking: {
          frames: [15,16,17],
          frameRate: 15
        },
        leftwalking: {
          frames: [18,19,20],
          frameRate: 15
        },
        upleftwalking: {
          frames: [21,22,23],
          frameRate: 15
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
    //Start of movement ->
    var dx = pointer.x - Global.player.sprite.x - MIDDLE_OF_PLAYER_COORDS;
    var dy = pointer.y - Global.player.sprite.y - MIDDLE_OF_PLAYER_COORDS;
    var angle = Math.atan2(dy,dx)*(180/Math.PI);
    this.direction = "";
    if(angle > -150 && angle < -30){
      this.direction = "up";
    }
    if(angle < 150 && angle > 30){
      this.direction = "down";
    }

    if(angle > -60 && angle < 60){
      this.direction += "right";
    }
    if(angle < -120 || angle > 120){
      this.direction += "left";
    }
    if(!this.direction){
      this.direction = "idle";
    }
    if (keyPressed('a')) {
      if (this.xVelocity > this.maxVelocity * -1) {
        this.xVelocity = this.xVelocity - this.friction;
      }else{
        this.xVelocity = this.maxVelocity * -1;
      }
    }
    else if (keyPressed('d')) {
      if (this.xVelocity < this.maxVelocity) {
        this.xVelocity = this.xVelocity + this.friction;
      }else{
        this.xVelocity = this.maxVelocity;
      }
    } else {
      this.xVelocity = this.xVelocity > 0 ? this.xVelocity - this.friction : this.xVelocity + this.friction;
      if (this.xVelocity <= this.friction && this.xVelocity >= -this.friction) {
        this.xVelocity = 0;
      }
    }
    if (keyPressed('w')) {
      if (this.yVelocity > this.maxVelocity * -1) {
        this.yVelocity = this.yVelocity - this.friction;
      }else{
        this.yVelocity = this.maxVelocity * -1;
      }
    }
    else if (keyPressed('s')) {
      if (this.yVelocity < this.maxVelocity) {
        this.yVelocity = this.yVelocity + this.friction;
      }else{
        this.yVelocity = this.maxVelocity;
      }
    } else {
      this.yVelocity = this.yVelocity > 0 ? this.yVelocity - this.friction : this.yVelocity + this.friction;
      if (this.yVelocity <= this.friction && this.yVelocity >= -this.friction) {
        this.yVelocity = 0;
      }
    }

    if(this.xVelocity !== 0 || this.yVelocity !== 0){
      this.direction += "walking";
    }

    if(!Global.tileEngine.engine.layerCollidesWith("walls", this.sprite)){
      this.sprite.lastX = this.sprite.x;
      this.sprite.x += this.xVelocity;
      this.sprite.lastY = this.sprite.y;
      this.sprite.y += this.yVelocity;
    }else{
      let canMoveVert = true;
      let canMoveHori = true;

      this.sprite.y += this.yVelocity;
      this.sprite.x = this.sprite.lastX;
      if(Global.tileEngine.engine.layerCollidesWith("walls", this.sprite)){
        canMoveVert = false;
      }

      this.sprite.x += this.xVelocity;
      this.sprite.y = this.sprite.lastY;
      if(Global.tileEngine.engine.layerCollidesWith("walls", this.sprite)){
        canMoveHori = false;
      }

      if(canMoveHori){
        this.sprite.lastX = this.sprite.x;
        this.sprite.x += this.xVelocity;
      }else{
        this.sprite.x = this.sprite.lastX;
        this.xVelocity = 0;
      }

      if(canMoveVert){
        this.sprite.lastY = this.sprite.y;
        this.sprite.y += this.yVelocity;
      }else{
        this.sprite.y = this.sprite.lastY;
        this.yVelocity = 0;
      }
    }
    this.sprite.playAnimation(this.direction);
    //<- End of movement

    this.dodgeCooldown--;
    if (this.canDodge == false && this.dodgeCooldown <= 0) {
      this.canDodge = true;
    }

    this.invincibilityCount--;
    if (this.invincibility == true && this.invincibilityCount <= 0) {
      this.invincibility = false;
    }
    Global.enemies.forEach((enemy) => {
      if (!Global.player.invincibility && Global.player.health > 0 && enemy.sprite.collidesWith(Global.player.sprite)) {  
        Global.player.health -= 10;
        if (Global.player.health > 20) {
          let randomX = Math.floor(Math.random() * 5);
          if (randomX == 0) {
            var msg = new SpeechSynthesisUtterance('oof');
            window.speechSynthesis.speak(msg);
          }
          else if (randomX == 1) {
            var msg = new SpeechSynthesisUtterance('ahh');
            window.speechSynthesis.speak(msg);
          }
          else if (randomX == 2) {
            var msg = new SpeechSynthesisUtterance('ouchh');
            window.speechSynthesis.speak(msg);
          }
          else if (randomX == 3) {
            var msg = new SpeechSynthesisUtterance('nooo');
            window.speechSynthesis.speak(msg);
          }
          else if (randomX == 4) {
            var msg = new SpeechSynthesisUtterance('auuuu');
            window.speechSynthesis.speak(msg);
          }
        }
        if (this.health <= 10 && this.health > 0){
          var msg = new SpeechSynthesisUtterance("i'm dying");
          window.speechSynthesis.speak(msg);
        }
        Global.player.invincibility = true;
        Global.player.invincibilityCount = 160;
        
      }
    });

    if (this.holdDamage == true) {
      this.damage++
    }
        //Swings sword
    //TODO: Add sword sprite
    initPointer();
    onPointerDown((evt, object) => {
      if(evt.button == 0){
        this.holdDamage = true
        onPointerUp((evt,object) => {
          //Sets max damage
          if (this.damage >= 75){
            this.damage = 75
          }
          Global.enemies.forEach((enemy) => {
            //Checks to see if an enemy is within the hitbox
            //Note: only checks to see if center of sprite is in the hitbox
            if ((enemy.sprite.x + MIDDLE_OF_ENEMY_COORDS >= (getPointOnLine().x + Global.player.sprite.x)) && (enemy.sprite.y + MIDDLE_OF_ENEMY_COORDS >= getPointOnLine().y + Global.player.sprite.y) &&
              (enemy.sprite.x + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().x + Global.player.sprite.x + HIT_BOX_SIZE_X) && (enemy.sprite.y + MIDDLE_OF_ENEMY_COORDS >= getPointOnLine().y + Global.player.sprite.y) &&
              (enemy.sprite.x + MIDDLE_OF_ENEMY_COORDS >= getPointOnLine().x + Global.player.sprite.x) && (enemy.sprite.y + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().y + Global.player.sprite.y + HIT_BOX_SIZE_Y) &&
              (enemy.sprite.x + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().x + Global.player.sprite.x + HIT_BOX_SIZE_X) && enemy.sprite.y + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().y + Global.player.sprite.y + 
              HIT_BOX_SIZE_Y){
                console.log(this.damage);
                enemy.health = enemy.health - this.damage;
                if (enemy.health > 0){
                  enemy.knockback = true;
                }
              }
          });  
          this.holdDamage = false
          this.damage = 10
        });
      }else if(evt.button == 2 && this.canDodge){
        this.maxVelocity = 12;
        this.friction = 1;
        this.dodgeCooldown = 60;
        this.canDodge = false
        setTimeout(() => {
          this.maxVelocity = 3;
        }, 200);
      }
    });

    if (this.health <= 0) {
      if (this.deathVoice == false) {
        var msg = new SpeechSynthesisUtterance("blah");
        window.speechSynthesis.speak(msg);
        this.deathVoice = true;
      }
      gameOver();
    }

    this.sprite.update();
  }
  render() {
    this.sprite.render();

    //Player's health bar
    var ctx = Global.canvas.getContext("2d");
    ctx.fillStyle = "#008000";
    ctx.fillRect(this.sprite.x - 2, this.sprite.y - 10, this.health * 0.35, 7);


    if(this.dodgeCooldown > 0){
      ctx.fillStyle = "#00217d";
      ctx.fillRect(this.sprite.x - 2, this.sprite.y - 14, this.dodgeCooldown * 0.6, 4);
    }

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
