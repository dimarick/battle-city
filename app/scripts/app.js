import Game from './game/Game';

window.addEventListener("load", () => {
    "use strict";
    const element = document.getElementById('game-battle-city');
    const game = new Game(element.getContext('2d'));
    game.start();

    const debugCheckbox = document.getElementById('game-show-debug-info');
    const onchange = () => {
        game.showDebug(debugCheckbox.checked);
    };

    debugCheckbox.onchange = onchange;
    onchange();

    const resetButton = document.getElementById('game-reset');

    resetButton.onclick = () => {
        game.restart();
    };
});




