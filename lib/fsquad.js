function FSQuad(){
	var positions = [-1, -1,
					 1, -1,
					 1, 1,
					 -1, 1];

	var indices = [0, 1, 2, 2, 3, 0];
	return {
		vertices: positions,
		indices: indices
	};
}