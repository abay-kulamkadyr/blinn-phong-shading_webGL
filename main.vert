#version 300 es

// TODO: Define the inputs. The first input
// will be the position and the second will be
// the color.
layout(location = 0) in vec3 position;
layout(location = 1)  in vec3 normal;

// TODO: Define the outputs. Since the output for the vertex
// position is a built-in variable, we just need to define
// an output for the color. Note that the default interpolation 
// qualifier is smooth, so it is not neccessary to write.
// smooth out vec4 vertexColor;

// TODO: Define a uniform mat4 variable for the
// transformation matrix.
uniform mat4 world_matrix; 
uniform mat4 view_matrix;
uniform mat4 bunny_inverse; 

uniform vec3 point_light_pos; 
uniform vec3 spot_light_pos; 


uniform mat4 perspective_proj_matrix;
uniform vec3 eye_pos; 

smooth out vec3 out_normals; 
out vec3 vertex_to_cube;
out vec3 vertex_to_cone;
out vec3 vertex_to_eye;

void main() {

   
    out_normals =  normal;

    vec3 vertex_world = (world_matrix * vec4(position, 1.0)).xyz;
    
    vertex_to_cube = point_light_pos - vertex_world;
    vertex_to_cone = spot_light_pos - vertex_world;
    vec3 eye = vec3(0, 0, 10);
    vertex_to_eye = eye - vertex_world;
    
    gl_Position = perspective_proj_matrix * view_matrix * world_matrix * vec4(position, 1.0f);


}