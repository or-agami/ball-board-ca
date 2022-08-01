const WALL = 'WALL'
const FLOOR = 'FLOOR'
const PORTAL = 'PORTAL'
const BALL = 'BALL'
const GAMER = 'GAMER'
const GLUE = 'GLUE'

const GAMER_IMG = '<img src="img/gamer.png" />'
const STUCK_IMG = '<img src="img/.png" />'
const BALL_IMG = '<img src="img/ball.png" />'
const GLUE_IMG = '<img src="img/candy.png" />'
const ELEMENT_IMG = { BALL: BALL_IMG, GAMER: GAMER_IMG, GLUE: GLUE_IMG }

const elPlayButton = document.getElementById('play-button')

var gBoard, gGamerPos, playerInPortal, gameRunning, ballInterval, glueInterval, isStuck

function initGame() {
    elPlayButton.classList.toggle("hide-button")
    gGamerPos = { i: 2, j: 9 }
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function playGame(elButton) {
    if (elButton.innerText === "Play") {
        gameRunning = true
        ballInterval = setInterval(randomPlaceElement, 1000, BALL)
        glueInterval = setInterval(randomPlaceElement, 5000, GLUE)
    }
}

function buildBoard() {
    // Create the Matrix
    var board = createMat(15, 13)


    // Put FLOOR everywhere and WALL at edges
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[0].length; j++) {
            // Put FLOOR in a regular cell
            var cell = { type: FLOOR, gameElement: null }

            // Place Walls at edges
            if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
                if (j !== ((board[0].length - 1) / 2) && i !== ((board.length - 1) / 2)) {
                    cell.type = WALL
                } else cell.type = PORTAL
            }

            // Add created cell to The game board
            board[i][j] = cell
        }
    }

    // Place the gamer at selected position
    board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

    // Place the Balls (currently randomly chosen positions)
    for (let i = 0; i < 2; i++) {
        let randomRow = getRandomInt(1, board.length - 1)
        let randomCol = getRandomInt(1, board[0].length - 1)
        board[randomRow][randomCol].gameElement = BALL
    }

    return board
}

// Render the board to an HTML table
function renderBoard(board) {

    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>\n'
        for (var j = 0; j < board[0].length; j++) {
            var currCell = board[i][j]

            var cellClass = getClassName({ i: i, j: j })

            // TODO - change to short if statement
            if (currCell.type === FLOOR) cellClass += ' floor'
            else if (currCell.type === PORTAL) cellClass += ' portal'
            else if (currCell.type === WALL) cellClass += ' wall'

            strHTML += `\t<td class="cell ${cellClass}"  onclick="moveTo(${i}, ${j})" >\n`

            // TODO - change to switch case statement
            if (currCell.gameElement === GAMER) {
                strHTML += GAMER_IMG
            } else if (currCell.gameElement === BALL) {
                strHTML += BALL_IMG
            }
            strHTML += '\t</td>\n'
        }
        strHTML += '</tr>\n'
    }

    var elBoard = document.querySelector('.board')
    elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

    // Checking if game is running 
    if (!gameRunning) return alert('Press Play First!')

    // Checking if player is in portal
    if (playerInPortal) {
        var iLength = gBoard.length - 1
        var jLength = gBoard[0].length - 1
        i = i < 0 ? iLength
            : i > iLength ? 0 : i
        j = j < 0 ? jLength
            : j > jLength ? 0 : j
    }

    var targetCell = gBoard[i][j]
    if (targetCell.type === WALL) return
    playerInPortal = false
    if (targetCell.type === PORTAL) playerInPortal = true

    if (legalMove(i, j) && !isStuck) {
        if (targetCell.gameElement === BALL) {
            console.log('Collecting!')
        }
        if (targetCell.gameElement === GLUE) {
            console.log('Stuck');
            isStuck = true
            setTimeout(() => { isStuck = false }, 3000)
        }

        // MOVING from current position
        // Model:
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
        // Dom:
        renderCell(gGamerPos, '')

        // MOVING to selected position
        // Model:
        gGamerPos.i = i
        gGamerPos.j = j
        gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
        // DOM:
        renderCell(gGamerPos, GAMER_IMG);

    } // else console.log('TOO FAR', iAbsDiff, jAbsDiff);

}

function randomPlaceElement(element) {
    // Array with empty cells
    let emptyCells = []
    for (let i = 0; i < gBoard.length; i++) {
        for (let j = 0; j < gBoard[0].length; j++) {
            if (i === 0 || i === gBoard.length - 1 || j === 0 || j === gBoard[0].length - 1) {
                continue
            } else if (gBoard[i][j].gameElement === GAMER) {
                gGamerPos.i = i
                gGamerPos.j = j
            } else if (gBoard[i][j].gameElement === null) {
                emptyCells.push({ i, j })
            }
        }
    }
    if (emptyCells.length < 2) clearIntervall(ballInterval)
    emptyCells = shuffleArray(emptyCells)

    let newElementPos = emptyCells.shift()
    gBoard[newElementPos.i][newElementPos.j].gameElement = element
    renderCell(newElementPos, ELEMENT_IMG[element])
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
    if (value === GLUE_IMG) {
        setTimeout(() => { clearGlue(location) }, 3000)
    }
    var cellSelector = '.' + getClassName(location)
    var elCell = document.querySelector(cellSelector)
    elCell.innerHTML = value
}

function clearGlue(location) {
    if (gGamerPos.i !== location.i && gGamerPos.j !== location.j) {
        gBoard[location.i][location.j].gameElement = null
        renderCell(location, '')
    }
}

// Move the player by keyboard arrows
function handleKey(event) {

    let i = gGamerPos.i
    let j = gGamerPos.j

    switch (event.key) {
        case 'ArrowLeft':
        case 'a':
            moveTo(i, j - 1);
            break;
        case 'ArrowRight':
        case 'd':
            moveTo(i, j + 1);
            break;
        case 'ArrowUp':
        case 'w':
            moveTo(i - 1, j);
            break;
        case 'ArrowDown':
        case 's':
            moveTo(i + 1, j);
            break;
    }
}

// Checking legal move 
function legalMove(i, j) {

    // Calculate distance to make sure we are moving to a neighbor cell
    var iAbsDiff = Math.abs(i - gGamerPos.i)
    var jAbsDiff = Math.abs(j - gGamerPos.j)

    // If the clicked Cell is one of the four allowed
    if (iAbsDiff === 0) {
        if (jAbsDiff === 1 || (jAbsDiff === gBoard[0].length - 1 && playerInPortal)) {
            return true
        }
    } else if (jAbsDiff === 0) {
        if (iAbsDiff === 1 || (iAbsDiff === gBoard.length - 1 && playerInPortal)) {
            return true
        }
    }
    return false
}

// Returns the class name for a specific cell
function getClassName(location) {
    var cellClass = `cell-${location.i}-${location.j}`;
    return cellClass;
}
