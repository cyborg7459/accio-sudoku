const squares = document.querySelectorAll('.square');
const mainBtn = document.getElementById('main-btn');

let rows = []; 
let cols = [];   
let box = [];    
let grid;

squares.forEach((square, idx) => {
    const i = Math.floor(idx/9);
    const j = idx % 9;
    square.setAttribute('i', i);
    square.setAttribute('j', j);
})

squares.forEach(square => {
    square.addEventListener('click', () => {
        squares.forEach(square => {
            square.classList.remove('selected');
            value.disabled = false;
        })
        square.classList.add('selected');
    })
    square.addEventListener('change', () => {
        const num = 1 * square.value;
        if(!num && num !== 0) {
            square.value = 0;
            return alert("Please enter an integer");
        }
        if(num < 0 || num > 9) {
            square.value = 0;
            return alert("Please enter a number between 0 and 9");
        }
        square.value = num; 
        square.classList.remove('selected');
        if(num != 0) square.classList.add('set');
    })
})

const clear = () => {
    squares.forEach(square => {
        square.classList.remove('selected');
    });
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

const fillInitials = () => {
    let b = true;
    squares.forEach(square => {
        const num = 1 * square.value;
        if(num > 0) {
            const i = 1 * square.getAttribute('i');
            const j = 1 * square.getAttribute('j');
            const boxi = Math.floor(i/3);
            const boxj = Math.floor(j/3);
            const bool1 = rows[i].find(x => x === num);
            const bool2 = cols[j].find(x => x === num);
            const bool3 = box[boxi][boxj].find(x => x === num);
            if(!bool1 && !bool2 && !bool3) {
                rows[i].push(num);
                cols[j].push(num);
                box[boxi][boxj].push(num);
            }
            else b = false;
        }
    })
    return b;
}

const createGrid = () => {
    grid = [];
    for(let i=0; i<9; i++) {
        let arr = new Array(9);
        grid.push(arr);
    }
    squares.forEach(square => {
        const i = square.getAttribute('i');
        const j = square.getAttribute('j');
        const num = 1 * square.value;
        grid[i][j] = num;
    })
}

const isValid = (i, j, num) => {
    if(rows[i].find(x => x === num)) return false;
    if(cols[j].find(x => x === num)) return false;
    if(box[Math.floor(i/3)][Math.floor(j/3)].find(x => x === num)) return false;
    return true;
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
            grid[i][j] = num;
            rows[i].push(num);
            cols[j].push(num);
            box[Math.floor(i/3)][Math.floor(j/3)].push(num);
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

const sudokuSolve = () => {
    return sudoku(0, 0, grid);
}

const printSudoku = () => {
    squares.forEach(square => {
        const i = 1 * square.getAttribute('i');
        const j = 1 * square.getAttribute('j');
        square.value = grid[i][j];
        square.disabled = true;
    })
}

const reset = () => {
    squares.forEach(square => {
        square.value = "0";
        square.classList.remove('set');
        square.disabled = false;
    })
    mainBtn.innerHTML = "Solve sudoku";
}

mainBtn.addEventListener('click', () => {
    if(mainBtn.innerHTML === "Reset Sudoku") {
        reset();
    }
    else {
        clear();
        initialiseArrays();
        let b = fillInitials();
        if(!b) return alert("Invalid input : Some rows/columns/boxes have duplicate values");
        createGrid();
        b = sudokuSolve();
        if(b) printSudoku();
        else return alert("This sudoku cannot be solved");
        mainBtn.innerHTML = "Reset Sudoku";    
    }
})