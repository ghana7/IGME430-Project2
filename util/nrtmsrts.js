/* eslint-disable linebreak-style */

const turnOrder = {
  r: 'y',
  y: 'g',
  g: 'b',
  b: 'r',
};
class NRTGame {
  constructor() {
    this.game = [
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
      ['n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.', 'n.'],
    ];
    this.currentPlayer = 'r';
    this.currentTurn = 0;
    this.players = {
      r: null,
      y: null,
      g: null,
      b: null,
    };
    this.deadPlayers = [];
    this.isGameOver = false;
    this.winner = '';
  }

  getCurrentPlayer() {
    return this.players[this.currentPlayer];
  }

  changeTurn() {
    if (this.deadPlayers.length === 3) {
      this.isGameOver = true;
      ['r', 'g', 'y', 'b'].forEach((e) => {
        if (this.deadPlayers.includes(e)) {
          this.winner = this.players[e];
        }
      });
      return;
    }
    this.currentPlayer = turnOrder[this.currentPlayer];
    if (this.currentPlayer === 'r') {
      this.currentTurn++;
    }
    if (this.deadPlayers.includes(this.currentPlayer)) {
      this.changeTurn();
    }
  }

  claimTile(player, x, y) {
    if (x >= 0 && x <= 10 && y >= 0 && y <= 10) {
      if (this.game[y][x] === 'n.') {
        this.game[y][x] = `${player}.`;
      }
    }
  }

  claimAround(player, x, y) {
    this.claimTile(player, x - 1, y - 1);
    this.claimTile(player, x - 1, y);
    this.claimTile(player, x - 1, y + 1);

    this.claimTile(player, x, y - 1);
    this.claimTile(player, x, y + 1);

    this.claimTile(player, x + 1, y - 1);
    this.claimTile(player, x + 1, y);
    this.claimTile(player, x + 1, y + 1);
  }

  isClaimedByPlayer(player, x, y) {
    if (x >= 0 && x <= 10 && y >= 0 && y <= 10) {
      return this.game[y][x].charAt(0) === player;
    }
    return false;
  }

  canPlaceFlag(player, x, y) {
    if (this.game[y][x] !== 'n.' && this.game[y][x] !== `${player}.`) {
      return false;
    }

    if (this.isClaimedByPlayer(player, x - 1, y - 1)) return true;
    if (this.isClaimedByPlayer(player, x - 1, y)) return true;
    if (this.isClaimedByPlayer(player, x - 1, y + 1)) return true;

    if (this.isClaimedByPlayer(player, x, y - 1)) return true;
    if (this.isClaimedByPlayer(player, x, y + 1)) return true;

    if (this.isClaimedByPlayer(player, x + 1, y - 1)) return true;
    if (this.isClaimedByPlayer(player, x + 1, y)) return true;
    if (this.isClaimedByPlayer(player, x + 1, y + 1)) return true;

    return false;
  }

  // eslint-disable-next-line class-methods-use-this
  isInGrid(x, y) {
    return x >= 0 && x <= 10 && y >= 0 && y <= 10;
  }

  simBullet(player, x, y) {
    const tilePlayer = this.game[y][x].charAt(0);
    const tileType = this.game[y][x].charAt(1);
    if (tileType === 'f' || tileType === '.' || tileType === 'R') {
      return false;
    }

    if (tileType === 'w') {
      this.game[y][x] = `${tilePlayer}W`;
      return true;
    }

    if (tileType === 'W' || tileType === 't' || tileType === 'b') {
      if (tileType === 'b') {
        this.deadPlayers.push(tilePlayer);
      }
      this.game[y][x] = `${tilePlayer}R`;
      return true;
    }

    return false;
  }

