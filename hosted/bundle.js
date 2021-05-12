"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var backgroundColors = {
  "r": "#E83151",
  "g": "#84DD63",
  "b": "#5C80BC",
  "y": "#F6AE2D",
  "n": "#FFFCFF"
};

var GridTile = function GridTile(props) {
  var imgName = props.tileKey.substring(1);

  if (imgName === 'W') {
    imgName = 'WW';
  }

  if (imgName === '.') {
    imgName = 'empty';
  }

  return /*#__PURE__*/React.createElement("div", {
    className: "gridTile",
    style: {
      backgroundColor: backgroundColors[props.tileKey.charAt(0)],
      borderWidth: props.selectedX == props.x && props.selectedY == props.y ? 3 : 1
    },
    onClick: function onClick() {
      console.log("".concat(props.x, ", ").concat(props.y, " clicked"));
      props.setClickedTile(props.x, props.y);
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "/assets/img/".concat(imgName, ".png")
  }));
};

var GameGrid = function GameGrid(props) {
  var rows = props.grid.map(function (item, i) {
    var content = item.map(function (element, j) {
      return /*#__PURE__*/React.createElement("td", {
        key: j
      }, " ", /*#__PURE__*/React.createElement(GridTile, {
        tileKey: element,
        selectedX: props.selectedX,
        selectedY: props.selectedY,
        x: j,
        y: i,
        setClickedTile: props.setClickedTile
      }), " ");
    });
    return /*#__PURE__*/React.createElement("tr", {
      key: i
    }, " ", content, " ");
  });
  return /*#__PURE__*/React.createElement("table", {
    className: "gameTable"
  }, /*#__PURE__*/React.createElement("tbody", null, rows));
};

var buttonLabels = {
  'b': 'Place Base (First Turn Only)',
  'w': 'Place Wall',
  'tn': 'Place Turret North',
  'tne': 'Place Turret Northeast',
  'te': 'Place Turret East',
  'tse': 'Place Turret Southeast',
  'ts': 'Place Turret South',
  'tsw': 'Place Turret Southwest',
  'tw': 'Place Turret West',
  'tnw': 'Place Turret Northwest',
  's': 'Shoot Turret',
  'f': 'Place Flag (Must be within 1 tile of your territory)'
};

var GameButton = function GameButton(props) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: function onClick() {
      return updateMove(props.currentPlayer, props.currentX, props.currentY, props.btnId);
    }
  }, buttonLabels[props.btnId]);
};

var GameControls = function GameControls(props) {
  var buttons;

  switch (props.controlType) {
    case "empty":
      buttons = /*#__PURE__*/React.createElement("li", null, "No valid moves on this tile");
      break;

    case "placeBase":
      buttons = ['b'].map(function (element, j) {
        return /*#__PURE__*/React.createElement("li", {
          key: j
        }, " ", /*#__PURE__*/React.createElement(GameButton, {
          btnId: element,
          currentPlayer: props.currentPlayer,
          currentX: props.currentX,
          currentY: props.currentY
        }));
      });
      break;

    case "placeFlag":
      buttons = ['f'].map(function (element, j) {
        return /*#__PURE__*/React.createElement("li", {
          key: j
        }, " ", /*#__PURE__*/React.createElement(GameButton, {
          btnId: element,
          currentPlayer: props.currentPlayer,
          currentX: props.currentX,
          currentY: props.currentY
        }));
      });
      break;

    case "placeGeneric":
      buttons = ['w', 'tn', 'tne', 'te', 'tse', 'ts', 'tsw', 'tw', 'tnw', 'f'].map(function (element, j) {
        return /*#__PURE__*/React.createElement("li", {
          key: j
        }, " ", /*#__PURE__*/React.createElement(GameButton, {
          btnId: element,
          currentPlayer: props.currentPlayer,
          currentX: props.currentX,
          currentY: props.currentY
        }));
      });
      break;

    case "shoot":
      buttons = ['s'].map(function (element, j) {
        return /*#__PURE__*/React.createElement("li", {
          key: j
        }, " ", /*#__PURE__*/React.createElement(GameButton, {
          btnId: element,
          currentPlayer: props.currentPlayer,
          currentX: props.currentX,
          currentY: props.currentY
        }));
      });
      break;

    default:
      buttons = /*#__PURE__*/React.createElement("li", null, "No valid moves on this tile");
      break;
  }

  console.log(buttons);
  return /*#__PURE__*/React.createElement("div", {
    id: "gameControls"
  }, /*#__PURE__*/React.createElement("ul", null, buttons));
};

