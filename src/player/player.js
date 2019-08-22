import { keyPressed, Sprite, SpriteSheet } from 'kontra';
import Global from '../global';

export class Player {
  constructor(x,y){
    var self = this;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.friction = 0.2;
    this.maxVelocity = 3;
    this.health = 100;
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
      render: function(){
        this.context.save();
        if(self.invincibility){
          if(self.invincibilityCount < 120 && self.invincibilityCount > 115){
            this.context.globalAlpha = 1;
          }else if(self.invincibilityCount < 90 && self.invincibilityCount > 85){
            this.context.globalAlpha = 1;
          }else if(self.invincibilityCount < 60 && self.invincibilityCount > 55){
            this.context.globalAlpha = 1;
          }else if(self.invincibilityCount < 30 && self.invincibilityCount > 25){
            this.context.globalAlpha = 1;
          }else if(self.invincibilityCount < 15 && self.invincibilityCount > 10){
            this.context.globalAlpha = 1;
          }else if(self.invincibilityCount < 5 && self.invincibilityCount > 3){
            this.context.globalAlpha = 1;
          }else{
            this.context.globalAlpha = 0.5;
          }
        }
        this.draw();
        this.context.restore();
      }
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

    this.invincibilityCount--;
    if (this.invincibility == true && this.invincibilityCount <= 0){
      this.invincibility = false;
    }

    this.sprite.update();
  }
  render(){
    this.sprite.render();

    //Player's health bar
    //TODO: Remove health when hit
    var ctx = Global.canvas.getContext("2d");
    ctx.fillStyle = "#008000";
    ctx.fillRect(this.sprite.x - 2, this.sprite.y - 10, this.health*0.35, 7);

    //For when player dies
    //TODO: Pause rendering after dying
    //TODO: Add button
    if (this.health <= 0){
      var gameover = Global.canvas.getContext("2d");
      gameover.fillStyle = "#FF0000";
      gameover.font = "60px Arial"
      gameover.fillText("Game Over",260,280); 
    }
  }
}
