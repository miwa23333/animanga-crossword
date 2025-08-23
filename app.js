"use strict";
const words = [
    "終末的後宮",
    "少女前線",
    "擅長捉弄人的高木同學",
    "戀上換裝娃娃",
    "明日同學的水手服",
    "派對咖孔明",
    "朋友遊戲",
    "相合之物",
    "古見同學有交流障礙症",
    "式守同學不只可愛而已",
    "夏日時光",
    "契約之吻",
    "異世界歸來的舅舅",
    "徹夜之歌",
    "惑星公主蜥蜴騎士",
    "狂賭之淵雙",
    "我的英雄學院",
    "黃金神威",
    "秋葉原冥途戰爭",
    "孤獨搖滾",
    "鏈鋸人",
    "間諜教室",
    "久保同學不放過我",
    "天國大魔境",
    "地獄樂",
    "我內心的糟糕念頭",
    "為美好的世界獻上爆焰",
    "在無神世界裡進行傳教活動",
    "我推的孩子",
    "我喜歡的女孩忘記戴眼鏡",
    "能幹貓今天也憂鬱",
    "死神少爺與黑女僕",
    "英雄教室",
    "葬送的芙莉蓮",
    "不死不運",
    "我們的雨色協議",
    "星靈感應",
    "藥師少女的獨語",
    "夢想成為魔法少女",
    "魔都精兵的奴隸",
    "迷宮飯",
    "我獨自升級",
    "關於我轉生變成史萊姆這檔事",
    "夜晚的水母不會游泳",
    "失憶投捕",
    "膽大黨",
];
const gridSize = 18;
function notUndefined(value) {
    if (value === undefined) {
        throw new Error("value === undefined");
    }
    return value;
}
function unreachable(never) {
    throw new Error("unreachable", { cause: { never } });
}
function assertType(value) {
    return value;
}
function at(o, index) {
    const value = o.at(index);
    if (value === undefined) {
        throw new Error("o.at(index) === undefined", {
            cause: { o, index, value },
        });
    }
    return value;
}
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [at(array, j), at(array, i)];
    }
    return array;
}
function createEmptyGrid(length) {
    return Array.from({ length }, () => Array(length).fill(null));
}
function canPlaceWord(grid, word, r, c, dir) {
    // FIX: Added checks for r and c being >= gridSize to prevent out-of-bounds errors.
    if (r < 0 || c < 0 || r >= grid.length) {
        return false;
    }
    const row = grid.at(r);
    if (row === undefined) {
        return false;
    }
    if (c >= row.length) {
        return false;
    }
    if (dir === "across") {
        if (c + word.length > row.length) {
            return false;
        }
        if (c > 0 && (row.at(c - 1) ?? null) !== null) {
            return false;
        }
        if (c + word.length < row.length &&
            (row.at(c + word.length) ?? null) !== null) {
            return false;
        }
        for (let i = 0; i < word.length; ++i) {
            // This check is now safe because we've already validated 'r' is in bounds.
            const v = row.at(c + i);
            if (v === undefined) {
                return false;
            }
            const isIntersection = v === at(word, i);
            const isEmpty = v === null;
            if (!isIntersection && !isEmpty) {
                return false;
            }
            if (isEmpty) {
                if (r > 0 && (grid.at(r - 1)?.at(c + i) ?? null) !== null) {
                    return false;
                }
                if (r < grid.length - 1 &&
                    (grid.at(r + 1)?.at(c + i) ?? null) !== null) {
                    return false;
                }
            }
        }
    }
    else {
        assertType(dir);
        if (r + word.length > grid.length) {
            return false;
        }
        if (r > 0 && (grid.at(r - 1)?.at(c) ?? null) !== null) {
            return false;
        }
        if (r + word.length < grid.length &&
            (grid.at(r + word.length)?.at(c) ?? null) !== null) {
            return false;
        }
        for (let i = 0; i < word.length; ++i) {
            const row = grid.at(r + i);
            if (row === undefined) {
                return false;
            }
            const v = row.at(c);
            if (v === undefined) {
                return false;
            }
            const isIntersection = v === at(word, i);
            const isEmpty = v === null;
            if (!isIntersection && !isEmpty) {
                return false;
            }
            if (isEmpty) {
                if (c > 0 && (row.at(c - 1) ?? null) !== null) {
                    return false;
                }
                if (c < row.length - 1 && (row.at(c + 1) ?? null) !== null) {
                    return false;
                }
            }
        }
    }
    return true;
}
function placeWord(placedWords, grid, word, r, c, dir, clueNum) {
    placedWords.push({ word, row: r, col: c, direction: dir, number: clueNum });
    for (let i = 0; i < word.length; ++i) {
        if (dir === "across") {
            at(grid, r)[c + i] = at(word, i);
        }
        else {
            assertType(dir);
            at(grid, r + i)[c] = at(word, i);
        }
    }
}
function swapDirection(direction) {
    switch (direction) {
        case "across":
            return "down";
        case "down":
            return "across";
        default:
            unreachable(direction);
    }
}
function generatePuzzle(words, gridSize) {
    const placedWords = [];
    const grid = createEmptyGrid(gridSize);
    const shuffledWords = shuffleArray([...words]);
    // ✨ FIX: Find a suitable first word that fits and remove it from the list.
    const firstWordIndex = shuffledWords.findIndex((w) => w.length <= gridSize);
    // Handle edge case where no word fits the grid.
    if (firstWordIndex === -1) {
        return "Could not find any word that fits in the grid.";
    }
    const firstWord = at(shuffledWords, firstWordIndex);
    shuffledWords.splice(firstWordIndex, 1);
    const remainingWords = shuffledWords.sort((a, b) => b.length - a.length);
    const startDirection = Math.random() < 0.5 ? "across" : "down";
    let startRow;
    let startCol;
    // Calculate centered starting position based on direction
    if (startDirection === "across") {
        startRow = Math.floor(gridSize / 2);
        startCol = Math.floor((gridSize - firstWord.length) / 2);
    }
    else {
        assertType(startDirection);
        startRow = Math.floor((gridSize - firstWord.length) / 2);
        startCol = Math.floor(gridSize / 2);
    }
    // Place the first word (the check is a formality here but good practice)
    if (canPlaceWord(grid, firstWord, startRow, startCol, startDirection)) {
        placeWord(placedWords, grid, firstWord, startRow, startCol, startDirection, 0);
    }
    else {
        // This should never happen on a blank grid if the length check passed
        return "Logical error: Failed to place the first word on an empty grid.";
    }
    let attempts = 0;
    let wordToPlace = remainingWords.shift();
    while (wordToPlace !== undefined && attempts < 10) {
        let bestFit = undefined;
        for (const pWord of placedWords) {
            for (let i = 0; i < pWord.word.length; ++i) {
                for (let j = 0; j < wordToPlace.length; ++j) {
                    if (at(pWord.word, i) === at(wordToPlace, j)) {
                        let r;
                        let c;
                        const newDir = swapDirection(pWord.direction);
                        if (pWord.direction === "across") {
                            r = pWord.row - j;
                            c = pWord.col + i;
                        }
                        else {
                            assertType(pWord.direction);
                            r = pWord.row + i;
                            c = pWord.col - j;
                        }
                        if (canPlaceWord(grid, wordToPlace, r, c, newDir)) {
                            let score = 0;
                            for (let k = 0; k < wordToPlace.length; ++k) {
                                if (newDir === "across") {
                                    if (at(at(grid, r), c + k) === at(wordToPlace, k)) {
                                        ++score;
                                    }
                                }
                                else {
                                    assertType(newDir);
                                    if (at(at(grid, r + k), c) === at(wordToPlace, k)) {
                                        ++score;
                                    }
                                }
                            }
                            if (bestFit === undefined || score > bestFit.score) {
                                bestFit = {
                                    word: wordToPlace,
                                    row: r,
                                    col: c,
                                    direction: newDir,
                                    score,
                                };
                            }
                        }
                    }
                }
            }
        }
        if (bestFit !== undefined) {
            placeWord(placedWords, grid, bestFit.word, bestFit.row, bestFit.col, bestFit.direction, 0);
            attempts = 0;
        }
        else {
            remainingWords.push(wordToPlace);
            ++attempts;
        }
        wordToPlace = remainingWords.shift();
    }
    let minR = gridSize;
    let maxR = 0;
    let minC = gridSize;
    let maxC = 0;
    for (const p of placedWords) {
        if (p.direction === "across") {
            minR = Math.min(minR, p.row);
            maxR = Math.max(maxR, p.row);
            minC = Math.min(minC, p.col);
            maxC = Math.max(maxC, p.col + p.word.length - 1);
        }
        else {
            assertType(p.direction);
            minR = Math.min(minR, p.row);
            maxR = Math.max(maxR, p.row + p.word.length - 1);
            minC = Math.min(minC, p.col);
            maxC = Math.max(maxC, p.col);
        }
    }
    const puzzleBounds = { minR, maxR, minC, maxC };
    placedWords.sort((a, b) => a.row * gridSize + a.col - (b.row * gridSize + b.col));
    let currentClue = 1;
    const starts = new Map();
    for (const word of placedWords) {
        const key = `${word.row.toString()},${word.col.toString()}`;
        let start = starts.get(key);
        if (start === undefined) {
            start = currentClue;
            ++currentClue;
            starts.set(key, start);
        }
        word.number = start;
    }
    return { placedWords, grid, puzzleBounds };
}
function findWordAt(r, c, direction, allWords) {
    return allWords.find((word) => {
        if (word.direction !== direction) {
            return false;
        }
        if (direction === "across") {
            return word.row === r && c >= word.col && c < word.col + word.word.length;
        }
        else {
            assertType(direction);
            return word.col === c && r >= word.row && r < word.row + word.word.length;
        }
    });
}
function* getInputsForWord(word) {
    for (let i = 0; i < word.word.length; ++i) {
        let r = word.row;
        let c = word.col;
        switch (word.direction) {
            case "across":
                c += i;
                break;
            case "down":
                r += i;
                break;
            default:
                unreachable(word.direction);
        }
        const input = document.querySelector(`input[data-row='${r.toString()}'][data-col='${c.toString()}']`);
        if (input !== null && input instanceof HTMLInputElement) {
            yield input;
        }
    }
}
function updateHighlight({ state, placedWords, }) {
    for (const el of document.querySelectorAll("input.highlight-focus")) {
        el.classList.remove("highlight-focus");
    }
    for (const el of document.querySelectorAll("input.highlight")) {
        el.classList.remove("highlight");
    }
    const focusInput = state.selectedBufferInput ?? state.selectedInput;
    if (focusInput === undefined) {
        return;
    }
    focusInput.classList.add("highlight-focus");
    const r = parseInt(notUndefined(focusInput.dataset["row"]), 10);
    const c = parseInt(notUndefined(focusInput.dataset["col"]), 10);
    const activeWord = findWordAt(r, c, state.currentDirection, placedWords);
    if (activeWord !== undefined) {
        const inputs = getInputsForWord(activeWord);
        for (const input of inputs) {
            if (input === focusInput) {
                continue;
            }
            input.classList.add("highlight");
        }
    }
}
function createBuffer({ old, parent, }) {
    const input = document.createElement("input");
    input.type = "text";
    input.style.zIndex = "-1";
    input.style.position = "absolute";
    // input.style.width = "0";
    // input.style.height = "0";
    // input.style.opacity = "0";
    // input.style.border = "none";
    if (old === undefined) {
        (parent ?? document.body).prepend(input);
        return input;
    }
    old.parentNode?.replaceChild(input, old);
    return input;
}
function render({ grid, placedWords, puzzleBounds, wordBankElement, state, }) {
    void placedWords;
    const gridElement = document.createElement("div");
    gridElement.id = "crossword-grid";
    state.gridElement.parentNode?.replaceChild(gridElement, state.gridElement);
    state.gridElement = gridElement;
    wordBankElement.innerHTML = "";
    const { minR, maxR, minC, maxC } = puzzleBounds;
    const displayRows = maxR - minR + 1;
    const displayCols = maxC - minC + 1;
    gridElement.style.setProperty("--grid-cols", displayCols.toString());
    gridElement.style.setProperty("--grid-rows", displayRows.toString());
    gridElement.style.aspectRatio = `${displayCols.toString()} / ${displayRows.toString()}`;
    const inputs = new Map();
    for (let r = minR; r <= maxR; ++r) {
        for (let c = minC; c <= maxC; ++c) {
            const cell = document.createElement("div");
            cell.className = "cell";
            if ((grid.at(r)?.at(c) ?? null) === null) {
                cell.classList.add("black");
            }
            else {
                const input = document.createElement("input");
                input.type = "text";
                input.maxLength = 1;
                input.dataset["row"] = r.toString();
                input.dataset["col"] = c.toString();
                inputs.set(`${r.toString()}-${c.toString()}`, input);
                cell.appendChild(input);
            }
            gridElement.appendChild(cell);
        }
    }
    const hintPercentage = 0.3;
    for (const { word, row, col, direction } of placedWords) {
        const numHints = Math.floor(word.length * hintPercentage);
        const indices = shuffleArray(Array.from({ length: word.length }, (_, i) => i));
        const hintIndices = indices.slice(0, numHints);
        for (const index of hintIndices) {
            let r = row;
            let c = col;
            if (direction === "across") {
                c += index;
            }
            else {
                assertType(direction);
                r += index;
            }
            const input = inputs.get(`${r.toString()}-${c.toString()}`);
            if (input !== undefined) {
                input.value = at(word, index);
                input.readOnly = true;
            }
        }
    }
    const addedClues = new Set();
    const sortedClues = [...placedWords].sort((a, b) => a.number - b.number);
    for (const { row, col, direction, number } of sortedClues) {
        const clueKey = `${number.toString()}-${direction}`;
        if (addedClues.has(clueKey)) {
            continue;
        }
        const gridRow = row - minR;
        const gridCol = col - minC;
        const cell = gridElement.children[gridRow * displayCols + gridCol];
        if (cell !== undefined) {
            const clueNumSpan = document.createElement("span");
            clueNumSpan.className = "clue-number";
            clueNumSpan.textContent = number.toString();
            cell.prepend(clueNumSpan);
        }
        addedClues.add(clueKey);
    }
    const unplacedWords = words.filter((w) => !placedWords.some((p) => p.word === w));
    const wordsToShow = [...placedWords.map((p) => p.word), ...unplacedWords];
    for (const word of shuffleArray(wordsToShow)) {
        const span = document.createElement("span");
        span.textContent = word;
        wordBankElement.appendChild(span);
    }
    // --- Event Handling Logic ---
    state.bufferElement = createBuffer({ old: state.bufferElement });
    state.bufferElement.addEventListener("focusin", (e) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        e.target.value = "";
    });
    state.bufferElement.addEventListener("compositionstart", (e) => {
        console.log("compositionstart", e);
        state.isComposing = true;
    });
    state.bufferElement.addEventListener("compositionupdate", (e) => {
        console.log("compositionupdate", e);
    });
    state.bufferElement.addEventListener("compositionend", (e) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        console.log("compositionend", e);
        state.isComposing = false;
        e.target.dispatchEvent(new Event("input", { bubbles: true }));
    });
    state.bufferElement.addEventListener("input", (e) => {
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        console.log("input", e.target.value, e);
        const text = e.target.value;
        if (state.isComposing) {
            for (const { input, value } of state.selectedWord) {
                input.value = value;
            }
        }
        const selectedInput = state.selectedInput;
        if (selectedInput !== undefined) {
            const wordInputs = state.selectedWord.map(({ input }) => input);
            const startIndex = wordInputs.indexOf(selectedInput);
            if (startIndex === -1) {
                throw new Error("startIndex === -1", {
                    cause: { wordInputs, selectedInput },
                });
            }
            let textIndex = 0;
            for (let i = startIndex; i < wordInputs.length && textIndex < text.length; ++i) {
                const currentInput = wordInputs[i];
                if (currentInput !== undefined && !currentInput.readOnly) {
                    currentInput.value = at(text, textIndex);
                }
                ++textIndex;
            }
            {
                let nextFocusTarget = undefined;
                for (let i = startIndex + text.length; i < wordInputs.length; ++i) {
                    const input = wordInputs[i];
                    if (input !== undefined) {
                        nextFocusTarget = input;
                        break;
                    }
                }
                if (nextFocusTarget !== undefined) {
                    state.selectedBufferInput = nextFocusTarget;
                    updateHighlight({ state, placedWords });
                }
            }
            if (!state.isComposing) {
                let nextFocusTarget = undefined;
                for (let i = startIndex + text.length; i < wordInputs.length; ++i) {
                    const input = wordInputs[i];
                    if (input !== undefined) {
                        nextFocusTarget = input;
                        break;
                    }
                }
                if (nextFocusTarget !== undefined) {
                    state.selectedInput = nextFocusTarget;
                    state.bufferElement.value = "";
                    updateHighlight({ state, placedWords });
                }
            }
        }
        if (!state.isComposing) {
            for (const w of state.selectedWord) {
                w.value = w.input.value;
            }
        }
        state.lastBufferText = text;
    });
    // gridElement.addEventListener("click", (e) => {
    //   console.log("gridElement", "click", e);
    //   if (!(e.target instanceof HTMLInputElement)) {
    //     return;
    //   }
    // });
    gridElement.addEventListener("focusin", (e) => {
        if (e.target === state.bufferElement) {
            return;
        }
        console.log("gridElement", "focusin", e);
        if (!(e.target instanceof HTMLInputElement)) {
            return;
        }
        for (const el of state.gridElement.querySelectorAll("input")) {
            el.style.backgroundColor = "";
        }
        const clickedInput = e.target;
        const r = parseInt(notUndefined(clickedInput.dataset["row"]), 10);
        const c = parseInt(notUndefined(clickedInput.dataset["col"]), 10);
        if (state.selectedInput === clickedInput) {
            state.currentDirection = swapDirection(state.currentDirection);
            if (findWordAt(r, c, state.currentDirection, placedWords) === undefined) {
                state.currentDirection = swapDirection(state.currentDirection);
            }
        }
        else {
            state.selectedInput = clickedInput;
            state.selectedInput.parentNode?.prepend(state.bufferElement);
            if (findWordAt(r, c, "across", placedWords) === undefined) {
                state.currentDirection = "down";
            }
            else {
                state.currentDirection = "across";
            }
        }
        state.selectedBufferInput = undefined;
        updateHighlight({ state, placedWords });
        state.selectedWord = [];
        const activeWord = findWordAt(r, c, state.currentDirection, placedWords);
        if (activeWord !== undefined) {
            state.selectedWord = Array.from(getInputsForWord(activeWord).map((input) => ({
                input,
                value: input.value,
            })));
        }
        state.bufferElement.focus({ preventScroll: true });
        console.log("state.selectedInput", state.selectedInput);
    });
    // gridElement.addEventListener("focusout", (e) => {
    //   console.log("gridElement", "focusout", e);
    //   if (!(e.target instanceof Element)) {
    //     return;
    //   }
    //   if (e.target.tagName === "INPUT") {
    //     e.target.setAttribute("maxLength", (1).toString());
    //   }
    // });
    // gridElement.addEventListener("compositionstart", () => {
    //   state.isComposing = true;
    // });
    // gridElement.addEventListener("compositionend", (e) => {
    //   if (!(e.target instanceof Element)) {
    //     return;
    //   }
    //   state.isComposing = false;
    //   e.target.dispatchEvent(new Event("input", { bubbles: true }));
    // });
    // gridElement.addEventListener("input", (e) => {
    //   if (e.target === state.bufferElement) {
    //     return;
    //   }
    //   if (!(e.target instanceof HTMLInputElement)) {
    //     return;
    //   }
    //   if (state.isComposing) {
    //     return;
    //   }
    //   const input = e.target;
    //   const text = input.value;
    //   if (text.length === 0) {
    //     return;
    //   }
    //   const r = parseInt(notUndefined(input.dataset["row"]), 10);
    //   const c = parseInt(notUndefined(input.dataset["col"]), 10);
    //   const activeWord = findWordAt(r, c, state.currentDirection, placedWords);
    //   if (activeWord === undefined) {
    //     return;
    //   }
    //   const wordInputs = Array.from(getInputsForWord(activeWord));
    //   const startIndex = wordInputs.indexOf(input);
    //   if (startIndex === -1) {
    //     throw new Error("startIndex === -1", { cause: { wordInputs, input } });
    //   }
    //   if (text.length > 1) {
    //     let textIndex = 0;
    //     for (
    //       let i = startIndex;
    //       i < wordInputs.length && textIndex < text.length;
    //       ++i
    //     ) {
    //       const currentInput = wordInputs[i];
    //       if (currentInput !== undefined && !currentInput.readOnly) {
    //         currentInput.value = at(text, textIndex);
    //       }
    //       ++textIndex;
    //     }
    //     input.value = at(text, 0);
    //   }
    //   // let nextFocusTarget: HTMLInputElement | undefined = undefined;
    //   // for (let i = startIndex + text.length; i < wordInputs.length; ++i) {
    //   //   const input = wordInputs[i];
    //   //   if (input !== undefined && !input.readOnly) {
    //   //     nextFocusTarget = wordInputs[i];
    //   //     break;
    //   //   }
    //   // }
    //   // if (nextFocusTarget !== undefined) {
    //   //   state.selectedInput = nextFocusTarget;
    //   //   nextFocusTarget.focus();
    //   //   updateHighlight({ state, placedWords });
    //   // }
    // });
    // gridElement.addEventListener("keydown", (e) => {
    //   if (!(e.target instanceof HTMLInputElement)) {
    //     return;
    //   }
    //   const input = e.target;
    //   if (input.tagName !== "INPUT") {
    //     return;
    //   }
    //   const r = parseInt(notUndefined(input.dataset["row"]), 10);
    //   const c = parseInt(notUndefined(input.dataset["col"]), 10);
    //   let nextInput: Element | null = null;
    //   if (e.key.startsWith("Arrow")) {
    //     e.preventDefault();
    //     switch (e.key) {
    //       case "ArrowUp": {
    //         if (state.currentDirection === "down") {
    //           nextInput = document.querySelector(
    //             `input[data-row='${(r - 1).toString()}'][data-col='${c.toString()}']`,
    //           );
    //         }
    //         state.currentDirection = "down";
    //         break;
    //       }
    //       case "ArrowDown":
    //         if (state.currentDirection === "down") {
    //           nextInput = document.querySelector(
    //             `input[data-row='${(r + 1).toString()}'][data-col='${c.toString()}']`,
    //           );
    //         }
    //         state.currentDirection = "down";
    //         break;
    //       case "ArrowLeft":
    //         if (state.currentDirection === "across") {
    //           nextInput = document.querySelector(
    //             `input[data-row='${r.toString()}'][data-col='${(c - 1).toString()}']`,
    //           );
    //         }
    //         state.currentDirection = "across";
    //         break;
    //       case "ArrowRight":
    //         if (state.currentDirection === "across") {
    //           nextInput = document.querySelector(
    //             `input[data-row='${r.toString()}'][data-col='${(c + 1).toString()}']`,
    //           );
    //         }
    //         state.currentDirection = "across";
    //         break;
    //     }
    //     if (nextInput instanceof HTMLInputElement) {
    //       state.selectedInput = nextInput;
    //       nextInput.focus();
    //     } else {
    //       state.selectedInput = input;
    //       input.focus();
    //     }
    //     updateHighlight({ state, placedWords });
    //   } else if (e.key === "Backspace" && input.value === "") {
    //     e.preventDefault();
    //     const activeWord = findWordAt(r, c, state.currentDirection, placedWords);
    //     if (activeWord === undefined) {
    //       return;
    //     }
    //     const wordInputs = Array.from(getInputsForWord(activeWord));
    //     const currentIndex = wordInputs.indexOf(input);
    //     if (currentIndex > 0) {
    //       for (let i = currentIndex - 1; i >= 0; --i) {
    //         const input = wordInputs[i];
    //         if (input !== undefined && !input.readOnly) {
    //           state.selectedInput = input;
    //           state.selectedInput.focus();
    //           updateHighlight({ state, placedWords });
    //           break;
    //         }
    //       }
    //     }
    //   }
    // });
}
function showCongratulationsModal() {
    const modal = getElementById(document, "congratulations-modal");
    modal.style.display = "block";
}
function hideCongratulationsModal() {
    const modal = getElementById(document, "congratulations-modal");
    modal.style.display = "none";
}
function checkAnswers(state) {
    const placedWords = state.placedWords;
    let allCorrect = true;
    let totalCells = 0;
    let correctCells = 0;
    for (const { word, row, col, direction } of placedWords) {
        for (let i = 0; i < word.length; ++i) {
            let r = row;
            let c = col;
            switch (direction) {
                case "across":
                    c += i;
                    break;
                case "down":
                    r += i;
                    break;
                default:
                    unreachable(direction);
            }
            const input = document.querySelector(`input[data-row='${r.toString()}'][data-col='${c.toString()}']`);
            if (input !== null &&
                input instanceof HTMLInputElement &&
                !input.readOnly) {
                ++totalCells;
                const isCorrect = input.value === word[i];
                input.style.backgroundColor = isCorrect ? "#d4edda" : "#f8d7da";
                if (isCorrect) {
                    ++correctCells;
                }
                else {
                    allCorrect = false;
                }
            }
        }
    }
    console.log(correctCells);
    if (allCorrect && totalCells > 0) {
        setTimeout(() => {
            showCongratulationsModal();
        }, 100);
    }
}
function revealAnswers(state) {
    const placedWords = state.placedWords;
    for (const { word, row, col, direction } of placedWords) {
        for (let i = 0; i < word.length; ++i) {
            let r = row;
            let c = col;
            switch (direction) {
                case "across":
                    c += i;
                    break;
                case "down":
                    r += i;
                    break;
                default:
                    unreachable(direction);
            }
            const input = document.querySelector(`input[data-row='${r.toString()}'][data-col='${c.toString()}']`);
            if (input !== null && input instanceof HTMLInputElement) {
                input.value = at(word, i);
                input.style.backgroundColor = "#d1ecf1";
            }
        }
    }
}
function getHint(state) {
    const placedWords = state.placedWords;
    const eligibleHintCells = [];
    for (const { word, row, col, direction } of placedWords) {
        for (let i = 0; i < word.length; ++i) {
            let r = row;
            let c = col;
            switch (direction) {
                case "across":
                    c += i;
                    break;
                case "down":
                    r += i;
                    break;
                default:
                    unreachable(direction);
            }
            const input = document.querySelector(`input[data-row='${r.toString()}'][data-col='${c.toString()}']`);
            if (input !== null &&
                input instanceof HTMLInputElement &&
                !input.readOnly &&
                input.value !== word[i]) {
                eligibleHintCells.push({ input, correctLetter: at(word, i) });
            }
        }
    }
    if (eligibleHintCells.length === 0) {
        alert("恭喜！所有答案都已正確填寫，或者沒有更多提示了。");
        return;
    }
    const randomHint = at(eligibleHintCells, Math.floor(Math.random() * eligibleHintCells.length));
    randomHint.input.value = randomHint.correctLetter;
    randomHint.input.readOnly = true;
    randomHint.input.classList.add("hint-revealed");
}
function init({ words, gridSize, wordBankElement, state, }) {
    const minWords = 3;
    let generationAttempts = 0;
    let result = undefined;
    do {
        const r = generatePuzzle(words, gridSize);
        if (typeof r === "string") {
            break;
        }
        result = r;
        ++generationAttempts;
        if (generationAttempts > 50) {
            console.warn(`Failed to generate a puzzle with at least ${minWords.toString()} words after 50 attempts.`);
            break;
        }
    } while (result.placedWords.length < minWords);
    state.placedWords = result?.placedWords ?? state.placedWords;
    // Only render if a puzzle was successfully generated
    if (result !== undefined && result.placedWords.length > 0) {
        render({
            ...result,
            wordBankElement,
            state,
        });
    }
}
function getElementById(document, elementId) {
    const element = document.getElementById(elementId);
    if (element === null) {
        throw new Error("element === null", { cause: { document, elementId } });
    }
    return element;
}
function querySelector(document, selectors) {
    const element = document.querySelector(selectors);
    if (element === null) {
        throw new Error("element === null", { cause: { document, selectors } });
    }
    return element;
}
document.addEventListener("DOMContentLoaded", () => {
    const state = {
        bufferElement: createBuffer({
        // parent: getElementById(document, "crossword-container"),
        }),
        lastBufferText: undefined,
        selectedBufferInput: undefined,
        gridElement: getElementById(document, "crossword-grid"),
        placedWords: [],
        selectedInput: undefined,
        selectedWord: [],
        currentDirection: "across",
        isComposing: false,
    };
    const wordBankElement = getElementById(document, "word-bank-list");
    getElementById(document, "check-btn").addEventListener("click", () => {
        checkAnswers(state);
    });
    getElementById(document, "reveal-btn").addEventListener("click", () => {
        revealAnswers(state);
    });
    getElementById(document, "reset-btn").addEventListener("click", () => {
        init({ words, gridSize, wordBankElement, state });
    });
    getElementById(document, "hint-btn").addEventListener("click", () => {
        getHint(state);
    });
    getElementById(document, "modal-ok-btn").addEventListener("click", hideCongratulationsModal);
    querySelector(document, ".close").addEventListener("click", hideCongratulationsModal);
    window.addEventListener("click", (event) => {
        const modal = getElementById(document, "congratulations-modal");
        if (event.target === modal) {
            hideCongratulationsModal();
        }
    });
    init({ words, gridSize, wordBankElement, state });
});
