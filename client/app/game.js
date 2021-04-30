const backgroundColors = {
    "r": "#E83151",
    "g": "#84DD63",
    "b": "#5C80BC",
    "y": "#F6AE2D",
    "n": "#FFFCFF"
}
const GridTile = (props) => {
    return (
        <div className="gridTile" style={{
            backgroundColor: backgroundColors[props.tileKey.charAt(0)]
        }}>
            {props.tileKey.charAt(1)}
        </div>
    )
}

const GameGrid = (props) => {
    let rows = props.grid.map( (item, i) => {
        let content = item.map((element, j) => { return (
            <td key={j}> <GridTile tileKey={element}></GridTile> </td>
        ) });
        return (
            <tr key={i}> {content} </tr>
        );
    });
    return (
        <table className="gameTable">
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}
const setup = function(csrf) {
    ReactDOM.render(
        <GameGrid grid={
            [
                ["r.", "r.", "r.", "n.", "n.", "n.", "n.", "n.", "b.", "b.", "b."],
                ["r.", "rb", "r.", "n.", "n.", "n.", "n.", "n.", "b.", "bb", "b."],
                ["r.", "r.", "r.", "n.", "n.", "n.", "n.", "n.", "b.", "b.", "b."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["g.", "g.", "g.", "n.", "n.", "n.", "n.", "n.", "y.", "y.", "y."],
                ["g.", "gb", "g.", "n.", "n.", "n.", "n.", "n.", "y.", "yb", "y."],
                ["g.", "g.", "g.", "n.", "n.", "n.", "n.", "n.", "y.", "y.", "y."],
            ]
        } />, document.querySelector("#game")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

const defaultUsername = `Mysterio ${Math.floor(Math.random() * 10000) % 10000}`;
let socket; 
function setupUI(){
    btnSend.onclick = sendButtonClicked;
    socket.on("message", onMessage);
    socket.on("messageAll", onMessageAll);
}

function sendButtonClicked(){
    let username = txtUsername.value.trim();
    username = username.length ? username : defaultUsername
    txtUsername.value = username;
    
    let msg = txtMsg.value.trim();
    msg = msg.length ? msg : "Hi!";
    txtMsg.value = "";
    
    const obj = { username, msg };
    
    console.log("Sending:  ", obj);
    socket.emit("message", obj);
    showMessage(obj,"sentMessage");
}

function onMessage(obj){
    console.log("Received:", obj);
    showMessage(obj,"receivedMessage");
}

function onMessageAll(obj){
    console.log("Received: ", obj);
    showLog(obj);
}


function showMessage(obj,className){
    let chatText = `${obj.username} : ${obj.msg}`;
    if (obj.date){
        chatText += ` - <small><i>${obj.date}</i></small>`;
    }
    const newP = document.createElement("p");
    newP.innerHTML = chatText;
    newP.className = className;
    //lblChat.insertBefore(newP, lblChat.childNodes[0]);
    lblChat.appendChild(newP);
    scrollChatToBottom();
}

function showLog(obj){
    let logText = `${obj.msg} - <small><i>${obj.date}</i></small>`;
    const newP = document.createElement("p");
    newP.innerHTML = logText;
    //lblStatus.appendChild(newP);
    lblStatus.insertBefore(newP, lblStatus.childNodes[0]);
}

function scrollChatToBottom(){
        lblChat.scrollTop = lblChat.scrollHeight;
}  

$(document).ready(function() {
    getToken();
    socket = io();
    setupUI();
});