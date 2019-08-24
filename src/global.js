import { Player } from './player/player';
import { Enemy } from './enemy/enemy';
import { TileSet } from './tileEngine/tileEngine';
import tileSet2 from './assets/dungeon_sheet.png';

var Global = {
  gameLoop: undefined,
  player: undefined,
  enemies: [],
  tileEngine: undefined,
  tileSheet: tileSet2,
  tileSheetImg: new Image(),
  canvas: document.getElementById('game'),
  init: (callback) => {
    Global.tileSheetImg.src = Global.tileSheet;
    Global.tileSheetImg.onload = function () {
      Global.tileEngine = new TileSet();
      Global.tileEngine.init();
      Global.player = new Player(200, 200);
      for (let i = 0; i <= Math.floor(Math.random() * 50) + 15; i++) {
        Global.enemies.push(new Enemy(Math.floor(Math.random() * 900), Math.floor(Math.random() * 500)))
      }
      callback();
    }
  }
}

export default Global;
window.Global = Global;