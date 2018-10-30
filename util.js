function generateUUID() {

    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136

    var lut = []; for (var i=0; i<256; i++) { lut[i] = (i<16?'0':'')+(i).toString(16).toUpperCase(); }

    return function () {
      var d0 = Math.random()*0xffffffff|0;
      var d1 = Math.random()*0xffffffff|0;
      var d2 = Math.random()*0xffffffff|0;
      var d3 = Math.random()*0xffffffff|0;
      return lut[d0&0xff]+lut[d0>>8&0xff]+lut[d0>>16&0xff]+lut[d0>>24&0xff]+'-'+
        lut[d1&0xff]+lut[d1>>8&0xff]+'-'+lut[d1>>16&0x0f|0x40]+lut[d1>>24&0xff]+'-'+
        lut[d2&0x3f|0x80]+lut[d2>>8&0xff]+'-'+lut[d2>>16&0xff]+lut[d2>>24&0xff]+
        lut[d3&0xff]+lut[d3>>8&0xff]+lut[d3>>16&0xff]+lut[d3>>24&0xff];
    }();
}

Math.clamp=function(val,min,max){return Math.max(min,Math.min(max,val));}

function loadImage(path, callback) {
  var reader  = new FileReader();
  reader.addEventListener("load", function () {
    var image = new Image();
    image.onload = function(){callback(image)};
    image.src = reader.result;
  }, false);

  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function(){
      if (this.readyState == 4){
          reader.readAsDataURL(this.response);
      }
  }
  xhr.open('GET', path);
  xhr.responseType = 'blob';
  xhr.send();
}

function loadCubemap(dirPath, sType, callback){
  var sides = {};
  var sideCount = 0;
  var onSideLoaded = function(sideImage, side){
    sides[side] = sideImage;
    sideCount++;
    if(sideCount == 6)
      callback(sides);
  }

  var loadSide = function(path, side){
    var reader  = new FileReader();
    reader.addEventListener("load", function () {
      var image = new Image();
      image.onload = function(){onSideLoaded(image, side)};
      image.src = reader.result;
    }, false);

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(data){
        if (this.readyState == 4){
            reader.readAsDataURL(this.response);
        }
    }
    xhr.open('GET', path);
    xhr.responseType = 'blob';
    xhr.send();
  }

  loadSide(dirPath + '/' + 'posx' + sType, 'posx');
  loadSide(dirPath + '/' + 'negx' + sType, 'negx');
  loadSide(dirPath + '/' + 'posy' + sType, 'posy');
  loadSide(dirPath + '/' + 'negy' + sType, 'negy');
  loadSide(dirPath + '/' + 'posz' + sType, 'posz');
  loadSide(dirPath + '/' + 'negz' + sType, 'negz');
}

function loadIndexedObj(path, callback){
  var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", function(){
      callback(parseOBJ(oReq.responseText));
      // loadedMesh = new OBJ.Mesh(oReq.responseText);
      // OBJ.initMeshBuffers(STK.Board.Context, loadedMesh);
      // callback(loadedMesh);
    });
    oReq.open("GET", path);
    oReq.send();
}

