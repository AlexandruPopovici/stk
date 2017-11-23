function createControllerEntity(){
	var entity = new STK.Entity();
	entity.bindInput = function(element){
		element.addEventListener('click', this.click.bind(this));
		element.addEventListener('mousemove', this.move.bind(this));
		element.addEventListener('mouseup', this.up.bind(this));
		element.addEventListener('mousedown', this.down.bind(this));
	};

	entity.down = function(e){
		console.log('down');
	};

	entity.up = function(e){
		console.log('up');
	};

	entity.move = function(e){
		console.log('move');
	};

	entity.click = function(e){
		console.log('click');
	};
	return entity; 
}


