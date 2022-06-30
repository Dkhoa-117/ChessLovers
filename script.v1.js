var game = new Chess();

// ! pieces valuation
const pieceValue = {
	p: -1,
	r: -5,
	n: -3,
	b: -3,
	q: -9,
	k: -100,
	P: 1,
	R: 5,
	N: 3,
	B: 3,
	Q: 9,
	K: 100,
};

// ! Make best move function
function makeBestMove() {
	if (game.game_over()) {
		return;
	}
	var bestMoves = game.moves();
	var bestMove = null;
	var gameBestValuation = 999;
	for (var i = 0; i < bestMoves.length; i++) {
		game.move(bestMoves[i]);
		var gameValuation = evaluateBoard(game.fen().split(" ")[0].split(""));
		console.log(gameValuation);
		game.undo();
		// ? the machine is Black so the less the game can be, the better it is.
		if (gameValuation < gameBestValuation) {
			gameBestValuation = gameValuation;
			bestMove = bestMoves[i];
		}
	}
	// * got the bestMove here
	game.move(bestMove);
}

// ! evaluate function
function evaluateBoard(board) {
	var value = 0;
	for (var i = 0; i < board.length; i++) {
		value += pieceValue[board[i]] ? pieceValue[board[i]] : 0;
	}
	return value;
}

// ! game state handling
function onDragStart() {
	if (game.game_over()) {
		return false;
	}
}

function onDrop(from, to) {
	removeGreySquares();

	var move = game.move({
		from: from,
		to: to,
		promotion: "q",
	});
	if (move === null) {
		return "snapback";
	}
	makeBestMove();
	gameHistory(game.history());
}

// ? adjust the position of the board after player play their turn
function onSnapEnd() {
	// * for instanst
	if (game.game_over()) {
		alert("Game over!");
	}
	board.position(game.fen());
}

function onMouseoutSquare() {
	removeGreySquares();
}

function onMouseoverSquare(square, piece) {
	var moves = game.moves({
		square: square,
		verbose: true,
	});

	// ? invalid move
	if (moves.length === 0) return;

	for (var i = 0; i < moves.length; i++) {
		greySquare(moves[i].to);
	}
}

// ! visualization Chessboard Helpers
function removeGreySquares() {
	$("#board .square-55d63").css("background", "");
}

function greySquare(square) {
	var Elsquare = $("#board .square-" + square);

	var background = "#a9a9a9";
	if (Elsquare.hasClass("black-3c85d")) {
		background = "#696969";
	}

	Elsquare.css("background", background);
}

function gameHistory(moves) {
	var historyElement = $("#move-history").empty();
	historyElement.empty();
	var turn = 1;
	for (var i = 0; i < moves.length; i += 2) {
		historyElement.append(
			"<span>" +
				turn +
				". " +
				moves[i] +
				" " +
				(moves[i + 1] ? moves[i + 1] : " ") +
				"</span><br>"
		);
		turn++;
	}
	historyElement.scrollTop(historyElement[0].scrollHeight);
}

// ! Chessboard Configuration
var config = {
	draggable: true,
	position: "start",
	onDragStart: onDragStart,
	onDrop: onDrop,
	onSnapEnd: onSnapEnd,
	onMouseoutSquare: onMouseoutSquare,
	onMouseoverSquare: onMouseoverSquare,
};
var board = ChessBoard("board", config);
