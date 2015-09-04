var HapiField = function() {
  this.simulationUniforms = {
    dT: {
      type: "f",
      value: 0
    },
    noiseSize: {
      type: "f",
      value: .1
    }
  }

  this.renderUniforms = {
    t_pos: {
      type: "t",
      value: null
    }
  }

  this.SIZE = 512;
  var canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  var canvasTexture = new THREE.Texture(canvas);
  this.ctx = canvas.getContext('2d');
  var image = new Image();
  image.src = "assets/stacyhoward.jpg";
  image.onload = function() {
    this.ctx.drawImage(image, 0, 0, this.SIZE, this.SIZE);
    this.imageData = this.ctx.getImageData(0, 0, this.SIZE, this.SIZE).data;
    canvasTexture.needsUpdate = true;
    this.init();
  }.bind(this);


}

HapiField.prototype.init = function() {
  this.simulation = new PhysicsRenderer(this.SIZE, shaders.ss.sim, renderer);
  var geo = this.createLookupGeometry(this.SIZE);
  var mat = new THREE.ShaderMaterial({
    uniforms: this.renderUniforms,
    vertexShader: shaders.vs.lookup,
    fragmentShader: shaders.fs.lookup
  });

  this.simulation.setUniforms(this.simulationUniforms);

  var particles = new THREE.PointCloud(geo, mat);
  particles.frustumCulled = false;
  scene.add(particles);

  this.simulation.addBoundTexture(this.renderUniforms.t_pos, 'output');

  var texture = this.createPositionTexture(this.SIZE);
  this.simulation.reset(texture);

  this.ready = true;

}

HapiField.prototype.createPositionTexture = function(size) {

  var data = new Float32Array(size * size * 4);
  var j = 0;
  for (var x = 0; x < size; x++) {
    for(var y = size-1; y >= 0; y--) {
      data[j] = x/size;
      data[j+1] = y/size;
      data[j+2] = 0;
      data[j+3] = 0;
      j+=4;
    }
  }
  var texture = new THREE.DataTexture(
    data,
    size,
    size,
    THREE.RGBAFormat,
    THREE.FloatType


  );
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.needsUpdate = true;

  return texture;

}

HapiField.prototype.createLookupGeometry = function(size) {


  var geo = new THREE.BufferGeometry();
  var positions = new Float32Array(size * size * 3);
  var colors = new Float32Array(size * size * 3);
  var j = 0;
  var c = 0;
  for (var x = 0; x < size; x++) {
    for(var y = 0; y < size; y++) {
      positions[j] = x/size;
      positions[j+1] = y/size;

      colors[j] = this.imageData[c]/255.0;
      colors[j+1] = this.imageData[c+1]/255.0;
      colors[j+2] = this.imageData[c+2]/255.0;

      c+=4;
      j+=3;
    }
  }

  var posA = new THREE.BufferAttribute(positions, 3);
  var colorA = new THREE.BufferAttribute(colors, 3)
  geo.addAttribute('position', posA);
  geo.addAttribute('color', colorA);


  return geo;

}
HapiField.prototype.update = function() {
  if(!this.ready){
    return;
  }
  this.simulationUniforms.dT.value = clock.getDelta();
  this.simulation.update();

}