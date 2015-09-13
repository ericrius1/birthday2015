var VideoMessage = function(field) {
  this.field = field;
  this.videoElement = document.createElement('video');
  this.videoElement.id = "video";
  this.videoElement.src = "assets/bday.mp4";
  this.videoElement.load();

  this.videoElement.addEventListener('canplaythrough', function() {
    setTimeout(function() {
      this.initialize();
    }.bind(this), 2000);
  }.bind(this), false)

  this.videoElement.addEventListener('ended', function() {
    console.log("ENDED VIDEO");
    this.field.simulationUniforms.speed.value = 0.0001;

    var curProps = {
      opacity: this.mat.opacity
    };

    var endProps = {
      opacity:0.0
    };


    var fadeTween = new TWEEN.Tween(curProps).
    to(endProps, 4000).
    easing(TWEEN.Easing.Cubic.Out).
    onUpdate(function() {
      this.mat.opacity = curProps.opacity
    }.bind(this)).start();

  }.bind(this))
}


VideoMessage.prototype.initialize = function() {
  var geo = new THREE.PlaneGeometry(1.3, 1);

  this.videoTexture = new THREE.Texture(this.videoElement);
  this.videoElement.play();
  this.mat = new THREE.MeshBasicMaterial({
    map: this.videoTexture,
    transparent: true,
    opacity: 0.0
  });
  var mesh = new THREE.Mesh(geo, this.mat);
  this.ready = true;
  scene.add(mesh);
  mesh.position.z -= 1;
  mesh.position.y += 0.5
  mesh.position.x -= 1;


  var curProps = {
    opacity: this.mat.opacity
  };

  var endProps = {
    opacity: 0.7
  };


  var fadeTween = new TWEEN.Tween(curProps).
  to(endProps, 2000).
  onUpdate(function() {
    this.mat.opacity = curProps.opacity
  }.bind(this)).start();

}

VideoMessage.prototype.update = function() {

  if (!this.ready) {
    return;
  }

  this.videoTexture.needsUpdate = true;

}