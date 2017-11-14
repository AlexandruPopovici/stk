//http://www.ida.liu.se/opendsa/OpenDSA/Books/TDDD86F16/html/UnionFind.html#
// General Tree implementation for UNION/FIND

// class ParPtrTree {
//   private int[] array;     // Node array

//   ParPtrTree(int size) {
//     array = new int[size]; // Create node array
//     for (int i=0; i<size; i++)
//       array[i] = -1;       // Each node is its own root to start
//   }

//   // Merge two subtrees if they are different
//   void UNION(int a, int b) {
//     int root1 = FIND(a);     // Find root of node a
//     int root2 = FIND(b);     // Find root of node b
//     if (root1 != root2)          // Merge two trees
//       array[root1] = root2;
//   }

//   // Return the root of curr's tree
//   int FIND(int curr) {
//     if (array[curr] == -1) return curr; // At root
//     while (array[curr] != -1) curr = array[curr];
//     return curr;
//   }
// }

var PPT = function () {
  this.version = '1';
  this.array = [-1];
  this.nodes = ['root'];
}

PPT.prototype = {

  constructor: PPT,

  UNION: function(a, b){
    var root1 = this.FIND(a);     // Find root of node a
    var root2 = this.FIND(b);     // Find root of node b
    if (root1 != root2)          // Merge two trees
      this.array[root1] = root2;
    else
      return -1;
  },

  FIND: function(curr){
    if (this.array[curr] == -1) return curr; // At root
    while (this.array[curr] != -1){
      curr = this.array[curr];
      break;
    } 
    return curr;
  },

  WALK: function(leafIndex){
    var set = [];
    var index = leafIndex;
    while(this.array[index] != -1){
      set.push(index);
      index = this.FIND(index);
    }
    return set;
  },
 

  addChild: function(childID, parentID){
    this.nodes[this.array.length] = childID;
    this.array[this.array.length] = this.nodes.indexOf(parentID)
    return 0;
  },

  getDisjointSet: function(nodeID){
    return this.WALK(this.nodes.indexOf(nodeID));
  },

  print: function(){
    for(var i=0; i < this.nodes.length; i++){
      console.warn('Starting at node : ', this.nodes[i]);
      var dSet = this.getDisjointSet(this.nodes[i]);
      for(var s = 0; s < dSet.length; s++){
        console.warn("Parent -> ", this.nodes[dSet[s]]);
      }
      
    }
  }
}