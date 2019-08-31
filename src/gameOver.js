import utils from './utils';
import Global from './global';

export const gameOver = () => {
    Global.gameLoop.stop();

    const gameOver = document.getElementById("gameOverOverlay");
    const gameOverText = document.getElementById("gameOverText");
    const restartButton = document.getElementById("restartButton");

    gameOver.classList.remove("hidden");
    gameOverText.classList.remove("hidden");
    restartButton.classList.remove("hidden");

    restartButton.onclick = () => {
        utils.resetGame(() => {
            gameOver.classList.add("hidden");
            restartButton.classList.add("hidden");
            gameOverText.classList.add("hidden");
        });
    };
};
