/*
    Input Events
*/

// Variable for mouse inputs
var mouseDown, mouseDownCount, mouseX_when_clicked, mouseY_when_clicked, isLeftPressed, isRightPressed; 
function setEventListeners(canvas) {
    
    canvas.addEventListener('keydown', function (event) {
        document.getElementById("keydown").innerText = event.key;
        processKeyInputs(event);
    });

    canvas.addEventListener('keyup', function (event) {
        document.getElementById("keyup").innerText = event.key;
    });

    canvas.addEventListener('mousemove', function (event) {

        document.getElementById("mpos_x").innerText = event.x;
        document.getElementById("mpos_y").innerText = event.y;
        applyActions(event);

    });

    canvas.addEventListener('mousedown', function (event) {
        if(event.button == 0) {
            document.getElementById("click_count").innerText = "left is presssed";
            isLeftPressed = true;
        }
        if(event.button == 2) {
            document.getElementById("click_count").innerText = "right is presssed";
            isRightPressed = true;
        }
        mouseX_when_clicked = event.x;
        mouseY_when_clicked = event.y; 
    })

    canvas.addEventListener('mouseup', function (event) {

        document.getElementById("click_count").innerText = "mouse is released"
        isLeftPressed = false; 
        isRightPressed = false; 
        
    })
}

function applyActions(event)
{
    if(isLeftPressed) { //means left mouse is currently pressed
        var mouseX_curr = event.x;
        var mouseY_curr = event.y;
        dir_dx = (mouseX_curr - mouseX_when_clicked)/20;
        dir_dy = (mouseY_when_clicked - mouseY_curr)/20;
        
        dirs_to_translate[0] += dir_dx; 
        dirs_to_translate[1] += dir_dy; 
        mouseX_when_clicked = mouseX_curr;
        mouseY_when_clicked = mouseY_curr;
      
    }
    if(isRightPressed) {
        var mouseX_curr = event.x; 
        var mouseY_curr = event.y;

        angleX = (((mouseY_when_clicked - mouseY_curr)) % 360);
        angleY = (((mouseX_curr - mouseX_when_clicked)) % 360);

        
        mouseX_when_clicked = mouseX_curr;
        mouseY_when_clicked = mouseY_curr;
        
        angles_to_rotate[0] += angleX;
        angles_to_rotate[1] += angleY; 
       
    }                
}

function processKeyInputs(event)
{
    if(event.key == "ArrowUp") {
        dir_z += 0.1;
        dirs_to_translate[2] = dir_z;
    }
    else if(event.key == "ArrowDown") {
        dir_z -= 0.1;
        dirs_to_translate[2] = dir_z;
    }
    else if(event.key == 'r') {
        BunnyReset();
    }
    else if(event.key == 'p') {
        cube_stop_rotate_signal = (cube_stop_rotate_signal ? !true : true ); //just an XOR operator
         
    }
    else if(event.key == 's') {
        cone_stop_rotate_signal = (cone_stop_rotate_signal ? !true : true ); //just an XOR operator
         
    }
}
