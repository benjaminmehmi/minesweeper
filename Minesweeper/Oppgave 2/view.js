function updateView(){
    document.getElementById('app').innerHTML = /*HTML*/`
    <div class="status message">${displayStatusMessage()}</div>
        <div class="board">
            ${drawCells()}
        </div>

    <div class="button group">
        <button id="flag-button" class="flag button" onclick="enableFlag()" style="background-color: ${model.app.flagModeEnabled ? 'darkgray' : 'lightgray'};">🚩</button>
        <button id="restart-button" class="restart button" onclick="restartGame()">Restart Game</button>
    </div>
    `;
}

function drawCells(){
    let cellsHtml = '';
    for (let i = 0; i < 100; i++) {
        const isOpened = model.app.board[i].isOpened;
        const cellClass = isOpened ? 'open' : 'closed';
        cellsHtml += `<div class="cell ${cellClass}" onclick="openCell(${i})">${displayCellContent(i)}</div>`;
    }
    return cellsHtml;
}

function displayCellContent(i){
    const neighbourCount = model.app.mines.has(i) ? 0 : (model.app.board[i].isOpened ? model.app.board[i].neighbourCount : 0);
    return model.app.board[i].isFlagged ? '🚩' :
    (model.app.mines.has(i) && model.app.board[i].isOpened ? '💣' :
    (model.app.board[i].isOpened ? (neighbourCount === 0 ? '' : neighbourCount) : ''));
}

function displayStatusMessage(){
    if (model.app.gameOver === 'won') {
        return 'All bombs found, you won the game!';
    } else if (model.app.gameOver === 'lost') {
        return 'Game Over!';
    } else {
        return `mines: ${model.app.minesCount}`;
    }
}

