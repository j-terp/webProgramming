
var boardArray = [];
var checkArray = [];

function createBoard() {
  var size = parseInt(document.getElementById("boardSizeInput").value);
  var numMines = parseInt(document.getElementById("numMinesInput").value);
  boardArray = fillMines(size, numMines);
  checkArray.length = size*size;
  var table = document.getElementById("mineTable");
  for (var i = 0; i < size; i++) {
    var tr = table.insertRow(i);

    for (var j = 0; j < size; j++) {
      var td = document.createElement('td');
      td = tr.insertCell(j);

      var button = document.createElement('button');5

        // set input attributes
        var index = i * size + j;
        var bomb = boardArray[index];
        checkArray[index] = false;
        button.textContent = (bomb ? "" : "");

        // add button's 'onclick' event.
        button.setAttribute('onclick', 'checkForMine(this, ' + size.toString() + ')');
        button.setAttribute('id', index.toString());

        td.appendChild(button);
    }
  }
}

function fillMines(size, numMines) {
  var mineArray = [];
  mineArray.length = size*size;
  for (var i = 0; i < numMines; i++) {
    mineArray[i] = true;
  }
  for (var i = numMines; i < size*size; i++) {
    mineArray[i] = false;
  }
  mineArray = shuffle(mineArray);
  return mineArray;
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  while (currentIndex != 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

function random(min, max) { 
  return Math.random() * (max - min) + min;
}

function restart() {
  alert("You clicked me");
}

function checkForMine(element, sizeStr) {
  var id = element.id;
  var size = parseInt(sizeStr);
  var result = boardArray[id];
  if (result) {
    //element.textContent = "X";
    element.style.background = "black";
    //alert("You lose!");
  } else {
    var numBombNear = 0;//checkNearBombs(element);
    checkNear(element, size);
  }

}

function checkNear(element, size) {
  
  var coordX = parseInt(element.id) % size;
  var coordY = Math.floor(parseInt(element.id) / size);
  var index = coordY * size + coordX;
  if (!checkArray[index]) {
    checkArray[index] = true;
    var numBomb = 0;
    for (var x = coordX - 1; x <= coordX + 1; x++) {
      for (var y = coordY - 1; y <= coordY + 1; y++) {
        if (!(x == coordX && y == coordY)) {
          if (!(x < 0 || x >= size || y < 0 || y >= size)) {
            index = y * size + x;
            var foundBomb = boardArray[index];
            if (foundBomb) {
              numBomb++;
            }
          }
        }
      }
    }
    if (numBomb == 0) {
      for (var x = coordX - 1; x <= coordX + 1; x++) {
        for (var y = coordY - 1; y <= coordY + 1; y++) {
          if (!(x == coordX && y == coordY)) {
            if (!(x < 0 || x >= size || y < 0 || y >= size)) {
              index = y * size + x;
              var newElement = document.getElementById(index.toString())
              checkNear(newElement, size);
            }
          }
        }
      }
    }
    if (numBomb == 0) {
      element.textContent = "";
      element.style.background = "lightgreen";
    } else {
      element.textContent = numBomb.toString();
      element.style.background = "red";
    }
    
  }
}
