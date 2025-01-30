#version 300 es

precision mediump float;
//inputs from the vertex shader
in  vec3 out_normals;
in  vec3 vertex_to_cube;
in  vec3 vertex_to_cone;
in  vec3 vertex_to_eye;

uniform  vec3 spot_light_vector;
uniform  vec3 La; 
uniform  vec3 Ld;
uniform  vec3 Ls; 
uniform  vec3 color; //default light color

uniform  float Ka; //ambient 
uniform  float Kd; //diffuse
uniform  float Ks; // specular
uniform  float alpha; 
uniform float max_angle;
out  vec4 outputColor;

void main() {
    

    vec3 normal = normalize(out_normals);

    //light Source 1 
    vec3 frag_point_vec = normalize(vertex_to_cube);
    float pointLight = max(dot(normal, frag_point_vec), 0.0);
    
    //light Source 2
    vec3  frag_spot_vec = normalize(vertex_to_cone);
    float cut_off_angle = dot(frag_spot_vec, -spot_light_vector);
    float deffuseTermPoint = max(dot(normal, frag_point_vec), 0.0);
    float specularPoint = 0.0;
    float deffuseTermSpotL = max(dot(normal, frag_spot_vec), 0.0);

    if(deffuseTermPoint > 0.0) {
        
        float dotProd = dot(normal, frag_point_vec);
        dotProd *=  2.0;

        vec3 scalar = vec3(dotProd, dotProd, dotProd);
        
        vec3 R = scalar * normal;
        R -= frag_point_vec; 

        vec3 V = normalize(vertex_to_eye); 
        float specularTerm = max(dot(R, V), 0.0);
        specularPoint = pow(specularTerm, alpha);
    }
    
    float spotLight = 0.0;
    float specularSpotL = 0.0;

    if (cut_off_angle >= max_angle) {
        spotLight = max(dot(normal, frag_spot_vec), 0.0);
        if(deffuseTermSpotL > 0.0) {
            
            float dotProd = dot(normal, frag_spot_vec);
            dotProd *=  2.0;
            vec3 scalar = vec3(dotProd, dotProd, dotProd);
            vec3 R = scalar * normal;
            R -= frag_spot_vec; 
            vec3 V = normalize(vertex_to_eye); 
            float specularTerm = max(dot(R, V), 0.0);
            specularSpotL = pow(specularTerm, alpha);
        }
    }
    
    float finalLight = min(pointLight + spotLight, 1.0); 
    
    outputColor = vec4(Ka * La +
                      Kd * (deffuseTermPoint + deffuseTermSpotL) * Ld +
                      Ks * (specularPoint + specularSpotL) * Ls, 1.0); 
    outputColor.rgb *= finalLight;

}