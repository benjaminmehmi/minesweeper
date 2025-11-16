const model = {
    app: {
        mines: new Set(),
        minesCount: 14,
        flagModeEnabled: false,
        gameOver: 'ongoing', // 'ongoing', 'lost', 'won'
        board: new Array(100).fill(null).map((_, index) => ({
            tileIndex: index,
            isOpened: false,
            isMine: false,
            isFlagged: false,
            neighbourCount: 0
        }))
    }
};
