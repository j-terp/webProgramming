
var boardArray = [];
var checkArray = [];
var remaining = 0;
var placingFlag = false;
var playing = false;
var numMines;
var flagged = 0;

function createBoard() {
  playing = true;
  flagged = 0;
  
  // Creating board pattern
  var size = parseInt(document.getElementById("boardSizeInput").value);
  numMines = parseInt(document.getElementById("numMinesInput").value);
  boardArray = fillMines(size, numMines);
  checkArray.length = size*size;
  
  // Counting remaing boxes
  remaining = checkArray.length - numMines;
  document.getElementById("remaining").getElementsByTagName("span")[0].textContent = remaining;
  document.getElementById("remaining").style.display = "block";
  document.getElementById("result").innerHTML = "<span>0</span> of <span>" + numMines.toString() + "</span> mines are flagged";
  
  // Creating board
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
  // Displaying Game
  document.getElementsByClassName("StartText")[0].style.display = "none";
  document.getElementsByClassName("GameText")[0].style.display = "block";
  document.getElementsByClassName("Game")[0].style.display = "block";
}

function fillMines(size, numMines) {
  var mineArray = [];
  mineArray.length = size*size;
  
  // Adds mines
  for (var i = 0; i < numMines; i++) {
    mineArray[i] = true;
  }
  
  // Adds empty boxes
  for (var i = numMines; i < size*size; i++) {
    mineArray[i] = false;
  }
  
  // Shuffles board
  mineArray = shuffle(mineArray);
  return mineArray;
}

function shuffle(array) {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    
    // Swaps two elements
    [array[currentIndex], array[randomIndex]] = [
     array[randomIndex], array[currentIndex]];
  }
  return array;
}

function quit() {
  if (
    document.getElementById("result").textContent == "You lost" || window.confirm("Do you really want to quit?")) {
    playing = false;
    if (placingFlag) {
      placingFlag = false;
      document.getElementById("ModeP").innerHTML = "Walk mode <button onclick=\"changeMode()\">Change</button>";
    }
    
    // Display Start Menu
    document.getElementsByClassName("StartText")[0].style.display = "block";
    document.getElementsByClassName("GameText")[0].style.display = "none";
    document.getElementsByClassName("Game")[0].style.display = "none";
    
    // Removes board
    var table = document.getElementsByTagName("tbody")[0];
    table.remove();
  }
}

function restart(params) {
  if (document.getElementById("result").textContent == "You lost" || window.confirm("Do you really want to restart?")) {
    if (placingFlag) {
    placingFlag = false;
    document.getElementById("ModeP").innerHTML = "Walk mode <button onclick=\"changeMode()\">Change</button>";
  }

  // Removes board
  var table = document.getElementsByTagName("tbody")[0];
  table.remove();
  
  createBoard();
  }
  
  
}

function checkForMine(element, sizeStr) {
  var id = element.id;
  var size = parseInt(sizeStr);
  var result = boardArray[id];
  
  // Flagmode
  if (placingFlag) {
      if (element.textContent != "P") {
        if (flagged < numMines && !checkArray[id]) {
          element.textContent = "P";
          element.style.background = "yellow";
          element.classList.add("flagged");
          document.getElementById("result").getElementsByTagName("span")[0].textContent = ++flagged;
          if (flagged == numMines) {
            document.getElementById("remaining").innerHTML += " <button onclick=\"checkFlagged()\">Check rest</button>";
          }
        }
        
      }
      else {
        element.textContent = "";
        element.style.background = "rgb(239, 239, 239)";
        element.classList.remove("flagged");
        if (flagged == numMines) {
          document.getElementById("remaining").innerHTML = "<span>" + remaining.toString() + "</span> boxes left to clear.";
        }
        document.getElementById("result").getElementsByTagName("span")[0].textContent = --flagged;
      }
  }
  // Mine Check
  else {
    if (element.textContent != "P") {
      if (result) {
        score(false);
        element.style.background = "black";
        score(false);
        gameEnd();
      } else {
        var numBombNear = 0;//checkNearBombs(element);
        checkNear(element, size);
      }
    }
  }
  
}

function checkNear(element, size) {
  var coordX = parseInt(element.id) % size;
  var coordY = Math.floor(parseInt(element.id) / size);
  var index = coordY * size + coordX;
  
  //  Counts nearby bombs
  if (!checkArray[index]) {
    checkArray[index] = true;
    document.getElementById("remaining").getElementsByTagName("span")[0].textContent = --remaining;
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
    // Check for nearby squares
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
    
    // Colour assignment
    if (numBomb == 0) {
      element.textContent = "";
      element.style.background = "lightgreen";
    } else {
      element.textContent = numBomb.toString();
      element.style.background = "red";
    } 
  }
  
  // Win check
  if (remaining == 0) {
    score(true);
    gameEnd();
  }
}

function changeMode () {
  var buttons =  document.getElementById("mineTable").getElementsByTagName("button");
  var len = buttons.length;
  
  // Changes cursor for board
  for(var i = 0; i < len; i++) {
    buttons[i].classList.toggle("flagMode")
  }
  
  // Changes mode
  if (placingFlag) {
    placingFlag = false;
    document.getElementById("ModeP").innerHTML = "Walk mode <button onclick=\"changeMode()\">Change</button>";
  } else {
    placingFlag = true;
    document.getElementById("ModeP").innerHTML = "Flag mode <button onclick=\"changeMode()\">Change</button>";
  }
}

function gameEnd () {
  var size = boardArray.length;
  // Disables board functions
  for (var i = 0; i < size; i++) {
    for (var j = 0; j < size; j++) {
      var index = i * size + j;
      var button = document.getElementById(index.toString());
      button.onclick = "";
    }
  }
}

function suggestMines (element) {
  var numMineInput = document.getElementById("numMinesInput");
  numMineInput.value = Math.floor(element.value * element.value / 6);
}

function checkFlagged() {
  var flagged = document.getElementById("mineTable").getElementsByClassName("flagged");
  var len = flagged.length;
  for(var i = 0; i < len; i++) {
    if(boardArray[parseInt(flagged[i].id)] == false) {
      break;
    }
  }
  if (i == len) {
    score(true);
  }
}

function score(state) {
  if (state == true) {
    document.getElementById("remaining").style.display = "none";
    document.getElementById("result").textContent = "You won";
  }
  else {
    document.getElementById("result").textContent = "You lost";
  }
}

/* Event keys */
document.addEventListener('keydown', (event) => {
  var code = event.code;
  if (playing) {
    if (code === 'KeyF') {
      changeMode();
      return;
    }
    if (code === 'KeyQ') {
      quit();
    }
    if (code === 'KeyR') {
      restart();
    }
  }
  else {
    if (code === 'KeyS') {
      createBoard();
    }
  }
}, false);
