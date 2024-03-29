var HapiField = function() {
  this.photoEndPosition = new THREE.Vector3(0.5, 0, -0.5);
  this.simulationUniforms = {
    dT: {
      type: "f",
      value: 0
    },
    noiseSize: {
      type: "f",
      value: 2
    },
    direction: {
      type: "f",
      value: 1
    },
    speed: {
      type: "f",
      value: 0.0
    }
  }

  this.renderUniforms = {
    t_pos: {
      type: "t",
      value: null
    },
    t_audio: {
      type: "t",
      value: audio.texture
    },
    direction: {
      type: "f",
      value: 1
    }
  }

  this.SIZE = 512;
  this.canvas = document.createElement('canvas');
  this.canvas.width = 512;
  this.canvas.height = 512;
  this.canvasTexture = new THREE.Texture(this.canvas);
  this.ctx = this.canvas.getContext('2d');

  this.images = [];

  this.imageIndex = 0;

  var image = new Image();
  image.src = "assets/stacyhoward.jpg";
  this.images.push(image);
  image.onload = function() {
    this.newPhoto();
  }.bind(this)

  image = new Image();
  image.src = "assets/lines.jpg";
  this.images.push(image)

}


HapiField.prototype.newPhoto = function() {
  this.ctx.drawImage(this.images[this.imageIndex++], 0, 0, this.SIZE, this.SIZE);
  this.imageData = this.ctx.getImageData(0, 0, this.SIZE, this.SIZE).data;
  this.canvasTexture.needsUpdate = true;

  if (this.imageIndex === this.images.length) {
    this.imageIndex = 0;
  }

  this.simulation = new PhysicsRenderer(this.SIZE, shaders.ss.sim, renderer);
  var geo = this.createLookupGeometry(this.SIZE);
  var mat = new THREE.ShaderMaterial({
    uniforms: this.renderUniforms,
    vertexShader: shaders.vs.lookup,
    fragmentShader: shaders.fs.lookup
  });

  this.simulation.setUniforms(this.simulationUniforms);

  if (this.particlePhoto) {
    console.log('remove');
    scene.remove(this.particlePhoto);
  }

  this.particlePhoto = new THREE.PointCloud(geo, mat);
  this.particlePhoto.frustumCulled = false;
  // this.particlePhoto.position.set(randFloat(-3, 3), -11, 0);
  scene.add(this.particlePhoto);

  this.simulation.addBoundTexture(this.renderUniforms.t_pos, 'output');

  var texture = this.createPositionTexture(this.SIZE);
  this.simulation.reset(texture);
  this.ready = true;

  this.slideUp();
}

HapiField.prototype.slideUp = function() {
  var curProps = {
    x: this.particlePhoto.position.x,
    y: this.particlePhoto.position.y,
    z: this.particlePhoto.position.z
  };

  var endProps = {
    x: this.photoEndPosition.x,
    y: this.photoEndPosition.y,
    z: this.photoEndPosition.z,
  };

  var slideTween = new TWEEN.Tween(curProps).
  to(endProps, 1000).
  onUpdate(function() {
    this.particlePhoto.position.set(curProps.x, curProps.y, curProps.z);
  }.bind(this)).
  start();
}

HapiField.prototype.createPositionTexture = function(size) {

  var data = new Float32Array(size * size * 4);
  var j = 0;
  for (var x = 0; x < size; x++) {
    for (var y = size - 1; y >= 0; y--) {
      data[j] = x / size;
      data[j + 1] = y / size;
      data[j + 2] = 0;
      data[j + 3] = 0;
      j += 4;
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
    for (var y = 0; y < size; y++) {
      positions[j] = x / size;
      positions[j + 1] = y / size;

      colors[j] = this.imageData[c] / 255.0;
      colors[j + 1] = this.imageData[c + 1] / 255.0;
      colors[j + 2] = this.imageData[c + 2] / 255.0;

      c += 4;
      j += 3;
    }
  }

  var posA = new THREE.BufferAttribute(positions, 3);
  var colorA = new THREE.BufferAttribute(colors, 3)
  geo.addAttribute('position', posA);
  geo.addAttribute('color', colorA);


  return geo;

}
HapiField.prototype.update = function() {
  if (!this.ready) {
    return;
  }
  this.simulation.update();

}