document.addEventListener('DOMContentLoaded', () => {
    const words = [
        "終末的後宮", "少女前線", "擅長捉弄人的高木同學", "戀上換裝娃娃", "明日同學的水手服",
        "派對咖孔明", "朋友遊戲", "相合之物", "古見同學有交流障礙症", "式守同學不只可愛而已",
        "夏日時光", "契約之吻", "異世界歸來的舅舅", "徹夜之歌", "惑星公主蜥蜴騎士", "狂賭之淵雙",
        "我的英雄學院", "黃金神威", "秋葉原冥途戰爭", "孤獨搖滾", "鏈鋸人",
        "間諜教室", "久保同學不放過我", "天國大魔境", "地獄樂", "我內心的糟糕念頭",
        "為美好的世界獻上爆焰", "在無神世界裡進行傳教活動", "我推的孩子", "我喜歡的女孩忘記戴眼鏡",
        "能幹貓今天也憂鬱", "死神少爺與黑女僕", "英雄教室", "葬送的芙莉蓮", "不死不運",
        "我們的雨色協議", "星靈感應", "藥師少女的獨語", "夢想成為魔法少女", "魔都精兵的奴隸",
        "迷宮飯", "我獨自升級", "關於我轉生變成史萊姆這檔事", "夜晚的水母不會游泳",
        "失憶投捕", "膽大黨"
    ];

    const gridSize = 18;
    let grid, placedWords, puzzleBounds;

    const gridElement = document.getElementById('crossword-grid');
    const wordBankElement = document.getElementById('word-bank-list');

    function createEmptyGrid() {
        return Array.from({ length: gridSize }, () => Array(gridSize).fill(null));
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function canPlaceWord(word, r, c, dir) {
        if (r < 0 || c < 0) return false;

        if (dir === 'across') {
            if (c + word.length > gridSize) return false;
            if (c > 0 && grid[r][c - 1] !== null) return false;
            if (c + word.length < gridSize && grid[r][c + word.length] !== null) return false;

            for (let i = 0; i < word.length; i++) {
                const isIntersection = grid[r][c + i] === word[i];
                const isEmpty = grid[r][c + i] === null;

                if (!isIntersection && !isEmpty) return false;

                if (isEmpty) {
                    if (r > 0 && grid[r - 1][c + i] !== null) return false;
                    if (r < gridSize - 1 && grid[r + 1][c + i] !== null) return false;
                }
            }
        } else { // down
            if (r + word.length > gridSize) return false;
            if (r > 0 && grid[r - 1][c] !== null) return false;
            if (r + word.length < gridSize && grid[r + word.length][c] !== null) return false;

            for (let i = 0; i < word.length; i++) {
                const isIntersection = grid[r + i][c] === word[i];
                const isEmpty = grid[r + i][c] === null;

                if (!isIntersection && !isEmpty) return false;

                if (isEmpty) {
                    if (c > 0 && grid[r + i][c - 1] !== null) return false;
                    if (c < gridSize - 1 && grid[r + i][c + 1] !== null) return false;
                }
            }
        }
        return true;
    }

    function placeWord(word, r, c, dir, clueNum) {
        const wordInfo = { word, row: r, col: c, direction: dir, number: clueNum };
        placedWords.push(wordInfo);

        for (let i = 0; i < word.length; i++) {
            if (dir === 'across') {
                grid[r][c + i] = word[i];
            } else {
                grid[r + i][c] = word[i];
            }
        }
    }

    function generatePuzzle() {
        placedWords = [];
        grid = createEmptyGrid();

        const shuffledWords = shuffleArray([...words]);
        const firstWord = shuffledWords.shift();
        const remainingWords = shuffledWords.sort((a, b) => b.length - a.length);

        const startDirection = Math.random() < 0.5 ? 'across' : 'down';
        const startRow = Math.floor(gridSize / 2);
        const startCol = Math.floor((gridSize - firstWord.length) / 2);
        placeWord(firstWord, startRow, startCol, startDirection, 0);

        let attempts = 0;
        while (remainingWords.length > 0 && attempts < 10) {
            const wordToPlace = remainingWords.shift();
            let bestFit = { score: -1 };

            for (const pWord of placedWords) {
                for (let i = 0; i < pWord.word.length; i++) {
                    for (let j = 0; j < wordToPlace.length; j++) {
                        if (pWord.word[i] === wordToPlace[j]) {
                            let r, c;
                            const newDir = pWord.direction === 'across' ? 'down' : 'across';

                            if (pWord.direction === 'across') {
                                r = pWord.row - j;
                                c = pWord.col + i;
                            } else {
                                r = pWord.row + i;
                                c = pWord.col - j;
                            }

                            if (canPlaceWord(wordToPlace, r, c, newDir)) {
                                let score = 0;
                                for (let k = 0; k < wordToPlace.length; k++) {
                                    if (newDir === 'across' && grid[r][c + k] === wordToPlace[k]) score++;
                                    if (newDir === 'down' && grid[r + k][c] === wordToPlace[k]) score++;
                                }
                                if (score > bestFit.score) {
                                    bestFit = { word: wordToPlace, row: r, col: c, direction: newDir, score };
                                }
                            }
                        }
                    }
                }
            }

            if (bestFit.score > -1) {
                placeWord(bestFit.word, bestFit.row, bestFit.col, bestFit.direction, 0);
                attempts = 0;
            } else {
                remainingWords.push(wordToPlace);
                attempts++;
            }
        }

        let minR = gridSize, maxR = 0, minC = gridSize, maxC = 0;
        if (placedWords.length > 0) {
            for (const p of placedWords) {
                if (p.direction === 'across') {
                    minR = Math.min(minR, p.row);
                    maxR = Math.max(maxR, p.row);
                    minC = Math.min(minC, p.col);
                    maxC = Math.max(maxC, p.col + p.word.length - 1);
                } else { // down
                    minR = Math.min(minR, p.row);
                    maxR = Math.max(maxR, p.row + p.word.length - 1);
                    minC = Math.min(minC, p.col);
                    maxC = Math.max(maxC, p.col);
                }
            }
        }
        puzzleBounds = { minR, maxR, minC, maxC };

        placedWords.sort((a, b) => (a.row * gridSize + a.col) - (b.row * gridSize + b.col));
        let currentClue = 1;
        const starts = {};
        for (const word of placedWords) {
            const key = `${word.row},${word.col}`;
            if (!starts[key]) {
                starts[key] = currentClue++;
            }
            word.number = starts[key];
        }
    }

    function render() {
        gridElement.innerHTML = '';
        wordBankElement.innerHTML = '';

        const { minR, maxR, minC, maxC } = puzzleBounds;
        const displayRows = maxR - minR + 1;
        const displayCols = maxC - minC + 1;

        gridElement.style.setProperty('--grid-cols', displayCols);
        gridElement.style.setProperty('--grid-rows', displayRows);
        gridElement.style.aspectRatio = `${displayCols} / ${displayRows}`;

        const inputs = {};

        for (let r = minR; r <= maxR; r++) {
            for (let c = minC; c <= maxC; c++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                if (grid[r][c] === null) {
                    cell.classList.add('black');
                } else {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.maxLength = 1;
                    input.dataset.row = r;
                    input.dataset.col = c;
                    inputs[`${r}-${c}`] = input;
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
                let r = row, c = col;
                if (direction === 'across') c += index;
                else r += index;

                const input = inputs[`${r}-${c}`];
                if (input) {
                    input.value = word[index];
                    input.readOnly = true;
                }
            }
        }

        const addedClues = new Set();
        const sortedClues = [...placedWords].sort((a, b) => a.number - b.number);
        for (const { row, col, direction, number } of sortedClues) {
            const clueKey = `${number}-${direction}`;
            if (addedClues.has(clueKey)) continue;

            const gridRow = row - minR;
            const gridCol = col - minC;

            const cell = gridElement.children[gridRow * displayCols + gridCol];
            if (cell) {
                const clueNumSpan = document.createElement('span');
                clueNumSpan.className = 'clue-number';
                clueNumSpan.textContent = number;
                cell.prepend(clueNumSpan);
            }
            addedClues.add(clueKey);
        }

        const unplacedWords = words.filter(w => !placedWords.some(p => p.word === w));
        const wordsToShow = [...placedWords.map(p => p.word), ...unplacedWords];

        shuffleArray(wordsToShow).forEach(word => {
            const span = document.createElement('span');
            span.textContent = word;
            wordBankElement.appendChild(span);
        });

        gridElement.addEventListener('keyup', e => {
            const input = e.target;
            if (!input.matches('input')) return;
            const r = parseInt(input.dataset.row);
            const c = parseInt(input.dataset.col);

            let nextInput;
            switch (e.key) {
                case 'ArrowUp': nextInput = inputs[`${r - 1}-${c}`]; break;
                case 'ArrowDown': nextInput = inputs[`${r + 1}-${c}`]; break;
                case 'ArrowLeft': nextInput = inputs[`${r}-${c - 1}`]; break;
                case 'ArrowRight': nextInput = inputs[`${r}-${c + 1}`]; break;
            }
            if (nextInput) nextInput.focus();
        });
    }

    function checkAnswers() {
        let allCorrect = true;
        let totalCells = 0;
        let correctCells = 0;

        for (const { word, row, col, direction } of placedWords) {
            for (let i = 0; i < word.length; i++) {
                const r = direction === 'down' ? row + i : row;
                const c = direction === 'across' ? col + i : col;
                const input = document.querySelector(`input[data-row='${r}'][data-col='${c}']`);
                if (input && !input.readOnly) {
                    totalCells++;
                    const isCorrect = input.value === word[i];
                    input.style.backgroundColor = isCorrect ? '#d4edda' : '#f8d7da';

                    if (isCorrect) {
                        correctCells++;
                    } else {
                        allCorrect = false;
                    }
                }
            }
        }

        // Show congratulations modal if all answers are correct
        if (allCorrect && totalCells > 0) {
            setTimeout(() => {
                showCongratulationsModal();
            }, 100); // Small delay to let the visual feedback appear first
        }
    }

    function revealAnswers() {
        for (const { word, row, col, direction } of placedWords) {
            for (let i = 0; i < word.length; i++) {
                const r = direction === 'down' ? row + i : row;
                const c = direction === 'across' ? col + i : col;
                const input = document.querySelector(`input[data-row='${r}'][data-col='${c}']`);
                if (input) {
                    input.value = word[i];
                    input.style.backgroundColor = '#d1ecf1';
                }
            }
        }
    }

    function getHint() {
        const eligibleHintCells = [];

        // Find all cells that are not read-only and not correctly filled
        for (const { word, row, col, direction } of placedWords) {
            for (let i = 0; i < word.length; i++) {
                const r = (direction === 'down') ? row + i : row;
                const c = (direction === 'across') ? col + i : col;
                const input = document.querySelector(`input[data-row='${r}'][data-col='${c}']`);

                if (input && !input.readOnly && input.value !== word[i]) {
                    eligibleHintCells.push({
                        input: input,
                        correctLetter: word[i]
                    });
                }
            }
        }

        if (eligibleHintCells.length === 0) {
            alert("恭喜！所有答案都已正確填寫，或者沒有更多提示了。");
            return;
        }

        // Pick a random cell from the eligible list
        const randomHint = eligibleHintCells[Math.floor(Math.random() * eligibleHintCells.length)];

        // Fill the cell and make it read-only
        randomHint.input.value = randomHint.correctLetter;
        randomHint.input.readOnly = true;
        randomHint.input.classList.add('hint-revealed'); // Add class for special styling
    }

    function showCongratulationsModal() {
        const modal = document.getElementById('congratulations-modal');
        modal.style.display = 'block';
    }

    function hideCongratulationsModal() {
        const modal = document.getElementById('congratulations-modal');
        modal.style.display = 'none';
    }

    function init() {
        const minWords = 3;
        let generationAttempts = 0;

        do {
            generatePuzzle();
            generationAttempts++;
            if (generationAttempts > 50) {
                console.warn(`Failed to generate a puzzle with at least ${minWords} words after 50 attempts.`);
                break;
            }
        } while (placedWords.length < minWords);

        render();
    }

    document.getElementById('check-btn').addEventListener('click', checkAnswers);
    document.getElementById('reveal-btn').addEventListener('click', revealAnswers);
    document.getElementById('reset-btn').addEventListener('click', init);
    document.getElementById('hint-btn').addEventListener('click', getHint); // Add event listener for the new button

    // Modal event listeners
    document.getElementById('modal-ok-btn').addEventListener('click', hideCongratulationsModal);
    document.querySelector('.close').addEventListener('click', hideCongratulationsModal);

    // Close modal when clicking outside of it
    window.addEventListener('click', (event) => {
        const modal = document.getElementById('congratulations-modal');
        if (event.target === modal) {
            hideCongratulationsModal();
        }
    });

    init();
});
