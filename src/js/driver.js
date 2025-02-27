/*
    Initialization
*/

// The WebGL context.
/** @type {WebGLRenderingContext} */
var gl;
var canvas;
//variables for vertices and faces
var vertices, faces, verticesArray, indices;

var bunny_indices_count;
var bunny_vertices_count;
//translation matrix and corresponding variables
var dirs_to_translate, dir_dx, dir_dy, dir_z;

//rotation matrix and corresponding variables
var angles_to_rotate, angleX, angleY;

//variables for point light
const cube_center = [5, 5, 0];
var cube_vertices,cube_indices,cube_angle_to_rotate, cube_stop_rotate_signal; 

//variables for spotlight
const cone_center = [0, 4, 2];
const cone_points_to = [0, 0, 0];
var  cone_light_dir, cone_cut_off_angle, cone_vertices, cone_indices, isConeRotatingLeft, cone_angle_curr, cone_stop_rotate_signal; 

var normals; 

// Buffer objects
var position_buffer;
var normals_buffer;
var index_buffer; 

// Sets up the canvas and WebGL context.
function initializeContext() {
  // TODO: Get and store the webgl context from the canvas    
  canvas = document.getElementById('myCanvas');
  gl = canvas.getContext('webgl2');

  // TODO: Determine the ratio between physical pixels and CSS pixels
  const pixelRatio = window.devicePixelRatio || 1;

  // TODO: Set the width and height of the canvas
  // using clientWidth and clientHeight
  canvas.width = pixelRatio * canvas.clientWidth;
  canvas.height = pixelRatio * canvas.clientHeight;

  // TODO: Set the viewport size
  gl.viewport(0, 0, canvas.width, canvas.height);

  // TODO: Set the clear color to white.
  gl.clearColor(1, 1, 1, 1);
  // TODO: Set the line width to 1.0.
  gl.lineWidth(1.0);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  logMessage('WebGL initialized.');
}


function convertFacesToIndices()
{
  var ret = [];
  for (var i = 0; i < faces.length; i++)
  {
    ret.push(faces[i][0] - 1, faces[i][1] - 1, faces[i][2] - 1);   
  }
  //console.log(ret);
  return ret;
}

function convertVectorToArray(vect)
{
  var ret = [];
  for (var i = 0; i < vertices.length; i++)
  {
    ret.push(vect[i][0], vect[i][1], vect[i][2]);   
  }
  return ret;
}

async function setup() {
  // TODO: Initialize the context.
  initializeContext();

  // Set event listeners
  setEventListeners(canvas);

  //Initializing default variables
  BunnyInit();
    
  // TODO: Create vertex buffer data.
  createBuffers();

  // TODO: Load shader files
  await loadShaders();

  // TODO: Compile the shaders
  compileShaders();

  // TODO: Set the uniform variables
  setUniformVariablesAndDraw();

  // TODO: Create vertex array objects
  createVertexArrayObjects();

  // TODO: Draw!
  render();

};
//Initializes all variables 
function BunnyReset()
{
  dir_dx = 0;
  dir_dy = 0; 
  dir_z = 0;
  dirs_to_translate = [dir_dx, dir_dy, dir_z];
  isLeftPressed = false;
  isRightPressed = false; 
  angleX = 0;
  angleY = 0; 
  angles_to_rotate = [angleX, angleY];
}


function BunnyInit()
{
  vertices = get_vertices(); 
  faces = get_faces(); 
  /* Populating array with the bunny's model */
  verticesArray = convertVectorToArray(vertices);
  bunny_vertices_count = verticesArray.length;
  // console.log("Vertivces array" + verticesArray.length);
  indices = convertFacesToIndices(); 
  bunny_indices_count = indices.length; 
  normals = computeAverageNormals(); 
  normals = convertVectorToArray(normals);
    
  /* Populating array with the cube's model */
  cube_angle_to_rotate = 0;
  cube_stop_rotate_signal = false; 
  cube_vertices = constructCubeVertices(cube_center, 0.5);
  cube_indices = constructCubeIndices();

  var cube_norms = padNormsWith0(cube_vertices);

  normals = normals.concat(cube_norms);
  verticesArray = verticesArray.concat(cube_vertices);
  indices = indices.concat(cube_indices);
    
  /* Populating array with the cone's model */
  isConeRotatingLeft = false;
  cone_stop_rotate_signal = false;
  cone_angle_curr = 0;
  cone_light_dir = subtract(vec4(cone_points_to, 1.0), vec4(cone_center, 1.0)); 
    
  cone_vertices = constructConeVertices(cone_center, 0.2);
  cone_indices = constructConeIndices();
  var cone_norms = padNormsWith0(cone_vertices);

  normals = normals.concat(cone_norms);    
  verticesArray = verticesArray.concat(cone_vertices);
  indices = indices.concat(cone_indices);
  BunnyReset();
}

window.onload = setup;
console.log();

