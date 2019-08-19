import { keyPressed, Sprite } from 'kontra';

export class Player {
  constructor(x,y){
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.friction = 0.2;
    this.maxVelocity = 3;
    this.sprite = new Sprite({
      x: x,
      y: y,
      color: 'red',
      width: 20,
      height: 40
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

    this.sprite.update();
  }
  render(){
    this.sprite.render();
  }
}
