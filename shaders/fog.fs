precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec3 fogColor;
uniform float density;
uniform float fMoveX;
uniform float fMoveY;

//==========================================================================================
// Simplex 2D noise
// Source : https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
//

vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
  + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
    dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

//==========================================================================================

void main() 
{
    vec4 fragColor = texture2D(uSampler, vTextureCoord);
    float sum = 0.0;
    float f = 1.4;
    float w = 0.9;
    // Fractal Brownian Motion (FBM)
    for(int i = 0; i < 8; i++) { // octave = 8
        vec2 pos = vTextureCoord.xy - vec2(fMoveX, fMoveY);
        sum += snoise(pos * f) / w;
        f *= 2.0;
        w *= 2.5;
    }

    float factor = clamp(sum, 1.0 - density, 1.0);
    vec3 finalColor;
    
    if(factor == 1.0) {
      finalColor = fragColor.xyz;
    } else {
      finalColor = mix(fogColor, fragColor.xyz, factor);
    }

    // Improved Phase Function 
    // From "Real-time Rendering of Dynamic Clouds"
    // float g = 0.2, theta = 0.98;
    // float numerator = 1.5 * (1.0 - g * g) * (1.0 + pow(cos(theta), 2.0));
    // float denominator = (2.0 + g * g) * (1.0 + g * g - 2.0 * g * cos(theta));
    // finalColor = finalColor * numerator / denominator;

    gl_FragColor = vec4(finalColor, fragColor.a);
}