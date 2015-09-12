uniform sampler2D t_audio;
uniform sampler2D t_diffuse;

varying float vAudioLookup;
varying float vDisplacement;

varying vec3 vModelPosition;

void main(){

  vec4 audio = texture2D( t_diffuse , vec2( vAudioLookup , 0. ) );
  
  // We are also going to color our fragments
  // based on the color of the audio
  // vec3 col = audio.xyz;
  vec3 col = vec3(mix(0.0, 0.2, vDisplacement));
  col *= audio.xyz;  
  col = clamp(col, -.3, 1.0);
  // col.x = 0.0;
  // col.z += 0.2;

  float red = mix(0.0, 1.0, (vModelPosition.y)/100.0);
  col.x += red;

  gl_FragColor = vec4( col , 1. );

}
