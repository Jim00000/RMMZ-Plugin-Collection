#version 300 es
#define MAX_PARTICLES 400

precision highp float;

in vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uImg;
uniform vec4 outputFrame;
uniform vec2 positions[MAX_PARTICLES];
uniform int size;
uniform float uTime;
uniform float opacity[MAX_PARTICLES];

out vec4 outColor;  
 
mat2 scale(float scale)
{
    return mat2(
        1.0 / scale, .0, 
        0.0, 1.0 / scale
    );
}

mat2 rotate(float theta)
{
    return mat2(
        cos(theta), -sin(theta),
        sin(theta),  cos(theta)
    );
}

void main() 
{
    vec4 fragColor = texture(uSampler, vTextureCoord);
    outColor = fragColor;
    float theta = uTime * 180.0 / radians(180.0);
    theta = mod(theta, 90.0);

    for(int i = 0; i < size; i++){
        vec2 resolution = outputFrame.zw;
        vec2 coord = gl_FragCoord.xy;
        coord += resolution / 2.0;          // Reset to position(x = 0, y = 0)
        coord -= positions[i];              // Move to somewhere
        coord /= resolution.xy;           
        coord -= 0.5;
        coord *= scale(0.01);               // scale
        coord *= rotate(theta);             // rotate
        coord += 0.5;
        vec4 particleColor = texture(uImg, coord);
        outColor += particleColor * opacity[i];
    }
}