# Blinn-Phong Shading WebGL Project

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Controls](#controls)
- [Shaders](#shaders)
- [Dependencies](#dependencies)
- [Resources](#resources)
- [Contact](#contact)
- [License](#license)

## Overview

The **Blinn-Phong Shading WebGL Project** is a WebGL-based application that demonstrates the Blinn-Phong shading model applied to the Stanford Bunny 3D model. This project showcases realistic lighting effects, including ambient, diffuse, and specular reflections, enhancing the visual realism of 3D objects in a web environment.

## Features

- **Blinn-Phong Shading Model**: Implements ambient, diffuse, and specular lighting to achieve realistic shading effects.
- **Interactive Controls**: Allows users to rotate and translate the 3D model using mouse and keyboard inputs.
- **Multiple Light Sources**: Includes point light and spotlight sources with dynamic positioning and rotation.
- **WebGL Utilities**: Utilizes helper scripts for matrix and vector operations, shader initialization, and context setup.
- **Visualization**: Renders the Stanford Bunny, a cube representing a point light source, and a cone representing a spotlight.

## Installation

### Prerequisites

- **Web Browser**: A modern web browser that supports WebGL (e.g., Chrome, Firefox, Edge).
- **Python 3.x**: Required to run the local server for serving the WebGL application.

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/yourusername/blinn-phong-shading_webGL.git
   cd blinn-phong-shading_webGL

    Install Dependencies

    This project relies on standard WebGL and JavaScript libraries included in the repository. Ensure that your environment has Python 3 installed.

    Run the Local Server

    To serve the WebGL application locally, use the provided server.py script:

    python server.py

    This will start a local server at http://localhost:8000.

    Access the Application

    Open your web browser and navigate to http://localhost:8000/index.html to view the Blinn-Phong Shading demonstration.

Usage
Interactive Controls

    Mouse Controls:
        Left Click & Drag: Rotate the Stanford Bunny model.
        Right Click & Drag: Translate the model along the X and Y axes.
        Scroll Wheel: Zoom in and out.

    Keyboard Controls:
        Arrow Up/Down: Translate the model along the Z-axis.
        r Key: Reset the model's position and orientation.
        p Key: Toggle rotation of the point light cube.
        s Key: Toggle rotation of the spotlight cone.

Viewing Shaders

The project includes separate vertex and fragment shaders located in the shaders.js directory. These shaders implement the Blinn-Phong shading calculations.
Project Structure

Here's the updated Project Structure section with proper rendering using fenced code blocks:

blinn-phong-shading_webGL/
├── Common/
│   ├── MV.js
│   ├── README.txt
│   ├── initShaders.js
│   ├── initShaders2.js
│   └── webgl-utils.js
├── shaders.js
├── driver.js
├── geometricObjects.js
├── inputsControls.js
├── main.frag
├── main.vert
├── server.py
├── index.html
├── style.css
└── README.md

Descriptions:

    Common/: Contains utility scripts for matrix/vector operations and shader initialization.
        MV.js: Matrix and Vector library for 3D transformations.
        README.txt: Documentation for common files.
        initShaders.js & initShaders2.js: Scripts to initialize shaders.
        webgl-utils.js: WebGL context setup and utility functions.

    shaders.js: Handles loading and compiling vertex and fragment shaders.

    driver.js: Main script that initializes WebGL, loads models, and handles rendering.

    geometricObjects.js: Defines functions to construct geometric shapes like cubes and cones.

    inputsControls.js: Manages user input events for interactive controls.

    main.frag: Fragment shader implementing the Blinn-Phong shading model.

    main.vert: Vertex shader passing necessary data to the fragment shader.

    server.py: Simple Python HTTP server to serve the application locally.

    index.html: HTML file containing the canvas and UI elements.

    style.css: Stylesheet for the application's UI.

    README.md: Project documentation (this file).
Controls
Mouse Inputs

    Rotate Model: Click and drag the mouse to rotate the Stanford Bunny.
    Translate Model: Right-click and drag to move the model along the X and Y axes.
    Zoom: Use the scroll wheel to zoom in and out.

Keyboard Inputs

    Arrow Up/Down: Move the model along the Z-axis.
    r Key: Reset the model's position and orientation.
    p Key: Toggle the rotation of the point light cube.
    s Key: Toggle the rotation of the spotlight cone.

Shaders
Vertex Shader (main.vert)

Handles the transformation of vertex positions and calculates vectors needed for lighting calculations in the fragment shader.
Fragment Shader (main.frag)

Implements the Blinn-Phong shading model, calculating ambient, diffuse, and specular lighting based on the normals and light positions.
Dependencies

    WebGL: Utilized for rendering 3D graphics in the browser.
    JavaScript: Core scripting language for the application.
    Python 3.x: Used to run the local server.

