import { Player } from './player/player';
import { Enemy } from './enemy/enemy';

var Global = {
  player: undefined,
  enemies: [],
  init: ()=>{
    Global.player = new Player(200, 200);
    for(let i = 0;i<=Math.floor(Math.random() * 50)+15;i++){
      Global.enemies.push(new Enemy(Math.floor(Math.random() * 900), Math.floor(Math.random() * 500)))
    }
  }
}

export default Global;
window.Global = Global;