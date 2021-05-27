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
var justZoomed = 0;

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
  var dx = canvas.width / 2 / 2; var dy = canvas.height / 2 / 2;
  if(justZoomed == 0){ ctx.putImageData(ZoomPixels, ZoomX-dx-1, ZoomY-dy-1); }
  ZoomPixels = ctx.getImageData(x-dx-1, y-dy-1, 2*dx+2, 2*dy+2);

  ctx.fillStyle = 'rgb(255, 255, 255)';
  ctx.fillRect(x,y, 1, 1);
  ctx.beginPath();
  ctx.lineWidth = "1";
  ctx.strokeStyle = "white";
  ctx.rect(x-dx, y-dy, 2*dx, 2*dy);
  ctx.stroke();
  ZoomX = x; ZoomY = y; justZoomed = 0;
}

function changeScale(scale){
  Mbrot.changeScale(scale);
  draw();
  justZoomed = 1;
}

/**
 * Startup function called from html code to start program.
 */
function startup() {
  canvas = document.getElementById("FractalCanvas");
  ctx = canvas.getContext('2d');

  Mbrot = new Mandelbrot();
  ImageData = ctx.createImageData(canvas.width, canvas.height);
  justZoomed = 1;
  draw();
}