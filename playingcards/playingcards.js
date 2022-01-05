var cards;

function createDeck() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 13; j++) {
      cards[i * 13 + j] = {"suit": i, "value": j, "isJoker": 0};
    }
  }
  for (let numJoker = 0; numJoker < 4; numJoker++) {
    cards[52 + numJoker] = {"suit": -1, "value": -1, "isJoker": 1};
  }
  
}
