var count = 0;
var result = false;

function setPiece (id) {
  var piece = document.getElementById(id);
  var button = piece.getElementsByTagName("button")[0];
  var p = piece.getElementsByTagName("p")[0];
  if (count < 9) {
    var player = document.getElementById("player").getElementsByTagName("span")[0].textContent;
    p.textContent = player;
    document.getElementById("player").getElementsByTagName("span")[0].textContent = (player == "X" ? "O" : "X");
    button.style.display = "none";
    p.style.display = "block";
    
    count++;
    checkVictory(p.textContent);
  }
  if (count == 9) {
    stopGame();
  }
}


function checkVictory (player) {
  var table = document.getElementsByTagName("table")[0].getElementsByTagName("td");

  //Check Horizontalt
  for (var i = 0; i < 3 && !result; i++) {
    for (var j = 0; j < 3 && !result; j++) {
      var pText = table[3*i+j].getElementsByTagName("p")[0].textContent;
      if (player != pText) {
        break;
      }
      if (j == 2) {
        result = true;
      }
    }
  }

  //Check Vertical
  for (var i = 0; i < 3 && !result; i++) {
    for (var j = 0; j < 3 && !result; j++) {
      var pText = table[i+3*j].getElementsByTagName("p")[0].textContent;
      if (player != pText) {
        break;
      }
      if (j == 2) {
        result = true;
      }
    }
  }

  //Check Diagonal
  for (var i = 0; i < 2; i++) {
    if (player == table[2*i].getElementsByTagName("p")[0].textContent && 
        player == table[4].getElementsByTagName("p")[0].textContent && 
        player == table[8-2*i].getElementsByTagName("p")[0].textContent) {
      result = true;
    }
  }

  if (result == true) {
    document.getElementById("result").textContent += player;
    stopGame();
  }

}

function stopGame () {
  if (result == false) {
    document.getElementById("result").textContent = "Everyone is a loser.";
  }
  else {
    var table = document.getElementsByTagName("table")[0];
    for (var i = 0; i < 9; i++) {
      var button = table.getElementsByTagName("button")[i];
      button.style.display = "none";
    }
  }
}

function reset () {
  document.getElementById("result").textContent = "Winner is: ";
  var table = document.getElementsByTagName("table")[0];
  for (var i = 0; i < 9; i++) {
    var button = table.getElementsByTagName("button")[i];
    var p = table.getElementsByTagName("p")[i];
    button.style.display = "block";
    p.textContent = "";
    result = false;
    count = 0;
  }
}