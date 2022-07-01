var game = new Chess();

const removeGraySquares = () => {
	$("#board .square-55d63").css("background", "");
};

const graySquares = (square) => {
	var Elsquare = $("#board .square-" + square);

	var background = "#a9a9a9";
	if (Elsquare.hasClass("black-3c85d")) {
		background = "#696969";
	}

	Elsquare.css("background", background);
};

const onDragStart = () => {
	if (game.game_over()) {
		return;
	}
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

const onDrop = (source, target) => {
	var move = game.move({
		from: source,
		to: target,
		promotion: "q",
	});

	removeGraySquares();
	if (move === null) {
		return "snapback";
	}
	updateGameHistory(game.history());
};

const onSnapEnd = () => {
	board.position(game.fen());
	var turn = "";
	if (game.turn() === "w") {
		turn = "White";
		document.getElementById("white-turn").style.display = "";
		document.getElementById("black-turn").style.display = "none";
	} else {
		document.getElementById("white-turn").style.display = "none";
		document.getElementById("black-turn").style.display = "";
	}
	if (game.in_checkmate()) {
		alert("Game Over! " + turn + " is in Checkmate !!!");
	} else if (game.in_draw()) {
		alert("Game Over! It's a Draw!!!");
	}
};

const onMouseoutSquare = () => {
	removeGraySquares();
};

const onMouseoverSquare = (square, piece) => {
	var moves = game.moves({
		square: square,
		verbose: true,
	});

	if (moves.length === 0) return;

	graySquares(square);

	for (var i = 0; i < moves.length; i++) {
		graySquares(moves[i].to);
	}
};

var config = {
	draggable: true,
	sparePieces: true,
	onDragStart: onDragStart,
	onDrop: onDrop,
	onSnapEnd: onSnapEnd,
	onMouseoutSquare: onMouseoutSquare,
	onMouseoverSquare: onMouseoverSquare,
};

const onStartBtn = () => {
	board.start();
	game.reset();
	$("#move-history").empty();
	document.getElementById("white-turn").style.display = "";
	document.getElementById("black-turn").style.display = "none";
};

const onFlipBtn = () => {
	board.flip();
	board.sparePieces = false; // ! troll :))) remember to delete this
};

var board = ChessBoard("board", config);
