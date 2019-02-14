var Board = function(canvas, glContext){
	Board.Context = glContext;
	Board.Canvas = canvas;
	Board.screenWidth = canvas.width;
	Board.screenHeight = canvas.height;
}

Board.Context = undefined;
Board.Canvas = undefined;
Board.screenWidth = undefined;
Board.screenHeight = undefined;

Board.prototype = {
	constructor: Board,
}

export default Board;