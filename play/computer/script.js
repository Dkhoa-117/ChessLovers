var game = new Chess();
var board;
game.clear();

// ! pieces valuation
const pieceValue = {
	p: 10,
	r: 50,
	n: 30,
	b: 30,
	q: 90,
	k: 1000,
};

// ! Make best move function
var makeBestMove = () => {
	positionCount = 0;
	var depth = parseInt($("#search-depth").find(":selected").text());
	if (game.game_over()) {
		alert("Game over1");
	}
	var bestMoves = game.moves();
	var bestMove = null;
	var gameBestValuation = 9999;
	var timeStart = new Date().getTime();
	for (var i = 0; i < bestMoves.length; i++) {
		game.move(bestMoves[i]);
		var gameValuation = minimax(
			game,
			depth - 1,
			-10000,
			10000,
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
	if (game.game_over()) {
		alert("Game over");
	}
};

var minimax = function (game, depth, alpha, beta, isMachineTurn) {
	positionCount++;
	// * this function will get the best value of each turn then calculate which move to choose
	// ? root case
	if (depth === 0) {
		return evaluateBoard(game.board());
	}

	var availableMoves = game.moves();

	if (isMachineTurn) {
		// ? in turn of the machine
		var bestValuation = 9999;
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
		var bestValuation = -9999;
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
	var totalValue = 0;
	for (var i = 0; i < 8; i++) {
		for (var j = 0; j < 8; j++) {
			var piece = board[i][j];
			if (piece) {
				var value = pieceValue[piece.type];

				switch (piece.type) {
					case "p":
						value =
							piece.color === "w"
								? value + pawnEvalWhite[i][j]
								: -value - pawnEvalBlack[i][j];
					case "r":
						value =
							piece.color === "w"
								? value + rookEvalWhite[i][j]
								: -value - rookEvalBlack[i][j];
						break;
					case "n":
						value =
							piece.color === "w"
								? value + knightEval[i][j]
								: -value - knightEval[i][j];
						break;
					case "b":
						value =
							piece.color === "w"
								? value + bishopEvalWhite[i][j]
								: -value - bishopEvalBlack[i][j];
						break;
					case "q":
						value =
							piece.color === "w"
								? value + evalQueen[i][j]
								: -value - evalQueen[i][j];
						break;
					case "k":
						value =
							piece.color === "w"
								? value + kingEvalWhite[i][j]
								: -value - kingEvalBlack[i][j];
						break;
				}
				totalValue += value;
			}
		}
	}
	return totalValue;
};

// ! import score for each piece's position
var reverseArray = function (array) {
	return array.slice().reverse();
};

const pawnEvalWhite = [
	[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
	[5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
	[1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
	[0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
	[0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
	[0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
	[0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
	[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
];

const pawnEvalBlack = reverseArray(pawnEvalWhite);

const knightEval = [
	[-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
	[-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
	[-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
	[-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
	[-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
	[-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
	[-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
	[-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
];

const bishopEvalWhite = [
	[-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
	[-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
	[-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
	[-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
	[-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
	[-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
	[-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
	[-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
];

const bishopEvalBlack = reverseArray(bishopEvalWhite);

const rookEvalWhite = [
	[0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
	[0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
	[0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0],
];

const rookEvalBlack = reverseArray(rookEvalWhite);

const evalQueen = [
	[-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
	[-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
	[-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
	[-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
	[0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
	[-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
	[-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
	[-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
];

var kingEvalWhite = [
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
	[-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
	[-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
	[2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
	[2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0],
];

const kingEvalBlack = reverseArray(kingEvalWhite);

// ! game state handling
function onDragStart() {
	if (game.in_checkmate() === true || game.in_draw() === true) {
		return;
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
	//position: "start",
	sparePieces: true,
	onDragStart: onDragStart,
	onDrop: onDrop,
	onSnapEnd: onSnapEnd,
	onMouseoutSquare: onMouseoutSquare,
	onMouseoverSquare: onMouseoverSquare,
};
var board = ChessBoard("board", config);

var flipOrientationBtn = () => {
	board.flip();
	board.sparePieces = false; // ! troll :))) remember to delete this
};
var settingBtn = () => {};
$("#startBtn").on("click", () => {
	board.start();
	game.reset();
});
