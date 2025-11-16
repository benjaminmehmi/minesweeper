function openCell(index) {
    if (model.app.gameOver !== 'ongoing') return;

    const selectedTile = model.app.board[index];
    if (model.app.flagModeEnabled) {
        selectedTile.isFlagged = !selectedTile.isFlagged;
        updateView();
        return;
    }
    if (selectedTile.isFlagged) {
        selectedTile.isFlagged = false;
    }
    selectedTile.isOpened = true;
    if (selectedTile.isMine) {
        gameOver();
        return;
    } else {
        console.log('Cell opened at index:', index, 'with', selectedTile.neighbourCount, 'neighbour bombs.');
    }
    openCellInternal(index);
    checkWinCondition();
    updateView();
}

function enableFlag() {
    if (model.app.gameOver !== 'ongoing') return;
    model.app.flagModeEnabled = !model.app.flagModeEnabled;
    updateView();
}

function initializeMines (mineCount = 14) {
    const mineSet = model.app.mines;
    mineSet.clear();
    while (mineSet.size < mineCount) {
        const randomIndex = Math.floor(Math.random() * model.app.board.length);
        mineSet.add(randomIndex);
    }

    for (let i = 0; i < model.app.board.length; i++) {
        const tile = model.app.board[i];
        tile.isMine = mineSet.has(i);
        if (!mineSet.has(i)) {
            tile.neighbourCount = countNeighbours(i);
            tile.isEmpty = tile.neighbourCount === 0;
        }
    }
    console.log('Mines placed at indices:', Array.from(mineSet).sort((a, b) => a - b));
};

function countNeighbours(index) {
    const size = Math.sqrt(model.app.board.length);
    const row = Math.floor(index / size);
    const col = index % size;
    const mineSet = model.app.mines;
    let count = 0;

    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < size && c >= 0 && c < size && !(r === row && c === col)) {
                const neighbourIndex = r * size + c;
                if (mineSet.has(neighbourIndex)) {
                    count++;
                }
            }
        }
    }
    return count;
}

function openCellInternal(index) {
    const selectedTile = model.app.board[index];
    if (selectedTile.isEmpty && !selectedTile.isMine) {
        const size = Math.sqrt(model.app.board.length);
        const row = Math.floor(index / size);
        const col = index % size;

        for (let r = row - 1; r <= row + 1; r++) {
            for (let c = col - 1; c <= col + 1; c++) {
                if (r >= 0 && r < size && c >= 0 && c < size && !(r === row && c === col)) {
                    const neighbourIndex = r * size + c;
                    if (!model.app.board[neighbourIndex].isOpened && !model.app.board[neighbourIndex].isMine) {

                        model.app.board[neighbourIndex].isFlagged = false;
                        model.app.board[neighbourIndex].isOpened = true;

                        if (model.app.board[neighbourIndex].isEmpty) {
                            openCellInternal(neighbourIndex);
                        }
                    }
                }
            }
        }
    }
}

function gameOver(){
    model.app.gameOver = 'lost';
    console.log('Game Over! You hit a mine.');
    for (let i = 0; i < model.app.board.length; i++) {
        if (model.app.board[i].isMine) {
            model.app.board[i].isOpened = true;
        }
        model.app.board[i].isFlagged = false;
    }
    updateView();
}

function checkWinCondition(){
    const openedTiles = model.app.board.filter(tile => tile.isOpened).length;
    const totalTiles = model.app.board.length;
    const mineCount = model.app.mines.size;
    if (openedTiles === totalTiles - mineCount) {
        model.app.gameOver = 'won';
        console.log('All bombs found, you won the game!');
    }
}

function restartGame() {
    model.app.gameOver = 'ongoing';
    model.app.flagModeEnabled = false;
    model.app.board.forEach(tile => {
        tile.isOpened = false;
        tile.isFlagged = false;
    });
    initializeMines(model.app.minesCount);
    updateView();
}

if (typeof model !== 'undefined') {
    initializeMines();
}
