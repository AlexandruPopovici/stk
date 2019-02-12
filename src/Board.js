var Board = function(canvas, glContext){
	STK.Board.Context = glContext;
	STK.Board.Canvas = canvas;
	STK.Board.screenWidth = canvas.width;
	STK.Board.screenHeight = canvas.height;
}

Board.Context = undefined;
Board.Canvas = undefined;
Board.screenWidth = undefined;
Board.screenHeight = undefined;

Board.prototype = {
	constructor: Board,
}

export default Board;