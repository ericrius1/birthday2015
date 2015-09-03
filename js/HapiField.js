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

  var SIZE = 128;
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
  this.simulation.resetRand(5);

}




HapiField.prototype.createLookupGeometry = function(size) {
  var geo = new THREE.BufferGeometry()
  var positions = new Float32Array(size * size * 3);

  for (var i = 0, j = 0, l = positions.length / 3; i < l; i++, j += 3) {

    positions[j] = (i % size) / size;
    positions[j + 1] = Math.floor(i / size) / size;

  }

  var posA = new THREE.BufferAttribute(positions, 3);
  geo.addAttribute('position', posA);

  return geo;

}
HapiField.prototype.update = function() {
  this.simulationUniforms.dT.value = clock.getDelta();
  this.simulation.update(); 

}