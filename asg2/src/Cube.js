class Cube{
  constructor(){
    this.type='cube';
    this.color = [1.0,1.0,1.0,1.0];
    this.matrix = new Matrix4();
  }
  render() {
    var rgba = this.color;

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]); // u_FragColor, rgba[0], rgba[1], 1, rgba[3]

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    // Front of cube
    drawTriangle3D( [0,0,0, 1,1,0, 1,0,0] );
    drawTriangle3D( [0,0,0, 0,1,0, 1,1,0] );

    // Top of cube
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    drawTriangle3D( [0,1,0, 0,1,1, 1,1,1] );
    drawTriangle3D( [0,1,0, 1,1,1, 1,1,0] );

    // Bottom of cube
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    drawTriangle3D([0,0,0, 1,0,0, 1,0,1]);
    drawTriangle3D([0,0,0, 1,0,1, 0,0,1]);

    // Left side of cube
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
    drawTriangle3D([0,0,0, 0,0,1, 0,1,1]);
    drawTriangle3D([0,0,0, 0,1,1, 0,1,0]);

    // Right side of cube
    gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
    drawTriangle3D([1,0,0, 1,1,0, 1,1,1]);
    drawTriangle3D([1,0,0, 1,1,1, 1,0,1]);

    // Back of cube
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    drawTriangle3D([0,0,1, 1,0,1, 1,1,1]);
    drawTriangle3D([0,0,1, 1,1,1, 0,1,1]);

  }
  drawTriangularPrism() {
    var rgba = this.color;

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    drawTriangle3D([0, 0, 0, 1, 0, 0, 0.5, 0, 1]); 

    gl.uniform4f(u_FragColor, rgba[0] * 0.9, rgba[1] * 0.9, rgba[2] * 0.9, rgba[3]);
    drawTriangle3D([0, 1, 0, 1, 1, 0, 0.5, 1, 1]);

    gl.uniform4f(u_FragColor, rgba[0] * 0.8, rgba[1] * 0.8, rgba[2] * 0.8, rgba[3]);
    drawTriangle3D([0, 0, 0, 0, 1, 0, 0.5, 1, 1]);
    drawTriangle3D([0, 0, 0, 0.5, 1, 1, 0.5, 0, 1]);

    gl.uniform4f(u_FragColor, rgba[0] * 0.7, rgba[1] * 0.7, rgba[2] * 0.7, rgba[3]);
    drawTriangle3D([1, 0, 0, 1, 1, 0, 0.5, 1, 1]);
    drawTriangle3D([1, 0, 0, 0.5, 1, 1, 0.5, 0, 1]);

    gl.uniform4f(u_FragColor, rgba[0] * 0.6, rgba[1] * 0.6, rgba[2] * 0.6, rgba[3]);
    drawTriangle3D([0, 0, 0, 1, 0, 0, 0.5, 0, 1]);

    gl.uniform4f(u_FragColor, rgba[0] * 0.5, rgba[1] * 0.5, rgba[2] * 0.5, rgba[3]);
    drawTriangle3D([0, 0, 0, 1, 0, 0, 1, 1, 0]);
    drawTriangle3D([0, 0, 0, 1, 1, 0, 0, 1, 0]);
  }

}