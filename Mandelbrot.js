/**
 * @file Javascript file to do all things with the mandelbrot set
 * @author Joe Adamo <joedadamo@gmail.com>
 */

class Mandelbrot{
  
  constructor(){
    this.maxIterations = 100;
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
      return -1;
  }

  drawMandelbrot(){
    
  }
}