// Creates buffers using provided data.
function createBuffers() {
  //Setting up a buffer for vertex positions 
  position_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
  gl.bufferData(gl.ARRAY_BUFFER,
    new Float32Array(verticesArray),
    gl.STATIC_DRAW);
  //Setting up a buffer for normals
  normals_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer);
  gl.bufferData(gl.ARRAY_BUFFER, 
    new Float32Array(normals),
    gl.STATIC_DRAW);
  //Setting up a buffer for indices 
  index_buffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint32Array(indices),
    gl.STATIC_DRAW);
  logMessage('Created buffers.');
}



// Sets the uniform variables in the shader program
function setUniformVariablesAndDraw() {

    
  const identity_matrix = mat4();        
  var x_axis = [1, 0, 0];
  var y_axis = [0, 1, 0];
  // Bind the VAO
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);


  // TODO: Tell the current rendering state to use the shader program
  gl.useProgram(prog);

  /*************Transforming the bunny's model ***************************/ 
  //Get locations of the uniform variables to pass into vertex shader
  var world_matrix_loc = gl.getUniformLocation(prog, 'world_matrix');
  var view_matrix_loc = gl.getUniformLocation(prog,'view_matrix');
  var point_light_pos_loc = gl.getUniformLocation(prog, 'point_light_pos');
  var spot_light_pos_loc = gl.getUniformLocation(prog, 'spot_light_pos');
  var perspective_proj_matrix_loc = gl.getUniformLocation(prog, 'perspective_proj_matrix');
  var eye_pos_loc = gl.getUniformLocation(prog, 'eye_pos');
  var spot_light_vector_loc = gl.getUniformLocation(prog, 'spot_light_vector'); 
  var color = gl.getUniformLocation(prog, 'color');
  var max_angle_loc = gl.getUniformLocation(prog, 'max_angle');
    
  var max_angle = radians(10);
  gl.uniform1f(max_angle_loc, Math.cos(max_angle));  
  gl.uniform4fv(color, [1.0, 1.0, 1.0, 1.0]);
  gl.uniform3fv(spot_light_vector_loc, cone_light_dir); 
    
  //Get locations of the uniform variables to pass into the fragment shader
  var La_loc = gl.getUniformLocation(prog, 'La');
  var Ld_loc = gl.getUniformLocation(prog, 'Ld');
  var Ls_loc = gl.getUniformLocation(prog, 'Ls');
  gl.uniform3fv(La_loc, [0.1, 0.1, 0.1]);
  gl.uniform3fv(Ld_loc, [0.9, 0.60, 0.1]);
  gl.uniform3fv(Ls_loc, [1.0, 1.0, 1.0]);


  var Ka_loc = gl.getUniformLocation(prog, 'Ka');
  var Kd_loc = gl.getUniformLocation(prog, 'Kd');
  var Ks_loc = gl.getUniformLocation(prog, 'Ks');

  gl.uniform1f(Ka_loc,[0.9]); // Ambient reflection coefficient
  gl.uniform1f(Kd_loc, [1.0]); // Diffuse reflection coefficient
  gl.uniform1f(Ks_loc, [1.0]); // Specular reflection coefficient

  var alpha = gl.getUniformLocation(prog, 'alpha');
  gl.uniform1f(alpha, 200.0); 
  gl.uniform3fv(spot_light_pos_loc, [0, 4, 2]);

  /*************************************Drawing the bunny model*************************************/
  var bunny_matrix = identity_matrix; //identity matrix 

  //rotating the model 
  bunny_matrix = rotate(angles_to_rotate[0], x_axis);
  bunny_matrix = mult(bunny_matrix, rotate(angles_to_rotate[1], y_axis));
  //translating the model 
  bunny_matrix = mult(bunny_matrix, translate(dirs_to_translate[0], dirs_to_translate[1], dirs_to_translate[2]));
  gl.uniformMatrix4fv(world_matrix_loc, false, flatten(bunny_matrix));
  gl.drawElements(gl.TRIANGLES,                           //mode
    bunny_indices_count,                         //count
    gl.UNSIGNED_INT,                        //type
    0);   
    
  /*****************************************Drawing the cube***************************************/
  if(!cube_stop_rotate_signal) {
    cube_angle_to_rotate += 0.5; 
  }
  var cube_matrix = identity_matrix;
  cube_matrix = mult(cube_matrix, rotate(cube_angle_to_rotate, y_axis));
  var cube_new_pos = matrixVectorMult(cube_matrix, vec4(cube_center));
  gl.uniform3fv(point_light_pos_loc, (vec3(cube_new_pos)));
  gl.uniformMatrix4fv(world_matrix_loc, false, flatten(cube_matrix));
  gl.drawElements(gl.LINES, 
    cube_indices.length,
    gl.UNSIGNED_INT, 
    (4 * bunny_indices_count));
    
    
  /*******************************************Drawing the cone************************************/
  if(!cone_stop_rotate_signal){
    if(isConeRotatingLeft) {
      cone_angle_curr += 1; 
      if(cone_angle_curr >= 90) {
        isConeRotatingLeft = false; 
      }
    } else {
      cone_angle_curr -= 1;
      if(cone_angle_curr <= -90) {
        isConeRotatingLeft = true; 
      }
    }
  }
  //1st translate,  2rd rotate around y, 3rd translate back
  var cone_matrix = identity_matrix;
  cone_matrix = mult(cone_matrix, mult(mat4(), translate(0, 4, 2)));          //translate back 
  cone_matrix = mult(cone_matrix, rotate(cone_angle_curr, y_axis));           //apply rotation
  cone_matrix = mult(cone_matrix, mult(mat4(), translate(0, -4, -2)));        //translate to origin
  var new_light_dir = matrixVectorMult(cone_matrix, vec4(cone_light_dir));
  gl.uniform3fv(spot_light_vector_loc, normalize(vec3(new_light_dir)));
  gl.uniformMatrix4fv(world_matrix_loc, false, flatten(cone_matrix));
  gl.drawElements(gl.LINES, 
    cone_indices.length,
    gl.UNSIGNED_INT, 
    (4 * (bunny_indices_count + cube_indices.length))
  );

  //Positioning the camera and setting up the view matrix 
  var eye = vec3(0, 0, 10);
  gl.uniform3fv(eye_pos_loc, eye);
  var target = vec3(0, 0, 0);
  var up = vec3(0, 1, 0);
  var view_matrix = lookAt(eye, target, up);
  gl.uniformMatrix4fv(view_matrix_loc, false, flatten(view_matrix));
    
  //Setting up the projection matrix 
  var aspect = canvas.width / canvas.height;
  var projection_matrix =  perspective(60, aspect, 1.0, 100);
  gl.uniformMatrix4fv(perspective_proj_matrix_loc, false, flatten(projection_matrix));
       
}

