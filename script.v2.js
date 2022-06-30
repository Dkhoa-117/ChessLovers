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
var makeBestMove = function () {
	positionCount = 0;
	var depth = parseInt($("#search-depth").find(":selected").text());
	if (game.game_over()) {
		return;
	}
	var bestMoves = game.moves();
	var bestMove = null;
	var gameBestValuation = 999;
	var timeStart = new Date().getTime();
	for (var i = 0; i < bestMoves.length; i++) {
		game.move(bestMoves[i]);
		var gameValuation = minimax(
			game,
			depth - 1,
			-1000,
			1000,
			false /* next turn is human - max turn */
		);
		game.undo();

		// ? the machine is _black so the less the game can be, the better it is.
		if (gameValuation <= gameBestValuation) {
			gameBestValuation = gameValuation;
			bestMove = bestMoves[i];
		}
	}
	var timeStop = new Date().getTime();
	var moveTime = (timeStop - timeStart) / 1000;
	updateGameInfo(gameBestValuation, moveTime + "s", "", positionCount);
	// * got the bestMove here
	game.move(bestMove);
	board.position(game.fen());
	updateGameHistory(game.history());
};

var minimax = function (game, depth, alpha, beta, isMachineTurn) {
	positionCount++;
	// * this function will get the best value of each turn then calculate which move to choose
	// ? root case
	if (depth === 0) {
		return evaluateBoard(game.fen().split(" ")[0].split(""));
	}

	var availableMoves = game.moves();

	if (isMachineTurn) {
		// ? in turn of the machine
		var bestValuation = 999;
		for (var i = 0; i < availableMoves.length; i++) {
			game.move(availableMoves[i]);
			bestValuation = Math.min(
				bestValuation,
				minimax(game, depth - 1, alpha, beta, !isMachineTurn)
			);
			game.undo();
			beta = Math.min(beta, bestValuation);
			if (beta <= alpha) {
				return bestValuation;
			}
		}
	} else {
		// ? in turn of human
		var bestValuation = -999;
		for (var i = 0; i < availableMoves.length; i++) {
			game.move(availableMoves[i]);
			bestValuation = Math.max(
				bestValuation,
				minimax(game, depth - 1, alpha, beta, !isMachineTurn)
			);
			game.undo();
			alpha = Math.max(alpha, bestValuation);
			if (beta <= alpha) {
				return bestValuation;
			}
		}
	}
	return bestValuation;
};

// ! evaluate function
var evaluateBoard = function (board) {
	var value = 0;
	for (var i = 0; i < board.length; i++) {
		value += pieceValue[board[i]] ? pieceValue[board[i]] : 0;
	}
	return value;
};

// ! game state handling
function onDragStart() {
	if (game.in_checkmate() === true || game.in_draw() === true) {
		return false;
	}
}

function onDrop(source, target) {
	var move = game.move({
		from: source,
		to: target,
		promotion: "q",
	});
	removeGreySquares();

	if (move === null) {
		return "snapback";
	}
	updateGameHistory(game.history());
	window.setTimeout(makeBestMove, 250);
}

// ? adjust the position of the board after player play their turn
var onSnapEnd = function () {
	board.position(game.fen());
};

var onMouseoutSquare = function () {
	removeGreySquares();
};

var onMouseoverSquare = function (square, piece) {
	var moves = game.moves({
		square: square,
		verbose: true,
	});

	// ? invalid move
	if (moves.length === 0) return;

	greySquare(square);
	for (var i = 0; i < moves.length; i++) {
		greySquare(moves[i].to);
	}
};

// ! visualization Chessboard Helpers
var removeGreySquares = function () {
	$("#board .square-55d63").css("background", "");
};

var greySquare = function (square) {
	var Elsquare = $("#board .square-" + square);

	var background = "#a9a9a9";
	if (Elsquare.hasClass("black-3c85d")) {
		background = "#696969";
	}

	Elsquare.css("background", background);
};

var updateGameHistory = function (moves) {
	var historyElement = $("#move-history").empty();
	//historyElement.empty();
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
};

var updateGameInfo = function (
	gameValuation,
	moveTime,
	positionPerSec,
	positionCount
) {
	$("#position-count").text(gameValuation + " - " + positionCount);
	$("#time").text(moveTime);
	$("#position-per-s").text(positionPerSec);
};

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
