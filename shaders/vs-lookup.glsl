
uniform sampler2D t_audio;
uniform sampler2D t_pos;

attribute vec3 color;

varying vec3 vColor;

void main(){

  vColor = color;
  vec4 pos = texture2D( t_pos , position.xy );

  vec3 dif = cameraPosition - pos.xyz;

  vec4 audio = texture2D(t_audio, uv);
  float intensity = length(audio);
  float pointSize = intensity * 5.0;
  pointSize = max(pointSize, 0.5);
  pointSize = min(pointSize, 50.0/length(dif));
  gl_PointSize = pointSize;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( pos.xyz , 1. );


}