  // a moveStr is of the format "pxymd", where
  //  p is a player: [r, y, g, b]
  //  x is an x position from 0 to a (a representing 10)
  //  y is a  y position from 0 to a (a representing 10)
  //  m is a move code
  //     b - place base
  //     w - place wall
  //     t - place turret
  //     s - shoot turret
  //     f - place flag
  // d is an optional direction for placing turrets: [n, ne, e, se, s, sw, w, nw]
  makeMove(moveStr, username) {
    if (moveStr.length < 4) {
      return false;
    }
    if (moveStr === 'join') {
      if (this.players.r === null) {
        this.players.r = username;
        return true;
      }
      if (this.players.y === null) {
        this.players.y = username;
        return true;
      }
      if (this.players.g === null) {
        this.players.g = username;
        return true;
      }
      if (this.players.b === null) {
        this.players.b = username;
        this.currentTurn = 1;
        return true;
      }
      return false;
    }

    if (username !== this.getCurrentPlayer()) {
      return false;
    }
    if (this.currentTurn === 0) {
      return false;
    }
    const player = moveStr.charAt(0);
    const x = parseInt(moveStr.charAt(1), 16);
    const y = parseInt(moveStr.charAt(2), 16);
    const moveCode = moveStr.charAt(3);
    let direction;
    if (moveStr.length === 4) {
      direction = 'n';
    } else {
      direction = moveStr.substring(4);
    }
    switch (moveCode) {
      case 'b':
        if (this.currentTurn !== 1) {
          return false;
        }
        if (this.game[y][x] === 'n.') {
          this.game[y][x] = `${player}b`;
          this.claimAround(player, x, y);
          this.changeTurn();
          return true;
        }
        return false;
      case 'w':
        if (this.game[y][x] !== `${player}.`) {
          return false;
        }
        this.game[y][x] = `${player}w`;
        this.claimAround(player, x, y);
        this.changeTurn();
        return true;
      case 't':
        if (this.game[y][x] !== `${player}.`) {
          return false;
        }
        this.game[y][x] = `${player}t${direction}`;
        this.claimAround(player, x, y);
        this.changeTurn();
        return true;
      case 's': {
        if (this.game[y][x].substring(0, 2) !== `${player}t`) {
          return false;
        }
        const bulletDirection = this.game[y][x].substring(2);
        let moveFunc;

        // create a function to "iterate" the bullet, moving it in the proper direction
        switch (bulletDirection) {
          case 'n':
            moveFunc = (pos) => ({ xPos: pos.xPos, yPos: pos.yPos - 1 });
            break;
          case 'ne':
            moveFunc = (pos) => ({ xPos: pos.xPos + 1, yPos: pos.yPos - 1 });
            break;
          case 'e':
            moveFunc = (pos) => ({ xPos: pos.xPos + 1, yPos: pos.yPos });
            break;
          case 'se':
            moveFunc = (pos) => ({ xPos: pos.xPos + 1, yPos: pos.yPos + 1 });
            break;
          case 's':
            moveFunc = (pos) => ({ xPos: pos.xPos, yPos: pos.yPos + 1 });
            break;
          case 'sw':
            moveFunc = (pos) => ({ xPos: pos.xPos - 1, yPos: pos.yPos + 1 });
            break;
          case 'w':
            moveFunc = (pos) => ({ xPos: pos.xPos - 1, yPos: pos.yPos });
            break;
          case 'nw':
            moveFunc = (pos) => ({ xPos: pos.xPos - 1, yPos: pos.yPos - 1 });
            break;
          default:
            moveFunc = (pos) => ({ xPos: pos.xPos - 1, yPos: pos.yPos - 1 });
            break;
        }

        let pos = { xPos: x, yPos: y };

        pos = moveFunc(pos);
        while (this.isInGrid(pos.xPos, pos.yPos)) {
          if (this.simBullet(player, pos.xPos, pos.yPos)) {
            this.changeTurn();
            return true;
          }
          pos = moveFunc(pos);
        }
        this.changeTurn();
        return true; }
      case 'f':
        if (!this.canPlaceFlag(player, x, y)) {
          return false;
        }
        this.game[y][x] = `${player}f`;
        this.claimAround(player, x, y);
        this.changeTurn();
        return true;
      default:
        return false;
    }
  }
}

module.exports.NRTGame = NRTGame;
