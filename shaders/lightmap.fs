precision highp float;

varying vec2 vTextureCoord;
uniform sampler2D uSampler;
uniform vec2 lightsrc;
uniform float radius;
uniform float minfactor;

void main() 
{
    vec4 diffuseColor = texture2D(uSampler, vTextureCoord);
    float dist = distance(lightsrc, gl_FragCoord.xy);
    vec3 finalColor;
    float dd = radius - dist;
    if(dd > 0.0) {
        finalColor = diffuseColor.xyz * clamp(log(1.01 + pow(dd / radius, 2.2)), minfactor, 1.0);
        // finalColor = diffuseColor.xyz * clamp(dd / radius, 0.0, 1.0);
    } else {
        finalColor = diffuseColor.xyz * minfactor;
    }
    
    gl_FragColor = vec4(finalColor, diffuseColor.a);
}