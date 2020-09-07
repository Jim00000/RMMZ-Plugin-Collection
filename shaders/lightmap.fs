#define MAX_LIGHTS 32
precision highp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec2 lightsrc[MAX_LIGHTS];
uniform vec3 ambientColor[MAX_LIGHTS];
uniform float lightRadius;
uniform float globalIllumination;
uniform int lightSrcSize;

void main() 
{
    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);
    vec3 finalColor;
    vec3 mixedLightColor = vec3(globalIllumination);

    for(int i = 0; i < MAX_LIGHTS; i++) {
        // Workaround. Bypass 'loop index cannot be compared with non-constant expression' issue.
        if (i >= lightSrcSize) { break; }
        float dist = distance(lightsrc[i], gl_FragCoord.xy);
        float dd = lightRadius - dist;
        if(dd > 0.0) {
            vec2 toLight = abs(lightsrc[i] - gl_FragCoord.xy);
            float brightness = clamp(dot(normalize(toLight), gl_FragCoord.xy), 0.0, 1.0);
            brightness *= clamp(1.0 - (length(toLight) / lightRadius), 0.0, 1.0);
            mixedLightColor += brightness * ambientColor[i];
        }
    }

    finalColor = diffuseColor.xyz * mixedLightColor;

    gl_FragColor = vec4(finalColor, diffuseColor.a);
}