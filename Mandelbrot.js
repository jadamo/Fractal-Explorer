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
    this.points = [];

    // buffer to hold the colors (based on iterations) 
    this.colors = [];

    // initialize vertex buffer
    this.fillBuffer()
  }

  fillBuffer(){
    for(var x = 0; x < width; x++){
        for(var y = 0; y < height; y++){
            var a = this.minA + (x / this.width)*(this.maxA - this.minA)
            var b = this.minB + (y / this.height)*(this.maxB - this.minB)
            var iter = this.isBounded(a, b);
            
            this.points.push(a);
            this.points.push(b);
            this.points.push(0);

            //this assignment of colors is temprary - change this later!
            var r = iter % 255;
            var g = iter % 255;
            var b = iter % 255;

            this.colors.push(r); this.colors.push(g); this.colors.push(b);
            this.colors.push(0); //alpha = 0 always
        }
    }
  }

  /**
  * Finds the absolute distance from the origin for a given complex number
  * @param {number} real component (a) of a + bi
  * @param {number} imaginary component (b) of a + bi
  */
  abs(a, b){
      return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
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
      while(i < maxIterations){
          // f(z+1) = z^2 + c, where c is the original point and z is iterated and z(0) = 0
          var a1 = ((a * a) - (b * b)) + Ca;
          var b1 = (2 * a * b) + Cb;
          
          if(abs(a1, b1) < 2.0){
              return i;
          }
          i++;
      }
      return 0;
  }

    /**
    * Send the buffer objects to WebGL for rendering 
    */
    loadBuffers(){
        // Specify the vertex coordinates
        this.VertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);      
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vBuffer), gl.STATIC_DRAW);
        this.VertexBuffer.itemSize = 3;
        this.VertexBuffer.numItems = this.width * this.height;
        console.log("Loaded ", this.VertexBuffer.numItems, " vertices");

        this.ColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, ColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);
        this.ColorBuffer.itemSize = 4;
        this.ColorBuffer.numItems = this.VertexBuffer.numItems;
    }

    drawMandelbrot(){
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.VertexBuffer.itemSize, 
							 gl.FLOAT, false, 0, 0);
  }
}