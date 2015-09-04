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
  var planeGeo = new THREE.PlaneGeometry(2, 2, 100, 100);
  var mesh = new THREE.Mesh(planeGeo);
  // scene.add(mesh)
  var vertices = planeGeo.vertices;
  for ( var i = 0, j=0; j < data.length; i++, j+=4) {
    if(i >= vertices.length){
      i = 0;
    }
    data[j] = vertices[i].x;
    data[j+1] = vertices[i].y + Math.random()/10;
    data[j+2] = vertices[i].z + Math.random()/10;
    data[j+3]  = 0;
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

  for (var i = 0, j = 0, c = 0, l = positions.length / 3; i < l; i++, j += 3, c+=4) {

    positions[j] = Math.random() * 10
    positions[j + 1] = Math.random()

    colors[j] = this.imageData[c]/255.0;
    colors[j+1] = this.imageData[c+1]/255.0;
    colors[j+2] = this.imageData[c+2]/255.0;

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