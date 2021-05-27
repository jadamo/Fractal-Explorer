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

var ZoomX = -1; var ZoomY = -1;
var ZoomPixels;

//----------------------------------------------------------------------------------
/**
 * Draw call that draws fractal to the canvas
 */
function draw() { 
  ImageData = Mbrot.drawMandelbrot(ImageData);
  ctx.putImageData(ImageData, 0, 0);

  canvas.addEventListener('click', function(event) {
    setZoomPoint(event, canvas);
  });
}

/**
* Sets point to zoom in / out from on mouse click of the canvas
*/
function setZoomPoint(event, canvas){
  let rect = canvas.getBoundingClientRect();
  let x = event.clientX - rect.left;
  let y = event.clientY - rect.top;

  Mbrot.setZoomPoint(x, y);

  // draws marker on the new zoom point, and removes marker on the old one
  if(ZoomX != -1){ ctx.putImageData(ZoomPixels, ZoomX-1, ZoomY-1); }
  ZoomPixels = ctx.getImageData(x-1, y-1, 3, 3);

  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(x-1,y-1, 3, 3);
  ZoomX = x; ZoomY = y;
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