const backgroundColors = {
    "r": "#E83151",
    "g": "#84DD63",
    "b": "#5C80BC",
    "y": "#F6AE2D",
    "n": "#FFFCFF"
}
const GridTile = (props) => {
    let imgName = props.tileKey.substring(1);
    if(imgName === 'W') {
        imgName = 'WW'
    }
    if(imgName === '.') {
        imgName ='empty'
    }
    return (
        <div className="gridTile" style={{
            backgroundColor: backgroundColors[props.tileKey.charAt(0)],
            borderWidth: (props.selectedX == props.x && props.selectedY == props.y) ? 3 : 1
        }}
        onClick={() => {
            console.log(`${props.x}, ${props.y} clicked`);
            props.setClickedTile(props.x, props.y);
        }}>
            <img src={`/assets/img/${imgName}.png`}></img>
        </div>
    )
}

const GameGrid = (props) => {
    let rows = props.grid.map( (item, i) => {
        let content = item.map((element, j) => { return (
            <td key={j}> <GridTile tileKey={element} selectedX={props.selectedX} selectedY={props.selectedY} x={j} y={i} setClickedTile={props.setClickedTile}></GridTile> </td>
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

const buttonLabels = {
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
    'f': 'Place Flag (Must be within 1 tile of your territory)',
}

const GameButton = (props) => {
    return <button onClick={() => updateMove(props.currentPlayer, props.currentX, props.currentY, props.btnId)} >{buttonLabels[props.btnId]}</button>
}

const GameControls = (props) => {
    let buttons;
    switch (props.controlType) {
        case "empty":
            buttons = <li>No valid moves on this tile</li>;
            break;
        case "placeBase":
            buttons = ['b'].map((element, j) => { 
                return (
                    <li key={j}> <GameButton btnId={element} currentPlayer={props.currentPlayer} currentX={props.currentX} currentY={props.currentY}></GameButton></li>
                )
            });
            break;
        case "placeFlag":
            buttons = ['f'].map((element, j) => { 
                return (
                    <li key={j}> <GameButton btnId={element} currentPlayer={props.currentPlayer} currentX={props.currentX} currentY={props.currentY}></GameButton></li>
                )
            });
            break;
        case "placeGeneric":
            buttons = ['w', 'tn', 'tne', 'te','tse','ts','tsw','tw','tnw','f'].map((element, j) => {
                return (
                    <li key={j}> <GameButton btnId={element} currentPlayer={props.currentPlayer} currentX={props.currentX} currentY={props.currentY}></GameButton></li>
                )
            });
            break;
        case "shoot":
            buttons = ['s'].map((element, j) => {
                return (
                    <li key={j}> <GameButton btnId={element} currentPlayer={props.currentPlayer} currentX={props.currentX} currentY={props.currentY}></GameButton></li>
                )
            });
            break;
        default:
            buttons = <li>No valid moves on this tile</li>;
            break;
    }
    console.log(buttons);
    return <div id="gameControls">
        <ul>
            {buttons}
        </ul>
    </div>
}

class GameView extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            currentX: -1,
            currentY: -1,
            controlType: "empty",
        };

        this.setClickedTile = this.setClickedTile.bind(this);
        controlReset = this.resetControls.bind(this);
    }
    setClickedTile(x, y) {
        console.log(this.props.grid[y][x]);
        let ct = "empty";
        if(this.props.grid[y][x] === 'n.' && this.props.currentTurn == 1) {
            ct = "placeBase";
        } else if(this.props.grid[y][x] === 'n.') {
            ct = "placeFlag"  
        } else if(this.props.grid[y][x] === `${this.props.currentPlayer}.`) {
            ct = "placeGeneric";
        } else if(this.props.grid[y][x].substring(0,2) === `${this.props.currentPlayer}t`) {
            ct = "shoot";
        }
        this.setState(state => ({
            selectedX: x,
            selectedY: y,
            controlType: ct,
        }));
    }
    resetControls() {
        this.setState(state => ({
            selectedX: -1,
            selectedY: -1,
            controlType: "empty"
        }));
    }
    render() {

        let headerText = <h2 id="gameHeader" style={{
            color: backgroundColors[this.props.currentPlayer]
        }}>{this.props.currentUsername}'s Turn!</h2>;
        if(this.props.gameOver) {
            headerText = <div id="gameHeader"><h2>Game Over! Winner: {this.props.winner}</h2><button id="resetButton" onClick={resetGame}>Restart</button>
                </div>
        }
        return (
            <div id="gameView">
                {headerText}
                <GameGrid grid={this.props.grid} setClickedTile={this.setClickedTile} selectedX={this.state.selectedX} selectedY={this.state.selectedY}></GameGrid>
                <div id="playerBox">
                    <h5>Players:</h5>
                    <ul id="playerList"> 
                        <li id="redPlayer">{this.props.players.r || "no player"}</li>
                        <li id="yellowPlayer">{this.props.players.y || "no player"}</li>
                        <li id="greenPlayer">{this.props.players.g || "no player"}</li>
                        <li id="bluePlayer">{this.props.players.b || "no player"}</li>
                    </ul>
                </div>
                <div id="controlBox">
                    <h5>Controls:</h5>
                    <GameControls controlType={this.state.controlType} currentPlayer={this.props.currentPlayer} currentX={this.state.selectedX} currentY={this.state.selectedY}></GameControls>
                
                </div>
            </div>
        )
    }
}
const setup = function(csrf) {
    ReactDOM.render(
        <GameView grid={
            [
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
                ["n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n.", "n."],
            ]}
            players={{r: null, y: null, g: null, b: null}}
            currentPlayer={'r'}
            currentUsername={"Nobody"}
            currentTurn={0}
            gameOver={false}
            winner={''}
         />, document.querySelector("#game")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
        setup(result.csrfToken);
    });
};

const defaultUsername = `Mysterio ${Math.floor(Math.random() * 10000) % 10000}`;
let socket; 
let controlReset;
function setupUI(){
    btnSend.onclick = sendButtonClicked;
    btnJoin.onclick = joinButtonClicked;
    socket.on("message", onMessage);
    socket.on("messageAll", onMessageAll);
    socket.on("gameUpdate", onGameUpdate);
}

let currentMove = "";
const updateMove = (player, x, y, moveCode) => {
    currentMove = `${player}${x == 10 ? 'a' : x}${y == 10 ? 'a' : y}${moveCode}`;
    txtMsg.value = currentMove.trim();
    console.log(`Current move: '${currentMove}'`);
}

function sendButtonClicked(){
    let username = document.querySelector("#username").innerHTML.trim();
    username = username.length ? username : defaultUsername;
    
    let msg = txtMsg.value.trim();
    msg = msg.length ? msg : "Hi!";
    txtMsg.value = "";
    
    const obj = { username, msg };
    
    console.log("Sending:  ", obj);
    socket.emit("message", obj);
    showMessage(obj,"sentMessage");
}

function joinButtonClicked() {
    let username = document.querySelector("#username").innerHTML.trim();
    username = username.length ? username : defaultUsername;
    
    const obj = { username, msg: "join" };
    
    console.log("Sending:  ", obj);
    socket.emit("message", obj);
}

function resetGame() {
    let username = document.querySelector("#username").innerHTML.trim();
    username = username.length ? username : defaultUsername;
    
    const obj = { username, msg: "reset" };
    console.log("Sending:  ", obj);
    socket.emit("message", obj);
}
function onMessage(obj){
    console.log("Received:", obj);
}

function onMessageAll(obj){
    console.log("Received: ", obj);
}

function onGameUpdate(obj) {
    console.log("Received gameupdate: ", obj);
    ReactDOM.render(
        <GameView 
            grid={
                obj.newGame.game
            } 
            players={
                obj.newGame.players
            }
            currentPlayer={obj.newGame.currentPlayer}
            currentUsername={obj.newGame.players[obj.newGame.currentPlayer] || "Nobody"}
            currentTurn={obj.newGame.currentTurn}
            gameOver={obj.newGame.isGameOver}
            winner={obj.newGame.winner}
        />, document.querySelector("#game")
    );
    if(obj.newGame.currentTurn > 0) {
        document.querySelector("#btnJoin").style.display = "none";
    } else {
        document.querySelector("#btnJoin").style.display = "inline-block";
    }
    controlReset();
}

$(document).ready(function() {
    getToken();
    socket = io();
    setupUI();
});