// Handle for the vertex array object
var vao;

// Creates VAOs for vertex attributes
function createVertexArrayObjects() {

  // Create vertex array object
  vao = gl.createVertexArray();
  // Bind vertex array so we can modify it
  gl.bindVertexArray(vao);

  // Get shader location of the position vertex attribute.
  var pos_idx = gl.getAttribLocation(prog, 'position');
  // Bind the position buffer again
  gl.bindBuffer(gl.ARRAY_BUFFER, position_buffer);
  // Specify the layout of the data using vertexAttribPointer.
  gl.vertexAttribPointer(pos_idx, 3, gl.FLOAT, false, 0, 0);
  // Enable this vertex attribute.
  gl.enableVertexAttribArray(pos_idx);
    
    
  var norm_idx = gl.getAttribLocation(prog, 'normal');
  gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer);
  gl.vertexAttribPointer(norm_idx, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(norm_idx);
  // Unbind array to prevent accidental modification.
  gl.bindVertexArray(null);
  logMessage('Created VAOs.');

}

// Draws the vertex data.
function render() {
  // Clear the screen (for COLOR_BUFFER_BIT)
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.clear(gl.DEPTH_BUFFER_BIT);
  // Set the rendering state to use the shader program
  gl.useProgram(prog);
  // Bind the VAO
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  setUniformVariablesAndDraw();
  // Call this function repeatedly with requestAnimationFrame.
  requestAnimationFrame(render);
}


function matrixVectorMult(matrix, vector)
{
  var ret = [];
  for (i = 0; i< matrix.length; i++){
        
    var sum = 0;
    for (j = 0; j< vector.length; j++) {
      sum += matrix[i][j] * vector[j];
    }
    ret.push(sum);
  }
  return ret;

}
function computeAverageNormals ()
{
  var res = [];
  var averageNorms = vertices.map(each =>{
    return vec3(0, 0, 0);
  });

  
  faces.forEach(face => {
    var vertex1 = vertices[face[0] -1];
    var vertex2 = vertices[face[1] -1];
    var vertex3 = vertices[face[2] -1];

    var edge1 = subtract(vertex2, vertex1);
    var edge2 = subtract(vertex3, vertex1);

    var surface_norm = cross(edge1, edge2);
        
    averageNorms[face[0] - 1] = add(averageNorms[face[0] - 1], surface_norm);
    averageNorms[face[1] - 1] = add(averageNorms[face[1] -1], surface_norm);
    averageNorms[face[2] - 1] = add(averageNorms[face[2] -1], surface_norm);
  });
  

  for(var i = 0;i < averageNorms.length; i++)
  {
    averageNorms[i] = normalize(averageNorms[i]);
  }
   
  return averageNorms;
}
function padNormsWith0(vertices_array)
{
  var ret = [];
  for (var i = 0; i< vertices_array.length;i++)
  {
    ret.push([0.0, 0.0, 0.0]);
  }

  return ret; 
}
function logMessage(message) {
  document.getElementById('messageBox').innerText += `[msg]: ${message}\n`;
}

function logError(message) {
  document.getElementById('messageBox').innerText += `[err]: ${message}\n`;
}

function logObject(obj) {
  let message = JSON.stringify(obj, null, 2);
  document.getElementById('messageBox').innerText += `[obj]:\n${message}\n\n`;
}
