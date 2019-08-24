import { initKeys, init, GameLoop } from 'kontra';
import Global from './global';

var { canvas } = init();
initKeys();

Global.init(function () {
  Global.gameLoop = GameLoop({
    update: function () {
      Global.player.update();
      Global.enemies.forEach((enemy) => {
        enemy.update();
      });
    },
    render: function () {
      if (Global.tileEngine && Global.tileEngine.engine) {
        Global.tileEngine.render();
      }
      Global.enemies.forEach((enemy) => {
        enemy.render();
      });
      Global.player.render();
    }
  });

  Global.gameLoop.start();
});
