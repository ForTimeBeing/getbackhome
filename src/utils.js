import Global from './global';
import { Player } from "./player/player";
import { Enemy } from "./enemy/enemy"

export const utils = {
  uuidv4: ()=>{
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },
  resetGame: ()=>{
    gameOver.classList.add("hidden");
    restartButton.classList.add("hidden");
    Global.player = undefined;
    Global.enemies = [];
    Global.player = new Player(200, 200);
    Global.player.render();
    for(let i = 0;i<=Math.floor(Math.random() * 50)+15;i++){
        Global.enemies.push(new Enemy(Math.floor(Math.random() * 900), Math.floor(Math.random() * 500)))
    }
    Global.enemies.forEach((enemy) => {
        enemy.render();
    });
    Global.gameLoop.start();
  }
}