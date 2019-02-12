STK.GeometryInstance = function(id){
	this.tree = DisplayTreeNode({
		geometryID: id,
		modelMatrix: mat4.create();
		normalMatrix: mat4.create();
	});
	this._map = {};
}

STK.GeometryInstance.prototype = {

	constructor: STK.GeometryInstance,

	find: function(nodeID){
		var retNode = null;
		this.tree.each(function(node){
			if(node.geometryID == nodeID){
				retNode = node;
				return true;
			}
			return false;
		});
		return retNode;
	},

	setParent: function(parentId){
		var parentNode = this.find(parentId);
		if(parentNode != null){
			parentNode.tree.addOne(this.tree);
		}
	}
}