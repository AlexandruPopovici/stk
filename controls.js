function createControllerEntity(){
	var entity = new STK.Entity();
	entity.bindInput = function(element){
		element.addEventListener('mousemove', this.move.bind(this));
		element.addEventListener('mouseup', this.up.bind(this));
		element.addEventListener('mousedown', this.down.bind(this));
		element.addEventListener('wheel', this.wheel.bind(this));
	};
	entity.isDown = false;
	entity.origin = vec3.fromValues(0,0,0);
	entity.radius = 10;
	entity.angle1 = 0;
	entity.angle2 = 0;
	entity.out = mat4.create();
	entity.pos3 = vec3.create();

	entity.down = function(e){
		entity.isDown = true;
	};

	entity.up = function(e){
		entity.isDown = false;
	};

	entity.move = function(e){
		if(entity.isDown){
			this.angle1 += e.movementX*0.01;
			this.angle2 += e.movementY*0.01; 
			this.angle2 = Math.clamp(this.angle2, -Math.PI/2, Math.PI/2);
			// console.warn('Theta -> ', this.theta);
			// console.warn('Phi -> ', this.phi);
		}

	};

	entity.wheel = function(e){
		this.radius += e.deltaY * 0.005;
	}

	entity.update = function(delta){
		var t = this.radius*Math.cos(this.angle2);   
		var y = this.radius*Math.sin(this.angle2);
		var x = t*Math.cos(this.angle1)
		var z = t*Math.sin(this.angle1)
		
		var eye = vec3.fromValues(x,y,z);
		// console.warn('eye -> ', x,y,z );
		var up = vec3.fromValues(0,1,0);
		mat4.lookAt(this.out, eye, this.origin, up); 
		vec3.copy(this.pos3, eye);
	};

	return entity; 
}