function parseOBJ ( text ) {

    console.time( 'IndexedOBJLoader' );

    var objects = [];
    var object;
    var foundObjects = false;
    var vertices = [];
    var normals = [];
    var uvs = [];
    var indicesP = [];
    var indicesN = [];
    var indicesU = [];

    function addObject( name ) {

      var geometry = {
        vertices: [],
        normals: [],
        uvs: []
      };

      var material = {
        name: '',
        smooth: true
      };

      object = {
        name: name,
        geometry: geometry,
        material: material
      };

      objects.push( object );

    }

    function parseVertexIndex( value ) {

      var index = parseInt( value );

      return ( index >= 0 ? index - 1 : index + vertices.length / 3 ) * 3;

    }

    function parseNormalIndex( value ) {

      var index = parseInt( value );

      return ( index >= 0 ? index - 1 : index + normals.length / 3 ) * 3;

    }

    function parseUVIndex( value ) {

      var index = parseInt( value );

      return ( index >= 0 ? index - 1 : index + uvs.length / 2 ) * 2;

    }

    function addVertex( a, b, c ) {

      object.geometry.vertices.push(
        vertices[ a ], vertices[ a + 1 ], vertices[ a + 2 ],
        vertices[ b ], vertices[ b + 1 ], vertices[ b + 2 ],
        vertices[ c ], vertices[ c + 1 ], vertices[ c + 2 ]
      );

    }

    function addNormal( a, b, c ) {

      object.geometry.normals.push(
        normals[ a ], normals[ a + 1 ], normals[ a + 2 ],
        normals[ b ], normals[ b + 1 ], normals[ b + 2 ],
        normals[ c ], normals[ c + 1 ], normals[ c + 2 ]
      );

    }

    function addUV( a, b, c ) {

      object.geometry.uvs.push(
        uvs[ a ], uvs[ a + 1 ],
        uvs[ b ], uvs[ b + 1 ],
        uvs[ c ], uvs[ c + 1 ]
      );

    }

    function addFace( a, b, c, d,  ua, ub, uc, ud, na, nb, nc, nd ) {

      var ia = parseVertexIndex( a );
      var ib = parseVertexIndex( b );
      var ic = parseVertexIndex( c );
      var id;

      if ( d === undefined ) {

        addVertex( ia, ib, ic );

      } else {

        id = parseVertexIndex( d );

        addVertex( ia, ib, id );
        addVertex( ib, ic, id );

      }

      if ( ua !== undefined ) {

        ia = parseUVIndex( ua );
        ib = parseUVIndex( ub );
        ic = parseUVIndex( uc );

        if ( d === undefined ) {

          addUV( ia, ib, ic );

        } else {

          id = parseUVIndex( ud );

          addUV( ia, ib, id );
          addUV( ib, ic, id );

        }

      }

      if ( na !== undefined ) {

        ia = parseNormalIndex( na );
        ib = parseNormalIndex( nb );
        ic = parseNormalIndex( nc );

        if ( d === undefined ) {

          addNormal( ia, ib, ic );

        } else {

          id = parseNormalIndex( nd );

          addNormal( ia, ib, id );
          addNormal( ib, ic, id );

        }

      }

    }

    addObject( '' );

    // v float float float
    var vertex_pattern = /^v\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

    // vn float float float
    var normal_pattern = /^vn\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

    // vt float float
    var uv_pattern = /^vt\s+([\d|\.|\+|\-|e|E]+)\s+([\d|\.|\+|\-|e|E]+)/;

    // f vertex vertex vertex ...
    var face_pattern1 = /^f\s+(-?\d+)\s+(-?\d+)\s+(-?\d+)(?:\s+(-?\d+))?/;

    // f vertex/uv vertex/uv vertex/uv ...
    var face_pattern2 = /^f\s+((-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)))?/;

    // f vertex/uv/normal vertex/uv/normal vertex/uv/normal ...
    var face_pattern3 = /^f\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))\s+((-?\d+)\/(-?\d+)\/(-?\d+))(?:\s+((-?\d+)\/(-?\d+)\/(-?\d+)))?/;

    // f vertex//normal vertex//normal vertex//normal ...
    var face_pattern4 = /^f\s+((-?\d+)\/\/(-?\d+))\s+((-?\d+)\/\/(-?\d+))\s+((-?\d+)\/\/(-?\d+))(?:\s+((-?\d+)\/\/(-?\d+)))?/;

    var object_pattern = /^[og]\s+(.+)/;

    var smoothing_pattern = /^s\s+(\d+|on|off)/;

    //

    var lines = text.split( '\n' );

    for ( var i = 0; i < lines.length; i ++ ) {

      var line = lines[ i ];
      line = line.trim();

      var result;

      if ( line.length === 0 || line.charAt( 0 ) === '#' ) {

        continue;

      } else if ( ( result = vertex_pattern.exec( line ) ) !== null ) {

        // ["v 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

        vertices.push(
          parseFloat( result[ 1 ] ),
          parseFloat( result[ 2 ] ),
          parseFloat( result[ 3 ] )
        );
        //console.log(line , " Count -> ", vertices.length, " Vertices -> ", vertices.length/3);

      } else if ( ( result = normal_pattern.exec( line ) ) !== null ) {

        // ["vn 1.0 2.0 3.0", "1.0", "2.0", "3.0"]

        normals.push(
          parseFloat( result[ 1 ] ),
          parseFloat( result[ 2 ] ),
          parseFloat( result[ 3 ] )
        );
        //console.log(line , " Count -> ", normals.length, " Normals -> ", normals.length/3);

      } else if ( ( result = uv_pattern.exec( line ) ) !== null ) {

        // ["vt 0.1 0.2", "0.1", "0.2"]

        uvs.push(
          parseFloat( result[ 1 ] ),
          parseFloat( result[ 2 ] )
        );
        //console.log(line , " Count -> ", uvs.length, " UVS -> ", uvs.length/2);

      } else if ( ( result = face_pattern1.exec( line ) ) !== null ) {

        // ["f 1 2 3", "1", "2", "3", undefined]

        addFace(
          result[ 1 ], result[ 2 ], result[ 3 ], result[ 4 ]
        );

      } else if ( ( result = face_pattern2.exec( line ) ) !== null ) {

        // ["f 1/1 2/2 3/3", " 1/1", "1", "1", " 2/2", "2", "2", " 3/3", "3", "3", undefined, undefined, undefined]

        addFace(
          result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
          result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
        );

      } else if ( ( result = face_pattern3.exec( line ) ) !== null ) {

        // ["f 1/1/1 2/2/2 3/3/3", " 1/1/1", "1", "1", "1", " 2/2/2", "2", "2", "2", " 3/3/3", "3", "3", "3", undefined, undefined, undefined, undefined]

        // addFace(
        //  result[ 2 ], result[ 6 ], result[ 10 ], result[ 14 ],
        //  result[ 3 ], result[ 7 ], result[ 11 ], result[ 15 ],
        //  result[ 4 ], result[ 8 ], result[ 12 ], result[ 16 ]
        // );
        indicesP.push((result[ 2 ] - 1), (result[ 6 ] - 1), (result[ 10 ] - 1));
        indicesU.push((result[ 3 ] - 1), (result[ 7 ] - 1), (result[ 11 ] - 1));
        indicesN.push((result[ 4 ] - 1), (result[ 8 ] - 1), (result[ 12 ] - 1));

      } else if ( ( result = face_pattern4.exec( line ) ) !== null ) {

        // ["f 1//1 2//2 3//3", " 1//1", "1", "1", " 2//2", "2", "2", " 3//3", "3", "3", undefined, undefined, undefined]

        // addFace(
        //  result[ 2 ], result[ 5 ], result[ 8 ], result[ 11 ],
        //  undefined, undefined, undefined, undefined,
        //  result[ 3 ], result[ 6 ], result[ 9 ], result[ 12 ]
        // );
        indicesP.push((result[ 2 ] - 1), (result[ 5 ] - 1), (result[ 8 ] - 1));
        indicesN.push((result[ 3 ] - 1), (result[ 6 ] - 1), (result[ 9 ] - 1));

      } else if ( ( result = object_pattern.exec( line ) ) !== null ) {

        // o object_name
        // or
        // g group_name

        var name = result[ 1 ].trim();

        if ( foundObjects === false ) {

          foundObjects = true;
          object.name = name;

        } else {

          addObject( name );

        }

      } else if ( /^usemtl /.test( line ) ) {

        // material

        object.material.name = line.substring( 7 ).trim();

      } else if ( /^mtllib /.test( line ) ) {

        // mtl file

      } else if ( ( result = smoothing_pattern.exec( line ) ) !== null ) {

        // smooth shading

        object.material.smooth = result[ 1 ] === "1" || result[ 1 ] === "on";

      } else {

        throw new Error( "Unexpected line: " + line );

      }

    }

    for ( var i = 0, l = objects.length; i < l; i ++ ) {

      object = objects[ i ];
      // var geometry = object.geometry;

      // rawGeometry.setPositions(vertices);
      //Shouldn't have used apply at all...
      var indexedNormals = [];//Array.apply(null, Array(vertices.length)).map(Number.prototype.valueOf,0);
      for(var n = 0; n < indicesP.length ; n++){
        //f 344/344/6 201/116/1 202/118/1

        var vIndex = indicesP[n];
        var nIndex = indicesN[n];
        indexedNormals[vIndex*3] = normals[nIndex*3];
        indexedNormals[vIndex*3 + 1] = normals[nIndex*3 + 1];
        indexedNormals[vIndex*3 + 2] = normals[nIndex*3 + 2];
      }
      // rawGeometry.setNormals(indexedNormals);

      //Shouldn't have used apply at all...
      var indexedUVs= [];//Array.apply(null, Array(uvs.length)).map(Number.prototype.valueOf,0);
      for(var n = 0; n < indicesU.length ; n++){
        //f 344/344/6 201/116/1 202/118/1

        var vIndex = indicesP[n];
        var uIndex = indicesU[n];
        indexedUVs[vIndex*2] = uvs[uIndex*2];
        indexedUVs[vIndex*2 + 1] = uvs[uIndex*2 + 1];
      }
      // rawGeometry.setUVs(indexedUVs);

      // rawGeometry.setIndices(indicesP);
      

      // var material;

      // if ( this.materials !== null ) {

      //   material = this.materials.create( object.material.name );

      // }

      // if ( !material ) {

      //   material = new THREE.MeshPhongMaterial();
      //   material.name = object.material.name;

      // }

      // material.shading = object.material.smooth ? THREE.SmoothShading : THREE.FlatShading;

      // rawGeometry.setMaterial(material)
    }

    console.timeEnd( 'IndexedOBJLoader' );

    return {
      'positions': vertices,
      'normals': indexedNormals,
      'uvs': indexedUVs,
      'indices': indicesP
    };

  }