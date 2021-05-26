/**
 * @file Javascript file to draw fractals
 * Currently plan to handel
 * - Mandelbrot sets
 * - Julia sets
 * - 3d(?) fractals
 * @author Joe Adamo <joedadamo@gmail.com>
 */

/** @global The WebGL context */
var gl;

/** @global The HTML5 canvas we draw on */
var canvas;

/** @global A simple GLSL shader program */
var shaderProgram;

/**@global mandelbrot fractal object */
var MBrot;

/** @global the scale matrix**/
var scaleMatrix = glMatrix.mat4.create();

/** @global The factor to scale our image by */
var scaleFactor = 0.5;

 /**
 * Creates a context for WebGL
 * @param {element} canvas WebGL canvas
 * @return {Object} WebGL context
 */
function createGLContext(canvas) {
    var names = ["webgl", "experimental-webgl"];
    var context = null;
    for (var i=0; i < names.length; i++) {
      try { context = canvas.getContext(names[i]); } 
      catch(e) {}
      if (context) { break; }
    }
    if (context) {
      context.viewportWidth = canvas.width;
      context.viewportHeight = canvas.height;
    } else {
      alert("Failed to create WebGL context!");
    }
    return context;
  }

// check out https://github.com/emoller/WebGL101 for a good reference

/**
 * Loads Shaders
 * @param {string} id ID string for shader to load. Either vertex shader/fragment shader
 */
function loadShaderFromDOM(id) {
    var shaderScript = document.getElementById(id);
    
    // If we don't find an element with the specified id
    // we do an early exit 
    if (!shaderScript) { return null; }
    
    // Loop through the children for the found DOM element and
    // build up the shader source code as a string
    var shaderSource = "";
    var currentChild = shaderScript.firstChild;
    while (currentChild) {
      if (currentChild.nodeType == 3) { // 3 corresponds to TEXT_NODE
        shaderSource += currentChild.textContent;
      }
      currentChild = currentChild.nextSibling;
    }
   
    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
      shader = gl.createShader(gl.VERTEX_SHADER);
    } else {return null;}
   
    gl.shaderSource(shader, shaderSource);
    gl.compileShader(shader);
   
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    } 
    return shader;
  }

/**
*  Sends matrices to shader
*/
function setMatrixUniforms() {
  gl.uniformMatrix4fv(shaderProgram.sMatrixUniform, false, scaleMatrix);
}

/**
* Setup the fragment and vertex shaders
*/
function setupShaders() {
  vertexShader = loadShaderFromDOM("mandelbrot-vs");
  fragmentShader = loadShaderFromDOM("mandelbrot-fs");
  
  shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Failed to setup shaders");
  }

  gl.useProgram(shaderProgram);
  shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

  shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
  gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

  //matrices
  shaderProgram.sMatrixUniform = gl.getUniformLocation(shaderProgram, "scaleMatrix");
}

//-------------------------------------------------------------------------
/**
 * Populates buffers with data for spheres
 */
function setupBuffers(){
  Mbrot = new Mandelbrot();
}

//----------------------------------------------------------------------------------
/**
 * Draw call that applies matrix transformations and draws to frame
 */
function draw() { 
  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); 

  glMatrix.mat4.identity(scaleMatrix);

  setMatrixUniforms();
  Mbrot.drawMandelbrot();
}

/**
 * Update simulation parameters and positions every tick
 */
function animate(){
}

/**
 * Startup function called from html code to start program.
 */
function startup() {
    canvas = document.getElementById("myGLCanvas");
  gl = createGLContext(canvas);
  setupShaders("mandelbrot-vs","mandelbrot-fs");
  setupBuffers();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);
  tick();
}

//----------------------------------------------------------------------------------
/**
 * Tick called for every animation frame.
 */
function tick() {
  requestAnimFrame(tick);
  draw();
	animate();
}