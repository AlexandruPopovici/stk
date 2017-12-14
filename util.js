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