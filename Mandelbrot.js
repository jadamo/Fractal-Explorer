/**
 * @file Javascript file to do all things with the mandelbrot set
 * @author Joe Adamo <joedadamo@gmail.com>
 */

class Mandelbrot{
  
  constructor(){
    this.maxIterations = 800;

    // width and height of the display (TODO: automatically get this from canvas)
    this.width = 900; this.height = 900;

    // bounds of display in absolute units
    // updating these limits "should" be enough to handle zooms
    this.minA = -2.0; this.maxA = 2.0;
    this.minB = -2.0; this.maxB = 2.0;

    // vertex buffer
    // idx = x*width + y
    this.A = [];
    this.B = [];
    this.Iterations = [];

    // initialize points
    this.fillBuffers();
  }

  fillBuffers(){
    for(var y = 0; y < this.height; y++){
        for(var x = 0; x < this.width; x++){
            var a = this.minA + (x / this.width)*(this.maxA - this.minA)
            var b = this.minB + (y / this.height)*(this.maxB - this.minB)
            var iter = this.isBounded(a, b);

            this.A.push(a);
            this.B.push(b);
            this.Iterations.push(iter);
        }
    }
  }

  /**
   * Determines whether a given complex number a + bi is in the mandelbrot set, and if the point is
   * not in the set also finds the number of iterations for that number to blow up
   * @param {number} real component (a) of a + bi
   * @param {number} imaginary component (b) of a + bi
   * @return {number} number of iterations to blow up, or -1 if max iterations reached
   */
  isBounded(cA, cB){

      var a = 0.;
      var b = 0.;
      var i = 0;
      while(i < this.maxIterations){
          // f(z+1) = z^2 + c, where c is the original point and z is iterated and z(0) = 0
          var a1 = ((a * a) - (b * b)) + cA;
          var b1 = (2 * a * b) + cB;
          if(Math.pow(a1, 2) + Math.pow(b1, 2) >= 4.0){
              return i;
          }
          i++; a = a1; b = b1;
      }
      return -1;
    }

    /**
    * loads in color data to a canvas ImageData object for drawing
    * @param {ImageData object} ImageData 
    * @return {ImageData object} ImageData based on Mandelbrot values
    */
    drawMandelbrot(ImageData){
        for(var x = 0; x < this.width; x++){
            for(var y = 0; y < this.height; y++){
                var idx1 = y * (this.height) + x
                var idx2 = y * (this.width * 4) + x * 4;

                //this assignment of colors is temprary - change this later!
                var r = ((this.Iterations[idx1]*3) % 255);
                var g = ((this.Iterations[idx1]*3) % 255);
                var b = ((this.Iterations[idx1]*3) % 255);

                ImageData.data[idx2]   = r;
                ImageData.data[idx2+1] = g;
                ImageData.data[idx2+2] = b;
                ImageData.data[idx2+3] = 255;
            }
        }
    return ImageData;
    }
}