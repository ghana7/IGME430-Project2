const { NRTGame } = require('./nrtmsrts.js');

const printGame = (game) => {
  console.log('=======================================================');
  for (let y = 0; y < 11; y++) {
    let s = '';
    for (let x = 0; x < 11; x++) {
      let tile = game.game[y][x];
      if (tile.length === 2) {
        tile += '__';
      } else if (tile.length === 3) {
        tile += '_';
      }
      s += tile;
      s += ' ';
    }
    console.log(s);
  }
  console.log('=======================================================');
  console.log();
};

const theGame = new NRTGame();

theGame.makeMove('r11b');
theGame.makeMove('y19b');
theGame.makeMove('g99b');
theGame.makeMove('b91b');

theGame.makeMove('r21te');

theGame.makeMove('b81w');
printGame(theGame);

theGame.makeMove('r21s');
printGame(theGame);

theGame.makeMove('r21s');
printGame(theGame);
