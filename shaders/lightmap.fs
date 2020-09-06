#define MAX_LIGHTS 32
precision highp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec2 lightsrc[MAX_LIGHTS];
uniform float radius;
uniform float globalIllumination;
uniform int lightSrcSize;

void main() 
{
    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);
    vec3 finalColor;
    float factor = 0.0;
    for(int i = 0; i < MAX_LIGHTS; i++) {
        // Workaround. Bypass 'loop index cannot be compared with non-constant expression' issue.
        if (i >= lightSrcSize) { break; }
        float dist = distance(lightsrc[i], gl_FragCoord.xy);
        float dd = radius - dist;
        if(dd > 0.0) {
            factor += log(1.00 + pow(dd / radius, 1.8));
        }
    }
    finalColor = diffuseColor.xyz * clamp(factor, globalIllumination, 1.0);
    gl_FragColor = vec4(finalColor, diffuseColor.a);
}