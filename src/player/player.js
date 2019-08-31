import { keyPressed, Sprite, SpriteSheet, initPointer, pointer, onPointerDown, onPointerUp } from 'kontra';
import soundEngine from '../lib/soundfx';
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
    this.spriteSheet = SpriteSheet({
      image: spriteSheetImg,
      frameWidth: 32,
      frameHeight: 32,
      animations: {
        i: {
          frames: 12
        },
        u: {
          frames: 0
        },
        ur: {
          frames: 3
        },
        r: {
          frames: 6
        },
        dr: {
          frames: 9
        },
        d: {
          frames: 12
        },
        dl: {
          frames: 15
        },
        l: {
          frames: 18
        },
        ul: {
          frames: 21
        },
        uw: {
          frames: [0,1,2],
          frameRate: 15
        },
        urw: {
          frames: [3,4,5],
          frameRate: 15
        },
        rw: {
          frames: [6,7,8],
          frameRate: 15
        },
        drw: {
          frames: [9,10,11],
          frameRate: 15
        },
        dw: {
          frames: [12,13,14],
          frameRate: 15
        },
        dlw: {
          frames: [15,16,17],
          frameRate: 15
        },
        lw: {
          frames: [18,19,20],
          frameRate: 15
        },
        ulw: {
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
          this.context.globalAlpha = 0.5;
        }
        this.draw();
        this.context.restore();
      }
    });
  }

  update() {
    //Start of movement ->
    var self = this;
    var dx = pointer.x - this.sprite.x - MIDDLE_OF_PLAYER_COORDS;
    var dy = pointer.y - this.sprite.y - MIDDLE_OF_PLAYER_COORDS;
    var angle = Math.atan2(dy,dx)*(180/Math.PI);
    this.direction = "";
    if(angle > -150 && angle < -30){
      this.direction = "u";
    }
    if(angle < 150 && angle > 30){
      this.direction = "d";
    }

    if(angle > -60 && angle < 60){
      this.direction += "r";
    }
    if(angle < -120 || angle > 120){
      this.direction += "l";
    }
    if(!this.direction){
      this.direction = "i";
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
      this.direction += "w";
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
      if (!Global.player.invincibility && enemy.sprite.collidesWith(Global.player.sprite)) {  
        Global.player.health -= 10;
        var soundURL = soundEngine([1,,0.0862,,0.2973,0.6137,,-0.3721,,,,,,,,,,,1,,,0.2017,,0.42]); 
        var player = new Audio();
        player.src = soundURL;
        player.play();
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
          let sound = [3,0.25,0.09,0.71,0.28,0.09,,0.3,-0.2199,0.71,0.24,,,,,,-0.02,,1,,,,0.02,0.31];
          //Sets max damage
          if (this.damage >= 75){
            this.damage = 75
          }
          if(this.damage > 30){
            sound = [3,0.17,0.33,0.99,0.33,0.05,,0.34,-0.2199,0.71,0.24,,,,,,-0.02,,1,,,,0.02,0.31];
          }
          let soundURL = soundEngine(sound); 
          let player = new Audio();
          player.volume = 0.5;
          player.src = soundURL;
          player.play();
          Global.enemies.forEach((enemy) => {
            //Checks to see if an enemy is within the hitbox
            //Note: only checks to see if center of sprite is in the hitbox
            let enemyY = enemy.sprite.y;
            let enemyX = enemy.sprite.x;
            let playerY = self.sprite.y;
            let playerX = self.sprite.x;
            if ((enemyX + MIDDLE_OF_ENEMY_COORDS >= (getPointOnLine().x + playerX)) && (enemyY + MIDDLE_OF_ENEMY_COORDS >= getPointOnLine().y + playerY) &&
              (enemyX + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().x + playerX + HIT_BOX_SIZE_X) && (enemyY + MIDDLE_OF_ENEMY_COORDS >= getPointOnLine().y + playerY) &&
              (enemyX + MIDDLE_OF_ENEMY_COORDS >= getPointOnLine().x + playerX) && (enemyY + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().y + playerY + HIT_BOX_SIZE_Y) &&
              (enemyX + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().x + playerX + HIT_BOX_SIZE_X) && enemyY + MIDDLE_OF_ENEMY_COORDS <= getPointOnLine().y + playerY + HIT_BOX_SIZE_Y){
                enemy.health = enemy.health - this.damage;
                if (enemy.health > 0){
                  enemy.knockback = true;
                }
              }
          });  
          this.holdDamage = false;
          this.damage = 10;
        });
      }else if(evt.button == 2 && this.canDodge){
        this.maxVelocity = 12;
        this.friction = 1;
        this.dodgeCooldown = 60;
        this.canDodge = false
        let soundURL = soundEngine([0,,0.2132,,0.2057,0.3178,,0.169,,,,,,0.0959,,,,,0.7891,,,,,0.42]); 
        let player = new Audio();
        player.volume = 0.5;
        player.src = soundURL;
        player.play();
        setTimeout(() => {
          this.maxVelocity = 3;
        }, 200);
      }
    });

    if (this.health <= 0) {
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
