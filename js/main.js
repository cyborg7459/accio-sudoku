const squares = document.querySelectorAll('.square');
const solveBtn = document.getElementById('solve-btn');
const checkBtn = document.getElementById('check-btn');

let rows = []; 
let cols = [];   
let box = [];    
let grid = [];

squares.forEach((square, idx) => {
    const i = Math.floor(idx/9);
    const j = idx % 9;
    square.setAttribute('i', i);
    square.setAttribute('j', j);
})

const addSquaresFunctionality = () => {
    squares.forEach(square => {
        square.addEventListener('change', () => {
            const num = 1 * square.value;
            if(!num && num !== 0) {
                square.value = 0;
                return alert("Please enter an integer");
            }
            else if(num < 0 || num > 9) {
                square.value = 0;
                return alert("Value should lie between 0 and 9");
            }
            else if(num === 0) square.value = 0;
        })
    })
}

const initialiseArrays = () => {
    rows = [];
    cols = [];
    box = [];
    for(let i = 0; i<9; i++) {
        let arr = [];
        let arr1 = [];
        rows.push(arr);
        cols.push(arr1);
    }
    for(let i = 0; i<3; i++) {
        let arr = [];
        for(let j=0; j<3; j++) {
            let temp = [];
            arr.push(temp);
        }
        box.push(arr);
    }
}

const isValid = (i, j, num) => {
    if(rows[i].find(x => x === num)) return false;
    if(cols[j].find(x => x === num)) return false;
    if(box[Math.floor(i/3)][Math.floor(j/3)].find(x => x === num)) return false;
    return true;
}

const insertInGrid = (i, j, num) => {
    grid[i][j] = num;
    rows[i].push(num);
    cols[j].push(num);
    box[Math.floor(i/3)][Math.floor(j/3)].push(num);
}

const generateNewGrid = () => {
    for(let i=0; i<9; i++) {
        let arr = new Array(9);
        grid.push(arr);
    }
    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            grid[i][j] = 0;
        }
    }

    let cnt = 0;
    while(cnt != 15) {
        let i = Math.floor(Math.random() * 9);
        let j = Math.floor(Math.random() * 9);
        if(grid[i][j] !== 0) continue;
        else {
            let num = Math.floor(Math.random() * 9) + 1;
            if(isValid(i,j,num)) {
                insertInGrid(i,j,num);
                cnt++;
            }
            else {
                for(let x=1; x<10; x++) {
                    if(isValid(i,j,x)) {
                        insertInGrid(i,j,x);
                        cnt++;
                        break;
                    }
                }
            }
        }
    }
}

const fillBoard = () => {
    squares.forEach(square => {
        square.setAttribute('set', 'false');
        square.disabled = false;
        square.classList.remove('set');
        const i = square.getAttribute('i');
        const j = square.getAttribute('j');
        square.value = grid[i][j];
        if(grid[i][j] !== 0) {
            square.disabled = true;
            square.classList.add('set');
            square.setAttribute('set', 'true');
        }
    })
}

const startNewGame = () => {
    initialiseArrays();
    generateNewGrid();
    fillBoard();
    addSquaresFunctionality();
    checkBtn.disabled = false;
    solveBtn.innerHTML = "Display Solution"
}

const checkSolution = () => {
    let b = false, b1 = false;
    squares.forEach(square => {
        if(square.getAttribute('set') === 'false') {
            const num = 1 * square.value;
            const i = 1 * square.getAttribute('i');
            const j = 1 * square.getAttribute('j');
            if(num === 0) b = true;
            else {
                if(rows[i].find(x => x === num)) {
                    console.log("Duplicate ", num, " in row ", i);
                    b1 = true;
                }
                else if(cols[j].find(x => x === num)) {
                    console.log("Duplicate ", num, " in col ", j);
                    b1 = true;
                }
                else if(box[Math.floor(i/3)][Math.floor(j/3)].find(x => x === num)) {
                    console.log("Duplicate ", num, " in box ", i, j);
                    b1 = true;
                }
                else {
                    rows[i].push(num);
                    cols[j].push(num);
                    box[Math.floor(i/3)][Math.floor(j/3)].push(num);
                }
            }
        }
    })
    if(b) return alert("Please enter all values");
    else if(b1) return alert("Wrong solution!! Duplicates found");
    else alert("Correct solution!!!");
    checkBtn.disabled = true;
}

const sudoku = (i, j) => {
    if(i == 9) return true;
    if(grid[i][j] != 0) {
        let x = i, y = j+1;
        if(y == 9) {
            x++;
            y = 0;
        }
        return sudoku(x, y);
    }
    let b = false;
    for(let num = 1; num < 10; num++) {
        if(isValid(i, j, num)) {
            insertInGrid(i, j, num);
            let x = i, y = j+1;
            if(y == 9) {
                y = 0;
                x++;
            }
            b = b || sudoku(x, y);
            if(b) break;
            rows[i].pop();
            cols[j].pop();
            box[Math.floor(i/3)][Math.floor(j/3)].pop();
            grid[i][j] = 0;
        }
    }
    return b;
}

const printSolution = () => {
    squares.forEach(square => {
        if(square.getAttribute('set') === 'false') {
            const i = 1 * square.getAttribute('i');
            const j = 1 * square.getAttribute('j');
            square.value = grid[i][j];
        }
    })
}

checkBtn.addEventListener('click', checkSolution)
solveBtn.addEventListener('click', () => {
    if(solveBtn.innerHTML === "Reset Sudoku") {
        startNewGame();
    }
    else {
        let b = sudoku(0, 0);
        if(b) printSolution();
        else alert("This sudoku cannot be solved");
        solveBtn.innerHTML = "Reset Sudoku";
        checkBtn.disabled = true;
    }
})

startNewGame();