var GameView = /*#__PURE__*/function (_React$Component) {
  _inherits(GameView, _React$Component);

  var _super = _createSuper(GameView);

  function GameView(props) {
    var _this;

    _classCallCheck(this, GameView);

    _this = _super.call(this, props);
    _this.state = {
      currentX: -1,
      currentY: -1,
      controlType: "empty"
    };
    _this.setClickedTile = _this.setClickedTile.bind(_assertThisInitialized(_this));
    controlReset = _this.resetControls.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(GameView, [{
    key: "setClickedTile",
    value: function setClickedTile(x, y) {
      console.log(this.props.grid[y][x]);
      var ct = "empty";

      if (this.props.grid[y][x] === 'n.' && this.props.currentTurn == 1) {
        ct = "placeBase";
      } else if (this.props.grid[y][x] === 'n.') {
        ct = "placeFlag";
      } else if (this.props.grid[y][x] === "".concat(this.props.currentPlayer, ".")) {
        ct = "placeGeneric";
      } else if (this.props.grid[y][x].substring(0, 2) === "".concat(this.props.currentPlayer, "t")) {
        ct = "shoot";
      }

      this.setState(function (state) {
        return {
          selectedX: x,
          selectedY: y,
          controlType: ct
        };
      });
    }
  }, {
    key: "resetControls",
    value: function resetControls() {
      this.setState(function (state) {
        return {
          selectedX: -1,
          selectedY: -1,
          controlType: "empty"
        };
      });
    }
  }, {
    key: "render",
    value: function render() {
      var headerText = /*#__PURE__*/React.createElement("h2", {
        id: "gameHeader",
        style: {
          color: backgroundColors[this.props.currentPlayer]
        }
      }, this.props.currentUsername, "'s Turn!");

      if (this.props.gameOver) {
        headerText = /*#__PURE__*/React.createElement("div", {
          id: "gameHeader"
        }, /*#__PURE__*/React.createElement("h2", null, "Game Over! Winner: ", this.props.winner), /*#__PURE__*/React.createElement("button", {
          id: "resetButton",
          onClick: resetGame
        }, "Restart"));
      }

      return /*#__PURE__*/React.createElement("div", {
        id: "gameView"
      }, headerText, /*#__PURE__*/React.createElement(GameGrid, {
        grid: this.props.grid,
        setClickedTile: this.setClickedTile,
        selectedX: this.state.selectedX,
        selectedY: this.state.selectedY
      }), /*#__PURE__*/React.createElement("div", {
        id: "playerBox"
      }, /*#__PURE__*/React.createElement("h5", null, "Players:"), /*#__PURE__*/React.createElement("ul", {
        id: "playerList"
      }, /*#__PURE__*/React.createElement("li", {
        id: "redPlayer"
      }, this.props.players.r || "no player"), /*#__PURE__*/React.createElement("li", {
        id: "yellowPlayer"
      }, this.props.players.y || "no player"), /*#__PURE__*/React.createElement("li", {
        id: "greenPlayer"
      }, this.props.players.g || "no player"), /*#__PURE__*/React.createElement("li", {
        id: "bluePlayer"
      }, this.props.players.b || "no player"))), /*#__PURE__*/React.createElement("div", {
        id: "controlBox"
      }, /*#__PURE__*/React.createElement("h5", null, "Controls:"), /*#__PURE__*/React.createElement(GameControls, {
        controlType: this.state.controlType,
        currentPlayer: this.props.currentPlayer,
        currentX: this.state.selectedX,
        currentY: this.state.selectedY
      })));
    }
  }]);

  return GameView;
}(React.Component);

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(GameView, {
    grid: [["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."]],
    players: {
      r: null,
      y: null,
      g: null,
      b: null
    },
    currentPlayer: 'r',
    currentUsername: "Nobody",
    currentTurn: 0,
    gameOver: false,
    winner: ''
  }), document.querySelector("#game"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

var defaultUsername = "Mysterio ".concat(Math.floor(Math.random() * 10000) % 10000);
var socket;
var controlReset;

function setupUI() {
  btnSend.onclick = sendButtonClicked;
  btnJoin.onclick = joinButtonClicked;
  socket.on("message", onMessage);
  socket.on("messageAll", onMessageAll);
  socket.on("gameUpdate", onGameUpdate);
}

var currentMove = "";

var updateMove = function updateMove(player, x, y, moveCode) {
  currentMove = "".concat(player).concat(x == 10 ? 'a' : x).concat(y == 10 ? 'a' : y).concat(moveCode);
  txtMsg.value = currentMove.trim();
  console.log("Current move: '".concat(currentMove, "'"));
};

function sendButtonClicked() {
  var username = document.querySelector("#username").innerHTML.trim();
  username = username.length ? username : defaultUsername;
  var msg = txtMsg.value.trim();
  msg = msg.length ? msg : "Hi!";
  txtMsg.value = "";
  var obj = {
    username: username,
    msg: msg
  };
  console.log("Sending:  ", obj);
  socket.emit("message", obj);
  showMessage(obj, "sentMessage");
}

function joinButtonClicked() {
  var username = document.querySelector("#username").innerHTML.trim();
  username = username.length ? username : defaultUsername;
  var obj = {
    username: username,
    msg: "join"
  };
  console.log("Sending:  ", obj);
  socket.emit("message", obj);
}

function resetGame() {
  var username = document.querySelector("#username").innerHTML.trim();
  username = username.length ? username : defaultUsername;
  var obj = {
    username: username,
    msg: "reset"
  };
  console.log("Sending:  ", obj);
  socket.emit("message", obj);
}

function onMessage(obj) {
  console.log("Received:", obj);
}

function onMessageAll(obj) {
  console.log("Received: ", obj);
}

function onGameUpdate(obj) {
  console.log("Received gameupdate: ", obj);
  ReactDOM.render( /*#__PURE__*/React.createElement(GameView, {
    grid: obj.newGame.game,
    players: obj.newGame.players,
    currentPlayer: obj.newGame.currentPlayer,
    currentUsername: obj.newGame.players[obj.newGame.currentPlayer] || "Nobody",
    currentTurn: obj.newGame.currentTurn,
    gameOver: obj.newGame.isGameOver,
    winner: obj.newGame.winner
  }), document.querySelector("#game"));

  if (obj.newGame.currentTurn > 0) {
    document.querySelector("#btnJoin").style.display = "none";
  } else {
    document.querySelector("#btnJoin").style.display = "inline-block";
  }

  controlReset();
}

$(document).ready(function () {
  getToken();
  socket = io();
  setupUI();
});
"use strict";

var handleError = function handleError(message) {
  $('#errorMessage').text(message);
  $('#message').animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $('#message').animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: 'json',
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
