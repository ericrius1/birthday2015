var Wormhole = function() {


  var diffuse = THREE.ImageUtils.loadTexture('assets/lines.jpg');
  // Normals For the Material
  this.uniforms = {

    t_audio: {
      type: "t",
      value: audio.texture
    },
    t_diffuse: {
      type: "t",
      value: diffuse
    },
    dT: {
      type: "f",
      value: 0
    },
    time: {
      type: "f",
      value: 0
    },

  }
  

  var depth = 100;
  var geo = new THREE.CylinderGeometry(10, 10, depth, 100, 100, true);

  var mat = new THREE.ShaderMaterial({
    uniforms: this.uniforms,
    vertexShader: shaders.vs.audio,
    fragmentShader: shaders.fs.audio,
  });

  this.mesh = new THREE.Mesh(geo, mat);
  this.mesh.translateZ(-depth/2);
  this.mesh.position.y -= 11;
  this.mesh.rotation.x = -Math.PI / 2;
  scene.add(this.mesh);

  this.mesh2 = new THREE.Mesh(geo, mat);
  this.mesh2.position.set(0, 0, -depth/2)
  this.mesh2.rotation.x = -Math.PI/2;
  scene.add(this.mesh2);
}

Wormhole.prototype.update = function() {
  this.uniforms.dT.value = clock.getDelta() * .0001;
  this.uniforms.time.value += this.uniforms.dT.value;

  this.mesh.rotation.y += 0.0005;
  this.mesh2.rotation.y -= 0.0005;


}