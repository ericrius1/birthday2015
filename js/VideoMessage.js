var VideoMessage = function() {

  this.videoElement = document.createElement('video');
  this.videoElement.id = "video";
  this.videoElement.src = "assets/bday.mp4";
  this.videoElement.load();

  this.videoElement.addEventListener('loadeddata', function() {
    this.initialize();
  }.bind(this), false)
}

VideoMessage.prototype.initialize = function() {
  console.log("heeey");
  var geo = new THREE.PlaneGeometry(1.3, 1);

  this.videoTexture = new THREE.Texture(this.videoElement);
  this.videoElement.play();
  var mat = new THREE.MeshBasicMaterial({
    map: this.videoTexture
  });
  var mesh = new THREE.Mesh(geo, mat);
  this.ready = true;
  scene.add(mesh);

}

VideoMessage.prototype.update = function() {

  if(!this.ready) {
    return;
  }

  this.videoTexture.needsUpdate = true;

}