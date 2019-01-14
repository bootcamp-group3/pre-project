const db = require("../models");
const Game = require('../models/domain/gamestate')

module.exports = function (app) {
    // Create a new game
    app.post("/api/game/create", async function (req, res) {
        const game = new Game(req.body);
        board = await Game.createBoard(game);

        res.json(board);
    });

    // Retrieve Game
    app.get("/api/game/retrieve/:id", async function (req, res) {
        board = await Game.retrieveBoard(req.params.id);

        res.json(board);
    });

    // Update Game
    app.put("/api/game/update/:id", async function (req, res) {
        board = await Game.updateBoard(req.params.id, req.body);

        res.json(board);
    });

    // Delete Game
    app.delete("/api/game/delete/:id", async function (req, res) {
        board = await Game.deleteBoard(req.params.id);

        res.json(board);
    });
};
