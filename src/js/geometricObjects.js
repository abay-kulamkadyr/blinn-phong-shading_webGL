function constructCubeVertices(cube_ctr, edge_length)
{
    var radius = edge_length/2;
    var x_coor = cube_ctr[0];
    var y_coor = cube_ctr[1];
    var z_coor = cube_ctr[2];
   
    return [
        x_coor + radius, y_coor + radius, z_coor + radius, //0
        x_coor + radius, y_coor + radius, z_coor - radius, //1
        x_coor + radius, y_coor - radius, z_coor - radius, //2
        x_coor + radius, y_coor - radius, z_coor + radius, //3
        x_coor - radius, y_coor + radius, z_coor + radius, //4
        x_coor - radius, y_coor + radius, z_coor - radius, //5  
        x_coor - radius, y_coor - radius, z_coor - radius, //6   
        x_coor - radius, y_coor - radius, z_coor + radius, //7          
    ];
}
function constructCubeIndices()
{

    return [
        vertices.length + 0, vertices.length + 1, 
        vertices.length + 1, vertices.length + 2, 
        vertices.length + 2, vertices.length + 3, 
        vertices.length + 3, vertices.length + 0, 
        vertices.length + 4, vertices.length + 5, 
        vertices.length + 5, vertices.length + 6,
        vertices.length + 6, vertices.length + 7, 
        vertices.length + 7, vertices.length + 4, 
        vertices.length + 0, vertices.length + 4,
        vertices.length + 1, vertices.length + 5, 
        vertices.length + 2, vertices.length + 6, 
        vertices.length + 3, vertices.length + 7, 
    ];
}
function constructConeVertices(cone_ctr, slant_length)
{
    var cone_radius = slant_length * 0.5;       //0.5 is the sin of 30 degrees
    var cone_height = Math.sqrt(slant_length**2 - cone_radius**2);
    var x = cone_center[0];
    var y = cone_center[1];
    var z = cone_center[2] - cone_height; 

    return [
        x, y, cone_center[2],                       //0
        x - cone_radius, y, z,                      //1
        x + cone_radius, y, z,                      //2
        x - (cone_radius/2.0), y + cone_radius, z,  //3
        x + (cone_radius/2.0), y + cone_radius, z,  //4
        x - (cone_radius/2.0), y - cone_radius, z,  //5
        x + (cone_radius/2.0), y - cone_radius, z,  //6
    ];
}
function constructConeIndices()
{
    var offset = cube_vertices.length/3; 
    return [
        vertices.length + offset + 0,  vertices.length + offset + 1,
        vertices.length + offset + 0,  vertices.length + offset + 3,
        vertices.length + offset + 0,  vertices.length + offset + 4, 
        vertices.length + offset + 0,  vertices.length + offset + 2,
        vertices.length + offset + 0,  vertices.length + offset + 5,
        vertices.length + offset + 0,  vertices.length + offset + 6,
        vertices.length + offset + 1,  vertices.length + offset + 3,
        vertices.length + offset + 3,  vertices.length + offset + 4,
        vertices.length + offset + 4,  vertices.length + offset + 2,
        vertices.length + offset + 2,  vertices.length + offset + 6,
        vertices.length + offset + 6,  vertices.length + offset + 5,
        vertices.length + offset + 5,  vertices.length + offset + 1,
    ];
}