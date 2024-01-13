const crosswordSolver = (crossword, words) => {
    if (typeof crossword !== "string" || !Array.isArray(words) || words.some((word) => typeof word !== "string")) {
        console.log("Error");
        return "Error"; //if input types are invalid
    }
    // only allow '.', '\n', 0, 1 and 2
    if (!/^[.\n012]+$/.test(crossword)) {
        console.log("Error");
        return "Error"; //if crossword contains invalid characters
    }
    //check if length of crossword puzzle is matching length of given words
    const crosswordLines = crossword.split('\n');
    if (crosswordLines.length !== words.length) {
        console.log("Error");
        return "Error";
    }
    // Two-dimensional array with information about words beginning cells in crossword.
    //
    const puzzleNumbers = crossword
        .trim()
        .split("\n")
        .map((row) => row.split("").map((cell) => (cell === "." ? -1 : parseInt(cell))));
    const wordsBeginnings = puzzleNumbers.map((row, rowIndex) => row.map((cell, collIndex) => ({
        row: rowIndex,
        col: collIndex,
    }))).reduce((acc, val) => acc.concat(val), []).filter((cell) => puzzleNumbers[cell.row][cell.col] > 0);
    // Check if the count of words starting at the cells matches the total word count
    if (wordsBeginnings.reduce((acc, cell) => acc + puzzleNumbers[cell.row][cell.col], 0) !== words.length) {
        console.log("Error");
        return "Error";
    }
    //Validate uniform puzzle width
    const puzzleWidth = puzzleNumbers[0].length;
    if (puzzleNumbers.some((row) => row.length !== puzzleWidth)) {
        console.log("Error");
        return "Error";
    }
    // check for repeated words
    if (new Set(words).size !== words.length) {
        console.log("Error");
        return "Error";
    }
    // sort words by length (to add the longest to board first)
    words.sort((a, b) => b.length - a.length)
    // Two-dimensional array with information about words placed in crossword.
    //
    const puzzleWords = puzzleNumbers.map((row) => row.map((cell) => (cell === -1 ? "." : "")))
    // Function that checks if it's possible to place word in crossword
    // starting from cell (row, col) in direction (horizontal or vertical)
    const canAddWord = (word, row, col, direction) => {
        var _a;
        if (direction === "horizontal" && col + word.length > puzzleNumbers[row].length) {
            return false;
        }
        if (direction === "vertical" && row + word.length > puzzleNumbers.length) {
            return false;
        }
        //Validate word placement in the given direction
        for (let i = 0; i < word.length; i++) {
            if (puzzleWords[row][col] !== "") {
                if (puzzleWords[row][col] !== word[i]) {
                    return false;
                }
            }
            direction === "horizontal" ? col++ : row++;
        }
        // cell after word should be unavailable (or out of the board)
        const afterWordCell = (_a = puzzleNumbers[row]) === null || _a === void 0 ? void 0 : _a[col];
        return afterWordCell === -1 || afterWordCell === undefined;
    }
    //function to add words to crosswords
    const addWords = (words) => {
        if (words.length === 0) {
            return true;
        }
        // Attempt to place each word in available directions
        for (const word of words) {
            for (const cell of wordsBeginnings) {
                if (puzzleNumbers[cell.row][cell.col] === 0) {
                    continue;
                }
                if (canAddWord(word, cell.row, cell.col, "horizontal")) {
                    // Try adding the word horizontally
                    const backupRow = puzzleWords[cell.row].slice();
                    for (let j = 0; j < word.length; j++) {
                        puzzleWords[cell.row][cell.col + j] = word[j];
                    }
                    puzzleNumbers[cell.row][cell.col]--;
                    if (addWords(words.filter((w) => w !== word))) {
                        return true;
                    }
                    puzzleNumbers[cell.row][cell.col]++;
                    puzzleWords[cell.row] = backupRow;
                }
                if (canAddWord(word, cell.row, cell.col, "vertical")) {
                    // Try adding the word vertically
                    const backupCol = puzzleWords.map((row) => row[cell.col]);
                    for (let j = 0; j < word.length; j++) {
                        puzzleWords[cell.row + j][cell.col] = word[j];
                    }
                    puzzleNumbers[cell.row][cell.col]--;
                    if (addWords(words.filter((w) => w !== word))) {
                        return true;
                    }
                    puzzleNumbers[cell.row][cell.col]++;
                    puzzleWords.forEach((row, index) => (row[cell.col] = backupCol[index]));
                }
            }
        }
        return false;
    }
    // If words cannot be added to the crossword
    if (!addWords(words)) {
        console.log("Error");
        return "Error";
    }
    //Format and return result of crossword
    const result = puzzleWords.map((row) => row.join("")).join("\n");
    console.log("Output:\n"+result);
    return "Output:\n" + result;
}

crosswordSolver('2000\n0...\n0...\n0...', ['abba','assa'])