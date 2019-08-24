import utils from './utils';

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

    restartButton.onclick = () => {
        utils.resetGame(() => {
            gameOver.classList.add("hidden");
            restartButton.classList.add("hidden");
        });
    };
};
