// Import socket lib
var socket = io();
// Declare socket ID
var socketID;
// Parse game ID from url
const url = window.location.pathname;
const gameID = url.substr(url.lastIndexOf("/") + 1);
console.log(`Game ID : ${gameID}`);

//Declare function to render board
function renderBoard(state) {
    tileWidth = 60;
    let boardContainer = $("<div class='board-container' style='position:relative;'>");
    for (var f = 0; f < state.tiles.length; f++) {
        let thisTile = state.tiles[f];
        let tile = $(`<div class="tile" style="width:${tileWidth}px;position:absolute;top:${thisTile.y * tileWidth}px;left:${thisTile.x * tileWidth}px">`);
        let tileImg = $("<img src='/assets/media/grass_1.png' class='tile-img' style='width:100%;'>");
        tile.html(tileImg);
        // tile.text(`(${thisTile.x + 1},${thisTile.y + 1})\nFort:${thisTile.fortified}`);
        tile.data("x", thisTile.x + 1);
        tile.data("y", thisTile.y + 1);
        tile.data("occupied", thisTile.owner);
        tile.data("fortified", thisTile.fortified);
        tile.data("tileType", thisTile.type);
        boardContainer.append(tile);
    }
    console.log();
    $("#target-frame").append(boardContainer);
}

// Upon initial connection
socket.on("connect", function () {
    // Declare socketID
    socketID = socket.io.engine.id;
    console.log("This client is on socket: ");
    console.log(socketID + "\n\n");

    // Use the join_game protocol to join namespace
    socket.emit("join_game", gameID);

    // Wait for a start_game response
    socket.on("start_game", function (event) {
        console.log("# start game with dat:");
        console.log(event.content);
        // Declare newEvent
        let newEvent = event.content;
        // Add player to data object
        newEvent.players = {};
        newEvent.players[socketID] = {
            position: {
                x: 1,
                y: 1
            },
            score: {
                tiles: 0,
                fortified: 0
            }
        };
        console.log("# append player, update game with dat:");
        console.log(newEvent);
        socket.emit("send_update", { "id": gameID, "content": newEvent });
    });

    socket.on("get_update", function (msg) {
        console.log(msg);
        if (msg.players[socketID] === undefined) {
            let newEvent = msg;
            // Add player to data object
            console.log("Adding player to obj");
            newEvent.players[socketID] = {
                position: {
                    x: 10,
                    y: 10
                },
                score: {
                    tiles: 0,
                    fortified: 0
                }
            };
            socket.emit("send_update", { "id": gameID, "content": newEvent });
        } else {
            console.log("Player already in obj");
            renderBoard(msg);
            var tiles = document.getElementsByClassName("tile");
            console.log(tiles);
            
            let turn = socketID;
            if (turn === socketID) {
                $(".tile").hover(function () {
                    console.log($(".tile").data("x"));
                    console.log("hovering");
                    $("#tile-details").html(`
                            <ul>
                                <li>X: ${$(this).data("x")}</li>
                                <li>Y: ${$(this).data("y")}</li>
                                <li>Occupied: ${$(this).data("occupied")}</li>
                                <li>Fortifications: ${$(this).data("fortified")}</li>
                                <li>Type: ${$(this).data("tileType")}</li>
                            </ul>`);
                }, function () {
                    $("#tile-details").html("");
                });
            
                $(".tile").on("click", function (event) {
            
                    console.log("A tile was clicked.");
                    let x = $(this).data("x");
                    let y = $(this).data("y");
                    console.log(`X:${x}  Y:${y}`);
            
                    if ($(this).data("occupied")) {
                        if (x === currentTile.x & y === currentTile.y) {
                            console.log("Invalid Move");
                        } else if (x >= currentTile.x - 1 && x <= currentTile.x + 1 && y >= currentTile.y - 1 && y <= currentTile.y + 1) {
                            console.log("Valid Move");
                            $("#attack-modal").modal("show");
                            $("#attack-button").on("click", function (event) {
                                let roll = Math.floor(Math.random() * 10) + 1;
                                if (roll >= $(this).data("fortified")) {
                                    $(this).data("fortified", roll);
                                    $(this).data("occupied", socketID);
                                    $("#fortify-modal").modal("hide");
                                } else {
                                    $("#fortify-modal").modal("hide");
                                }
                            });
            
                        } else {
                            console.log("Invalid Move");
                        }
                    } else {
                        if (x === currentTile.x & y === currentTile.y) {
                            console.log("Invalid Move");
                        } else if (x >= currentTile.x - 1 && x <= currentTile.x + 1 && y >= currentTile.y - 1 && y <= currentTile.y + 1) {
                            console.log("Valid Move");
                            $("#fortify-modal").modal("show");
                            $("#roll").on("click", function (event) {
                                let roll = Math.floor(Math.random() * 10) + 1;
                                $(this).data("fortified", roll);
                                $(this).data("occupied", socketID);
                                $("#fortify-modal").modal("hide");
                            });
            
                        } else {
                            console.log("Invalid Move");
                        }
                    }
                });
            } else {
                alert("Its not your turn");
            }
        }
    });
});

