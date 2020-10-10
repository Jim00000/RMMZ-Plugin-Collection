#define MAX_LIGHTS 32
#define DOWNWARD_LIGHT_INDEX 2
#define LEFTWARD_LIGHT_INDEX 4
#define RIGHTWARD_LIGHT_INDEX 6
#define UPWARD_LIGHT_INDEX 8
precision highp float;

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform vec2 lightsrc[MAX_LIGHTS];
uniform vec3 ambientColor[MAX_LIGHTS];
uniform float lightRadius[MAX_LIGHTS];
uniform float globalIllumination;
uniform float perspective[MAX_LIGHTS]; // angle of spotlight
uniform float fSpotlightRadius[MAX_LIGHTS];
uniform float uTime[MAX_LIGHTS];
uniform int lightSrcSize;
uniform int lightDirIdx[MAX_LIGHTS];
uniform int lightType[MAX_LIGHTS];

// ------------------------------------------------------------------
// Get unit vector for up, down, left and right direction
// ------------------------------------------------------------------
// Input     : integer idx
// Output    : vec2 unit vector
// Note      :
// lightDirIdx = 2 ---> Down
// lightDirIdx = 4 ---> Left
// lightDirIdx = 6 ---> Right
// lightDirIdx = 8 ---> Up
// These direction definition follows RPG Maker MZ's Spec.
vec2 getLightDir(int idx) 
{
    if(idx == UPWARD_LIGHT_INDEX) {
        // upward unit vector
        return vec2(0.0, 1.0);
    } else if(idx == DOWNWARD_LIGHT_INDEX) {
        // downward unit vector
        return vec2(0.0, -1.0);
    } else if(idx == LEFTWARD_LIGHT_INDEX) {
        // leftward unit vector
        return vec2(1.0, 0.0);
    } else if(idx == RIGHTWARD_LIGHT_INDEX) { 
        // rightward unit vector
        return vec2(-1.0, 0.0);
    } else {
        // FIXME: any way to throw exception ?
        return vec2(0.0, 0.0);
    }
}

// ------------------------------------------------------------------
// Get angle between two vector
// ------------------------------------------------------------------
// Input     : vectors u, v
// Output    : angle in degree
// Note      : cosθ = dot(Va, Vb) / (magnitude(Va) * magnitude(Vb))
// reference : https://onlinemschool.com/math/library/vector/angl/
float getAngle(vec2 u, vec2 v) 
{
    float magnitude = length(u) * length(v);
    float cos_theta = dot(u, v) / magnitude;
    float theta = acos(cos_theta);
    float degree = theta * 180.0 / radians(180.0); // radians to degree
    return degree;
}

// ------------------------------------------------------------------
// Generic 1D Noise by patriciogonzalezvivo
// Source : https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(float n)
{
    return fract(sin(n) * 43758.5453123);
}

float noise(float p)
{
	float fl = floor(p);
    float fc = fract(p);
	return mix(rand(fl), rand(fl + 1.0), fc);
}
	
float motion(float utime, float frequency, float amplitude)
{
    float noiseSum = 0.95;
    for(int i = 0; i < 4; i++) { 
        noiseSum += noise(utime * frequency) * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return noiseSum;
}
// ------------------------------------------------------------------

float vibrate(float utime)
{
    return motion(utime * 0.006, 4.0, 0.25);
}

// ------------------------------------------------------------------
// Check whether the light type is point light
// ------------------------------------------------------------------
int isPointLight(int type) 
{
    if(type == 1) { // 0b01
        return 1;
    } else if(type == 3) { // 0b11
        return 1;
    } else {
        return 0;
    }
}

// ------------------------------------------------------------------
// Check whether the light type is spotlight (flash light)
// ------------------------------------------------------------------
int isSpotLight(int type) 
{
    if(type == 2) { // 0b10
        return 1;
    } else if(type == 3) { // 0b11
        return 1;
    } else {
        return 0;
    }
}

void main() 
{
    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);
    vec3 finalColor;
    vec3 mixedLightColor = vec3(globalIllumination);
    vec2 pixelPos = gl_FragCoord.xy;

    for(int i = 0; i < MAX_LIGHTS; i++) {
        // Workaround. Bypass 'loop index cannot be compared with non-constant expression' issue.
        if (i >= lightSrcSize) { break; }
        float dist = distance(lightsrc[i], pixelPos + vec2(0.0, 24.0));
        float dd = lightRadius[i] - dist;
        float totalBrightness = 0.0;
        float magnitude = 1.3;
        float time = uTime[i];
        float vibration = vibrate(time);
        int type = lightType[i];

        // point light
        if(isPointLight(type) == 1 && dd >= 0.0) {
            vec2 toLight = abs(lightsrc[i] - pixelPos + vec2(0.0, -24.0));
            float brightness = clamp(dot(normalize(toLight), pixelPos), 0.0, 1.0);
            brightness *= clamp(1.0 - (length(toLight) / lightRadius[i] * vibration), 0.0, 1.0) * magnitude;
            totalBrightness += brightness;
        }

        // spotlight (flash light)
        if(isSpotLight(type) == 1) {
            vec2 lightDir = normalize(lightsrc[i] - pixelPos + vec2(0.0, -24.0)) * fSpotlightRadius[i];
            vec2 spotDir = getLightDir(lightDirIdx[i]) * fSpotlightRadius[i];
            float theta = getAngle(lightDir, spotDir);
            if(abs(dd) >= 0.0 && theta <= perspective[i] * vibration) {
                vec2 toLight = abs(lightsrc[i] - pixelPos  + vec2(0.0, -24.0));
                float brightness = clamp(dot(normalize(toLight), pixelPos), 0.0, 1.0) * clamp(1.0  - pow((theta / (perspective[i] * vibration)), 1.2), globalIllumination, 1.0);
                brightness *= clamp(1.0 - (length(toLight) / fSpotlightRadius[i]), 0.0, 1.0) * magnitude;
                totalBrightness += brightness;
            } 
        }

        mixedLightColor += clamp(totalBrightness, globalIllumination, 1.0) * ambientColor[i];
    }

    finalColor = diffuseColor.xyz * mixedLightColor;

    gl_FragColor = vec4(finalColor, diffuseColor.a);
}