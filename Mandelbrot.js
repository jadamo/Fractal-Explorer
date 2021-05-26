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

    this.faces = [];
    // buffer to hold the colors (based on iterations) 
    this.colors = [];

    // initialize vertex buffer
    this.fillBuffers();

    this.loadBuffers();
  }

  fillBuffers(){

    for(var x = 0; x < this.width; x++){
        for(var y = 0; y < this.height; y++){
            var a = this.minA + (x / this.width)*(this.maxA - this.minA)
            var b = this.minB + (y / this.height)*(this.maxB - this.minB)
            var iter = this.isBounded(a, b);

            this.points.push(a);
            this.points.push(b);
            this.points.push(0);

            //this assignment of colors is temprary - change this later!
            var r = (iter % 50) / 50.;
            var g = (iter % 50) / 50.;
            var b = (iter % 50) / 50.;

            this.colors.push(r); this.colors.push(g); this.colors.push(b);
            this.colors.push(0); //alpha = 0 always
        }
    }
    //load triangle faces themselves (needs to be done after the above)
    for (var i = 0; i < this.width; i++){
        for (var j = 0; j < this.height; j++){

            var idx = i*(this.height+1)+j;

            //2 triangles per square
            this.faces.push(idx);
            this.faces.push(idx+1);
            this.faces.push(idx+this.height+1);

            this.faces.push(idx+1);
            this.faces.push(idx+1+this.height+1);
            this.faces.push(idx+this.height+1);
        }
    }
  }

  /**
  * Finds the absolute distance from the origin for a given complex number
  * @param {number} real component (a) of a + bi
  * @param {number} imaginary component (b) of a + bi
  */
  abs(a, b){
      return Math.pow(a, 2) + Math.pow(b, 2);
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
          if(this.abs(a1, b1) >= 4.0){
              return i;
          }
          i++; a = a1; b = b1;
      }
      return -1;
    }

    /**
    * Send the buffer objects to WebGL for rendering 
    */
    loadBuffers(){
        // Specify the vertex coordinates
        this.VertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);      
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.points), gl.STATIC_DRAW);
        this.VertexBuffer.itemSize = 3;
        this.VertexBuffer.numItems = this.width * this.height;
        console.log("Loaded ", this.VertexBuffer.numItems, " vertices");

         // Specify faces of the terrain 
         this.IndexTriBuffer = gl.createBuffer();
         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexTriBuffer);
         gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(this.faces),
                   gl.STATIC_DRAW);
         this.IndexTriBuffer.itemSize = 1;
         this.IndexTriBuffer.numItems = this.faces.length;
         console.log("Loaded ", this.IndexTriBuffer.numItems, " triangles");

        this.ColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.ColorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.DYNAMIC_DRAW);
        this.ColorBuffer.itemSize = 4;
        this.ColorBuffer.numItems = this.VertexBuffer.numItems;
    }

    drawMandelbrot(){
        //console.log(this.points[0], " ", this.points[1], " ", this.points[2]);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.VertexBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.VertexBuffer.itemSize, 
                             gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.ColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 
                                this.ColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.IndexTriBuffer);
        gl.drawArrays(gl.TRIANGLE, 0, this.IndexTriBuffer.numItems); 
    }
}