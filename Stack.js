STK.Stack = function(id){
	this.id = id;

	this.materials = {
		_array: null,
		get: function(id){
			for(var i = 0 ; i < this._array.length; i++){
				if(this._array[i].id == id)
					return this._array[i];
			}
			return false;
		},
		set: function(array){
			this._array = array;
		}
	};

	this.uniformBlocks = Object.create(this.materials);
	this.transforms = null;
	this.frameBuffers = null;

	this._onStackRender = null;
}

Stk.Stacks = {};

STK.Stack.prototype = {

	constructor: STK.Stack,

	initMaterials: function(userFunction){
		this.materials.set(userFunction.bind(this)());
	},

	initUniformBlocks: function(userFunction){
		this.uniformBlocks.set(userFunction.bind(this)());
	},

	initTransforms: function(userFunction){
		this.transforms = userFunction.bind(this)();
	},

	initFrameBuffers: function(userFunction){
		this.frameBuffers = userFunction.bind(this)();
	},

	getMaterial: function(id){
		return this.materials.get(id);
	},

	getUniformBlock: function(id){
		return this.uniformBlocks.get(id);
	},

	onStackRender: function(userFunction){
		this._onStackRender = userFunction.bind(this);
	},

	render: function(){
		this._onStackRender();
	},


}