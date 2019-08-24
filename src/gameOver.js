import Global from './global';
import { Player } from "./player/player";
import { Enemy } from "./enemy/enemy"

//TODO: on reset: clear game and restart

export const gameOver = () => {

    Global.gameLoop.stop();

    const gameOver = document.getElementById("gameOverOverlay");
    const restartButton = document.getElementById("restartButton");
    const ctx = gameOver.getContext("2d");

    ctx.font = "60px Arial";
    ctx.fillStyle = "#ff0000";
    ctx.fillText("Game Over", 260, 280);
    
    gameOver.classList.remove("hidden");
    restartButton.classList.remove("hidden");

    restartButton.onclick = function() {
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
    };
};
