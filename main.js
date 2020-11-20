var board = [];
var nbBomb = 10;
var touchedBomb = false;
var discovered = 0;
var gridMax = 10;

generateBoard();

function addBomb() {
    if(nbBomb >= 50) return;
    nbBomb++;
    generateBoard();
}

function removeBomb() {
    if(nbBomb <= 3) return;
    nbBomb--;
    generateBoard();
}

function removeGrid() {
    if(gridMax <= 5) return;
    gridMax--;
    generateBoard();
}

function addGrid() {
    if(gridMax >= 20) return;
    gridMax++;
    generateBoard();
}

function generateBoard() {
    document.getElementById("message").innerHTML = "";

    var boardHTML = document.getElementById("board");

    document.getElementById("bombsNB").innerHTML = "Bombs: " + nbBomb;
    document.getElementById("gridSize").innerHTML = "Grid: " + gridMax;

    var nb = 0;
    touchedBomb = false;
    for (var x = 0; x < gridMax; x++) {
        if (!document.getElementById("row-"+x)) {
            var row = document.createElement("div");
            row.className = "row";
            row.id = "row-" + x;
            boardHTML.appendChild(row);
        }
        document.getElementById("row-"+x).style = "height:"+(50/gridMax)+"vh;"
        board[x] = [];
        for (var y = 0; y < gridMax; y++) {
            board[x][y] = "case";
            if (!document.getElementById(x + "-" + y)) {
                var button = document.createElement("div");
                button.className = "case";
                button.id = x + "-" + y;
                button.onclick = function () {
                    click(this.id.split("-")[0], this.id.split("-")[1]);
                }
                document.getElementById("row-"+x).appendChild(button);
            }
            if(document.getElementById(x + "-" + gridMax)) {
               var element = document.getElementById(x + "-" + gridMax);
               element.parentNode.removeChild(element);
            }
            document.getElementById(x + "-" + y).className = "case";
            document.getElementById(x + "-" + y).innerHTML = "";
        }
        if(document.getElementById("row-"+gridMax)) {
            var element = document.getElementById("row-"+gridMax);
            element.parentNode.removeChild(element);
        }
    }
    discovered = gridMax * gridMax;
    while (nb < nbBomb) {
        var x = randomInt(0, gridMax);
        var y = randomInt(0, gridMax);
        if (board[x][y] != "bomb") {
            board[x][y] = "bomb";
            nb++;
        }
    }
}

function click(x, y) {
    if (!touchedBomb && discovered != nbBomb) {
        if (board[x][y] == "bomb") {
            document.getElementById(x + "-" + y).className = "bomb";
            touchedBomb = true;
        } else if (board[x][y] == "case") {
            clearAround(x, y);
        }
    }
    if(discovered == nbBomb) {
        document.getElementById("message").innerHTML = "You win";
    } else if(touchedBomb) {
        document.getElementById("message").innerHTML = "You loose";
    }
}

function clearAround(x, y) {
    x = parseInt(x);
    y = parseInt(y);

    if (x >= 0 && y >= 0 && x < gridMax && y < gridMax && document.getElementById(x + "-" + y).className != "discovered") {
        document.getElementById(x + "-" + y).className = "discovered";
        discovered--;

        var bombs = bombAround(x, y);
        if (bombs != 0) {
            document.getElementById(x + "-" + y).innerHTML = bombs;
        } else {
            clearAround(x, y - 1);
            clearAround(x, y + 1);
            clearAround(x - 1, y);
            clearAround(x + 1, y);
        }
    }
}

function bombAround(x, y) {
    var nb = 0;

    x = parseInt(x);
    y = parseInt(y);

    nb += isBomb(x - 1, y - 1);
    nb += isBomb(x - 1, y + 1);
    nb += isBomb(x + 1, y - 1);
    nb += isBomb(x + 1, y + 1);

    nb += isBomb(x, y - 1);
    nb += isBomb(x, y + 1);
    nb += isBomb(x - 1, y);
    nb += isBomb(x + 1, y);

    return nb;
}

function isBomb(x, y) {
    if (x >= 0 && y >= 0 && x < gridMax && y < gridMax && board[x][y] == "bomb") {
        return 1;
    }
    return 0;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}