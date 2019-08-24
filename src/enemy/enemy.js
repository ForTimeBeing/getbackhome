import { Sprite } from 'kontra';
import Global from '../global';
import utils from '../utils';

export class Enemy {
  constructor(x, y) {
    this._id = utils.uuidv4();
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.friction = 0.2;
    this.maxVelocity = 1.5;
    this.health = 100;
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

    if (dstX > this.maxVelocity * 2) {
      this.sprite.x -= this.maxVelocity;
    } else if (dstX < this.maxVelocity * 2) {
      this.sprite.x += this.maxVelocity;
    }
    if (dstY > this.maxVelocity * 2) {
      this.sprite.y -= this.maxVelocity;
    } else if (dstY < this.maxVelocity * 2) {
      this.sprite.y += this.maxVelocity;
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


    this.sprite.update();
  }
  render() {
    this.sprite.render();
  }
}
