     var camera, renderer, scene, controls, clock;
     var wormhole, hapi_field, video_message;

     var audioMesh;
     var stream;
     var audio = new AudioController();

     // var userAudio = new UserAudio(audio.ctx, audio.gain);
     // Muting audio, so we don't have feedback
     audio.mute.gain.value = 0;

     var randFloat = THREE.Math.randFloat;


     var controlsEnabled = false;
     var controlsEnabled = true;

     var cameraSpeed = .01;



     // Setting up shaders
     var shaders = new ShaderLoader('shaders');

     shaders.shaderSetLoaded = function() {
       init();
       stream = new Stream('assets/across.mp3', audio.ctx, audio.gain);
       animate();
       stream.play();
     }

     shaders.load('vs-audio', 'audio', 'vertex');
     shaders.load('fs-audio', 'audio', 'fragment');
     shaders.load('ss-curl', 'sim', 'simulation');
     shaders.load('vs-lookup', 'lookup', 'vertex');
     shaders.load('fs-lookup', 'lookup', 'fragment');


     function init() {

       var w = window.innerWidth;
       var h = window.innerHeight;

       camera = new THREE.PerspectiveCamera(65, w / h, 0.1, 10000);
       camera.position.set(0, 0, 1)
       // camera.position.z = 10

       scene = new THREE.Scene();

       var dpr = window.devicePixelRatio || 1;
       renderer = new THREE.WebGLRenderer();
       renderer.setPixelRatio(dpr);
       renderer.setSize(window.innerWidth, window.innerHeight);

       document.body.appendChild(renderer.domElement);

       window.addEventListener('resize', onWindowResize, false);

       clock = new THREE.Clock();

       if (controlsEnabled) {
         controls = new THREE.TrackballControls(camera);
       }

       wormhole = new Wormhole();
       // hapi_field = new HapiField();
       video_message = new VideoMessage();


     }


     function animate() {

       requestAnimationFrame(animate);
       audio.update();
       wormhole.update
       // hapi_field.update();
       TWEEN.update();
       // camera.position.z -= cameraSpeed;

       renderer.render(scene, camera);

       if (controlsEnabled) {
         controls.update();
       }

     }


     function onWindowResize() {

       camera.aspect = window.innerWidth / window.innerHeight;
       camera.updateProjectionMatrix();

       renderer.setSize(window.innerWidth, window.innerHeight);

     }