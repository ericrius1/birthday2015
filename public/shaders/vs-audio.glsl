uniform sampler2D t_audio;
uniform float time;


varying float vAudioLookup;
varying float vDisplacement;

varying vec3 vModelPosition;

$simplex

//vec3 getPos( vec3 position 
void main(){

  
  float displacement = snoise( vec4( position * 10., time * .01 ) ) * 15.0;
  vDisplacement = displacement;

  vAudioLookup =  abs( displacement ); //abs( normal.x * normal.y * normal.z * 3. );
  // Here we sample the audio from a texture that we will
  // be creating on the cpu
  vec4 audio = texture2D( t_audio , vec2( vAudioLookup , 0. ));



  // To visualize the audio, we will displace the position
  // by a value based on the audio, along the normal
  vec3 pos = position + .07 * displacement * length( audio * 0.5)  * (normal * -1.0);
  vec4 worldPos =  projectionMatrix * modelViewMatrix * vec4( pos , 1.);

  vModelPosition = position;

  gl_Position = worldPos;

}
