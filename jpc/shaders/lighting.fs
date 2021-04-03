#version 300 es
precision highp float;

#define MAX_LIGHTS 32
#define DOWNWARD_LIGHT_INDEX 2
#define LEFTWARD_LIGHT_INDEX 4
#define RIGHTWARD_LIGHT_INDEX 6
#define UPWARD_LIGHT_INDEX 8

in vec2 vTextureCoord;

uniform sampler2D uSampler;

uniform int lightCount;
uniform int directions[MAX_LIGHTS];
uniform int types[MAX_LIGHTS];
uniform float pointRadius[MAX_LIGHTS];
uniform float globalIllumination;
uniform float FOV[MAX_LIGHTS]; // angle of spotlight
uniform float spotRadius[MAX_LIGHTS];
uniform float times[MAX_LIGHTS];
uniform vec2 positions[MAX_LIGHTS];
uniform vec3 colors[MAX_LIGHTS];

out vec4 outputColor;

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
vec2 getLightDir(const int idx) {
    switch(idx) {
        case UPWARD_LIGHT_INDEX:
            return vec2(0.0, 1.0);
        case DOWNWARD_LIGHT_INDEX:
            return vec2(0.0, -1.0);
        case LEFTWARD_LIGHT_INDEX:
            return vec2(1.0, 0.0);
        case RIGHTWARD_LIGHT_INDEX:
            return vec2(-1.0, 0.0);
        default:
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
float getAngle(const vec2 u, const vec2 v) {
    float magnitude = length(u) * length(v);
    float cos_theta = dot(u, v) / magnitude;
    float theta = acos(cos_theta);
    float degree = theta * 180.0 / radians(180.0); // radians to degree
    return degree;
}

// ------------------------------------------------------------------
// Generic 1D Noise by patriciogonzalezvivo
// Source : https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand(float n) {
    return fract(sin(n) * 43758.5453123);
}

float noise(float p) {
    float fl = floor(p);
    float fc = fract(p);
    return mix(rand(fl), rand(fl + 1.0), fc);
}

float motion(float utime, float frequency, float amplitude) {
    float noiseSum = 0.95;
    for(int i = 0; i < 4; i++) {
        noiseSum += noise(utime * frequency) * amplitude;
        frequency *= 2.0;
        amplitude *= 0.5;
    }
    return noiseSum;
}
// ------------------------------------------------------------------

float vibrate(float utime) {
    return motion(utime * 0.03, 4.0, 0.25);
}

bool isBitSet(const int value, const int which) {
    int bit = 1 << which;
    return (value & bit) == bit;
}

// ------------------------------------------------------------------
// Check whether the light type is point light
// ------------------------------------------------------------------
bool isPointLight(const int type) {
    return isBitSet(type, 0);
}

// ------------------------------------------------------------------
// Check whether the light type is spotlight (flash light)
// ------------------------------------------------------------------
bool isSpotLight(const int type) {
    return isBitSet(type, 1);
}

float calculatePointLightBrightness(const float dist, const float lightRadius, float vibration) {
    // Linear attenuations model
    //float brightness = smoothstep(0.0, 1.0, 1.0 - dist / lightRadius * vibration);

    // Exponential attenuations model
    float x = dist / lightRadius * vibration;
    float brightness = exp(-5.0 * pow(x, 1.2) * log(2.0 + pow(x, 1.8)));
    return brightness;
}

float calculateSpotLightBrightness(const float dist, const float lightRadius, const float theta, const float fov, float vibration) {
    float decay = pow(clamp(1.0 - theta / fov * vibration, 0.0, 1.0), 1.0);

    // Linear attenuations model
    //float brightness = smoothstep(0.0, 1.0, 1.0 - dist / lightRadius * vibration) * decay;

    // Exponential attenuations model
    float x = dist / lightRadius * vibration;
    float brightness = exp(-3.5 * pow(x, 2.4) * log(3.0 + pow(x, 2.8))) * decay;
    return brightness;
}

void main() {
    vec4 diffuseColor = texture(uSampler, vTextureCoord);
    vec3 finalColor;
    vec3 ambientColor = vec3(globalIllumination);
    vec2 pixelPos = gl_FragCoord.xy;

    for(int i = 0; i < lightCount; i++) {
        float dist = distance(positions[i], pixelPos + vec2(0.0, 24.0));
        float brightness = 0.0;
        float time = times[i];
        float vibration = vibrate(time);
        int type = types[i];

        // point light
        if(isPointLight(type) == true && dist < pointRadius[i]) {
            brightness += calculatePointLightBrightness(dist, pointRadius[i], vibration);
        }

        // spot light
        if(isSpotLight(type) == true) {
            vec2 lightDir = normalize(positions[i] - pixelPos + vec2(0.0, -24.0)) * spotRadius[i];
            vec2 spotDir = getLightDir(directions[i]) * spotRadius[i];
            float theta = getAngle(lightDir, spotDir);

            if(theta <= FOV[i] && dist < spotRadius[i]) {
                brightness += calculateSpotLightBrightness(dist, spotRadius[i], theta, FOV[i], vibration);
            }
        }

        // Original method. With this approach, the light verge is quite explicit if multiple light sources overlap
        ambientColor += brightness * colors[i];
        // Limit the brightness to avoid bright light effect
        //mixedLightColor = min(mixedLightColor, vec3(1.2, 1.2, 1.2));

        // Use this approach to make light verge smoother if multiple light sources overlap.
        //mixedLightColor = mix(mixedLightColor, ambientColor[i], pow(totalBrightness, 1.1));
    }

    finalColor = diffuseColor.xyz * ambientColor;

    outputColor = vec4(finalColor, diffuseColor.a);
}