import { keyPressed, Sprite, SpriteSheet } from 'kontra';
import Global from '../global';

export class Player {
  constructor(x,y){
    var self = this;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.friction = 0.2;
    this.maxVelocity = 3;
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
      animations: self.spriteSheet.animations
    });
  }
  
  update(){
    if (keyPressed('left')){
      if(this.xVelocity > this.maxVelocity*-1){
        this.xVelocity = this.xVelocity-this.friction;
      }
    }
    else if (keyPressed('right')) {
      if(this.xVelocity < this.maxVelocity){
        this.xVelocity = this.xVelocity+this.friction;
      }
    }else{
      this.xVelocity = this.xVelocity > 0 ? this.xVelocity-this.friction : this.xVelocity+this.friction;
      if(this.xVelocity <= this.friction && this.xVelocity >= -this.friction){
        this.xVelocity = 0;
      }
    }

    if (keyPressed('up')) {
      if(this.yVelocity > this.maxVelocity*-1){
        this.yVelocity = this.yVelocity-this.friction;
      }
    }
    else if (keyPressed('down')) {
      if(this.yVelocity < this.maxVelocity){
        this.yVelocity = this.yVelocity+this.friction;
      }
    }else{
      this.yVelocity = this.yVelocity > 0 ? this.yVelocity-this.friction : this.yVelocity+this.friction;
      if(this.yVelocity <= this.friction && this.yVelocity >= -this.friction){
        this.yVelocity = 0;
      }
    }
    this.sprite.x += this.xVelocity;
    this.sprite.y += this.yVelocity;

    if (this.sprite.x > Global.canvas.width) {
      this.sprite.x = -this.sprite.width;
    }

    this.sprite.update();
  }
  render(){
    this.sprite.render();
  }
}
