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

  var SIZE = 512;
  this.simulation = new PhysicsRenderer(SIZE, shaders.ss.sim, renderer);
  var geo = this.createLookupGeometry(SIZE);
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

  var texture = this.createPositionTexture(SIZE);
  this.simulation.reset(texture);

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

  for (var i = 0, j = 0, l = positions.length / 3; i < l; i++, j += 3) {

    positions[j] = Math.random() * 10
    positions[j + 1] = Math.random()

    colors[j] = Math.random()
    colors[j+1] = Math.random()
    colors[j+2] = Math.random()

  }

  var posA = new THREE.BufferAttribute(positions, 3);
  var colorA = new THREE.BufferAttribute(colors, 3)
  geo.addAttribute('position', posA);
  geo.addAttribute('color', colorA);


  return geo;

}
HapiField.prototype.update = function() {
  this.simulationUniforms.dT.value = clock.getDelta();
  this.simulation.update();

}