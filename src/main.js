import { initKeys, init, GameLoop } from 'kontra';
import Global from './global';

var { canvas } = init();
initKeys();

Global.init();

let loop = GameLoop({
  update: function() {
    Global.player.update();
    Global.enemies.forEach((enemy)=>{
      enemy.update();
    });
  },
  render: function() {
    Global.player.render();
    Global.enemies.forEach((enemy)=>{
      enemy.render();
    });
  }
});

loop.start();