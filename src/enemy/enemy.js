import { Sprite, pointer} from 'kontra';
import Global from '../global';
import utils from '../utils';

const KNOCKBACK_DISTNCE = 35 // Sets knockback distance for AI

export class Enemy {
  constructor(x, y) {
    this._id = utils.uuidv4();
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.friction = 0.2;
    this.maxVelocity = 1.5;
    this.health = 100;
    this.knockback = false;
    this.knockbackTimer = KNOCKBACK_DISTNCE;
    this.sprite = new Sprite({
      x: x,
      y: y,
      color: 'blue',
      width: 20,
      height: 20
    });
    console.log(this._id);
  }

  update() {
    let currentX = this.sprite.x;
    let currentY = this.sprite.y;
    let playerX = Global.player.sprite.x;
    let playerY = Global.player.sprite.y;
    let dstX = currentX - playerX;
    let dstY = currentY - playerY;

      let moveX = () => {
        if (this.knockback == false) {
          if (dstX > this.maxVelocity * 2) {
            this.sprite.x -= this.maxVelocity;
          } else if (dstX < this.maxVelocity * 2) {
            this.sprite.x += this.maxVelocity;
          }
        }
        if (this.knockback == true) {
          this.knockbackTimer--;
          if (this.knockbackTimer <= 0) {
            this.knockback = false;
            this.knockbackTimer = KNOCKBACK_DISTNCE;
          }
          if (currentX - pointer.x > this.maxVelocity * 2) {
            this.sprite.x -= this.maxVelocity;
          } else if (currentX - pointer.x < this.maxVelocity * 2) {
            this.sprite.x += this.maxVelocity;
          }
        }
      }
      let moveY = () => {
        if(this.knockback == false){
          if (dstY > this.maxVelocity * 2) {
            this.sprite.y -= this.maxVelocity;
          } else if (dstY < this.maxVelocity * 2) {
            this.sprite.y += this.maxVelocity;
          }
        }
        if (this.knockback == true) {
          this.knockbackTimer--;
          if(this.knockbackTimer <= 0){
            this.knockback = false;
            this.knockbackTimer = KNOCKBACK_DISTNCE;
          }
          if (currentY - pointer.y > this.maxVelocity * 2) {
            this.sprite.y -= this.maxVelocity;
          } else if (currentY - pointer.y < this.maxVelocity * 2) {
            this.sprite.y += this.maxVelocity;
          }
        }
    }

    Global.enemies.forEach((enemy) => {
      if (enemy._id !== this._id && this.sprite.collidesWith(enemy.sprite)) {
        if (this.sprite.x < enemy.sprite.x) {
          this.sprite.x -= this.maxVelocity * 2;
        }
        if (this.sprite.y < enemy.sprite.y) {
          this.sprite.y -= this.maxVelocity * 2;
        }
      }
      if (enemy.health <= 0) {
        for (var i = 0; i < Global.enemies.length; i++) {
          if (enemy._id == Global.enemies[i]._id) {
            Global.enemies.splice(i, 1);
          }
        }
      }
    });

    if(!Global.tileEngine.engine.layerCollidesWith("walls", this.sprite)){
      this.sprite.lastX = this.sprite.x;
      this.sprite.lastY = this.sprite.y;
      moveX();
      moveY();

    }else{
      this.sprite.x = this.sprite.lastX;
      this.sprite.y = this.sprite.lastY;
      let canMoveVert = true;
      let canMoveHori = true;

      moveY();
      this.sprite.x = this.sprite.lastX;
      if(Global.tileEngine.engine.layerCollidesWith("walls", this.sprite)){
        canMoveVert = false;
      }

      moveX();
      this.sprite.y = this.sprite.lastY;
      if(Global.tileEngine.engine.layerCollidesWith("walls", this.sprite)){
        canMoveHori = false;
      }

      if(canMoveHori){
        this.sprite.lastX = this.sprite.x;
        moveX();
      }else{
        this.sprite.x = this.sprite.lastX;
      }

      if(canMoveVert){
        this.sprite.lastY = this.sprite.y;
        moveY();
      }else{
        this.sprite.y = this.sprite.lastY;
      }
    }

    this.sprite.update();
  }
  render() {
    this.sprite.render();

    //Enemy's health bar
    if (this.health < 100){
      var ctx = Global.canvas.getContext("2d");
      ctx.fillStyle = "#FF0000";
      ctx.fillRect(this.sprite.x - 5, this.sprite.y - 10, this.health * 0.35, 7);
    }
  }
}
