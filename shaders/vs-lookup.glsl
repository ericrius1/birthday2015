
uniform sampler2D t_audio;
uniform sampler2D t_pos;

attribute vec3 color;

varying vec3 vColor;

void main(){

  vColor = color;
  vec4 pos = texture2D( t_pos , position.xy );

  vec3 dif = cameraPosition - pos.xyz;
  
  gl_PointSize = min( 5. ,  50. / length( dif ));
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos.xyz , 1. );


}
