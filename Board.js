STK.Board = function(canvas, glContext){
	STK.Board.Context = glContext;
	STK.Board.Canvas = canvas;
	STK.Board.screenWidth = canvas.width;
	STK.Board.screenHeight = canvas.height;
}

STK.Board.Context = undefined;
STK.Board.Canvas = undefined;
STK.Board.screenWidth = undefined;
STK.Board.screenHeight = undefined;

STK.Board.prototype = {

	constructor: STK.Board,
}