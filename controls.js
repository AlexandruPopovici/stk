function createControllerEntity(){
	var entity = new STK.Entity();
	entity.bindInput = function(element){
		element.addEventListener('mousemove', this.move.bind(this));
		element.addEventListener('mouseup', this.up.bind(this));
		element.addEventListener('mousedown', this.down.bind(this));
		element.addEventListener('wheel', this.wheel.bind(this));
	};
	entity.isDown = false;
	entity.origin = vec3.fromValues(0,1,0);
	entity.radius = 10;
	entity.angle1 = 0;
	entity.angle2 = 0;
	entity.out = mat4.create();
	entity.pos3 = vec3.create();
	entity.lastForward = vec3.fromValues(0, 0, 1);

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
		// var newDir = vec3.fromValues(-x,-y,-z);
		// vec3.normalize(newDir, newDir);
		// var quat = fromToRotation(this.lastForward, newDir);
		// // console.warn(quat);
		// var T = mat4.translate([], mat4.create(), eye);
		// var R = lookAt(eye, [0,0,0], [0,1,0]);//mat4.fromQuat([], quat);
		// var RT = mat4.multiply(mat4.create(), R, T);
		
		// var V = mat4.invert([], RT);

		// mat4.copy(this.out, V);
		mat4.lookAt(this.out, eye, this.origin, [0,1,0]); 

		vec3.copy(this.pos3, eye);
		// vec3.copy(this.lastForward, newDir);
	};

	return entity; 
}

function fromToRotation(from, to){
	// float norm_u_norm_v = sqrt(sqlength(u) * sqlength(v));
 //    float cos_theta = dot(u, v) / norm_u_norm_v;
 //    float half_cos = sqrt(0.5f * (1.f + cos_theta));
 //    vec3 w = cross(u, v) / (norm_u_norm_v * 2.f * half_cos);
 //    return quat(half_cos, w.x, w.y, w.z);

    var norm_u_norm = Math.sqrt(Math.pow(vec3.length(from), 2.) * Math.pow(vec3.length(to), 2.));
    var cos_theta = vec3.dot(from, to) / norm_u_norm;
    var half_cos = Math.sqrt(0.5 * (1. + cos_theta));
    var d = (norm_u_norm * 2. * half_cos);
    var w = vec3.cross([], from, to);
    vec3.scale(w, w, d);
    return vec4.fromValues(half_cos, w[0], w[1], w[2]);
}

function lookAt(eye, target, up){
	// Vector3 lookat = { lookAtPosition.x, lookAtPosition.y, lookAtPosition.z };
	// Vector3 pos = { position.x, position.y, position.z };
	// Vector3 objectUpVector = { 0.0f, 1.0f, 0.0f };

	// Vector3 zaxis = Vector3::normalize(lookat - pos);
	// Vector3 xaxis = Vector3::normalize(Vector3::cross(objectUpVector, zaxis));
	// Vector3 yaxis = Vector3::cross(zaxis, xaxis);

	// Matrix16 pm = {
	//     xaxis.x, xaxis.y, xaxis.z, 0,
	//     yaxis.x, yaxis.y, yaxis.z, 0,
	//     zaxis.x, zaxis.y, zaxis.z, 0,
	//     0, 0, 0, 1
	// };

	var lookat = vec3.copy([], target);
	var pos = vec3.copy([], eye);
	var objectUpVector = vec3.fromValues(0,1,0);
	var zaxis = vec3.normalize([], vec3.subtract([], lookat, pos));
	var xaxis = vec3.normalize([], vec3.cross([], objectUpVector, zaxis));
	var yaxis = vec3.cross([], zaxis, xaxis);
	var mat = mat4.fromValues(
		xaxis[0], xaxis[1], xaxis[2], 0,
	    yaxis[0], yaxis[1], yaxis[2], 0,
	    zaxis[0], zaxis[1], zaxis[2], 0,
	    0, 0, 0, 1
	);
	return mat;
}




