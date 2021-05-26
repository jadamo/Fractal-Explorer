/**
 * @file Javascript file to draw fractals
 * Currently plan to handel
 * - Mandelbrot sets
 * - Julia sets
 * - 3d(?) fractals
 * @author Joe Adamo <joedadamo@gmail.com>
 */


/** @global The HTML5 canvas we draw on */
var canvas;

/** @global ctx object */
var ctx;

/**@global mandelbrot fractal object */
var MBrot;

var ImageData;

//----------------------------------------------------------------------------------
/**
 * Draw call that draws fractal to the canvas
 */
function draw() { 
  ImageData = ctx.createImageData(canvas.width, canvas.height);
  ImageData = Mbrot.drawMandelbrot(ImageData);
  ctx.putImageData(ImageData, 0, 0);
}


/**
 * Startup function called from html code to start program.
 */
function startup() {
  canvas = document.getElementById("FractalCanvas");
  ctx = canvas.getContext('2d');

  Mbrot = new Mandelbrot();
  ImageData = ctx.createImageData(canvas.width, canvas.height);
  draw();
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