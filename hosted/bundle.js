"use strict";

var backgroundColors = {
  "r": "#E83151",
  "g": "#84DD63",
  "b": "#5C80BC",
  "y": "#F6AE2D",
  "n": "#FFFCFF"
};

var GridTile = function GridTile(props) {
  return /*#__PURE__*/React.createElement("div", {
    className: "gridTile",
    style: {
      backgroundColor: backgroundColors[props.tileKey.charAt(0)]
    }
  }, props.tileKey.charAt(1));
};

var GameGrid = function GameGrid(props) {
  var rows = props.grid.map(function (item, i) {
    var content = item.map(function (element, j) {
      return /*#__PURE__*/React.createElement("td", {
        key: j
      }, " ", /*#__PURE__*/React.createElement(GridTile, {
        tileKey: element
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

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(GameGrid, {
    grid: [["r.", "r.", "r.", "n.", "n.", "n.", "n.", "n.", "b.", "b.", "b."], ["r.", "rb", "r.", "n.", "n.", "n.", "n.", "n.", "b.", "bb", "b."], ["r.", "r.", "r.", "n.", "n.", "n.", "n.", "n.", "b.", "b.", "b."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."], ["g.", "g.", "g.", "n.", "n.", "n.", "n.", "n.", "y.", "y.", "y."], ["g.", "gb", "g.", "n.", "n.", "n.", "n.", "n.", "y.", "yb", "y."], ["g.", "g.", "g.", "n.", "n.", "n.", "n.", "n.", "y.", "y.", "y."]]
  }), document.querySelector("#game"));
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

var defaultUsername = "Mysterio ".concat(Math.floor(Math.random() * 10000) % 10000);
var socket;

function setupUI() {
  btnSend.onclick = sendButtonClicked;
  socket.on("message", onMessage);
  socket.on("messageAll", onMessageAll);
}

function sendButtonClicked() {
  var username = txtUsername.value.trim();
  username = username.length ? username : defaultUsername;
  txtUsername.value = username;
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

function onMessage(obj) {
  console.log("Received:", obj);
  showMessage(obj, "receivedMessage");
}

function onMessageAll(obj) {
  console.log("Received: ", obj);
  showLog(obj);
}

function showMessage(obj, className) {
  var chatText = "".concat(obj.username, " : ").concat(obj.msg);

  if (obj.date) {
    chatText += " - <small><i>".concat(obj.date, "</i></small>");
  }

  var newP = document.createElement("p");
  newP.innerHTML = chatText;
  newP.className = className; //lblChat.insertBefore(newP, lblChat.childNodes[0]);

  lblChat.appendChild(newP);
  scrollChatToBottom();
}

function showLog(obj) {
  var logText = "".concat(obj.msg, " - <small><i>").concat(obj.date, "</i></small>");
  var newP = document.createElement("p");
  newP.innerHTML = logText; //lblStatus.appendChild(newP);

  lblStatus.insertBefore(newP, lblStatus.childNodes[0]);
}

function scrollChatToBottom() {
  lblChat.scrollTop = lblChat.scrollHeight;
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
