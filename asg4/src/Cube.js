class Cube{
  constructor(){
    this.type='cube';
    this.color = [1.0,1.0,1.0,1.0];
    this.matrix = new Matrix4();
    this.textureNum=-2;
    this.cubeVerts32 = new Float32Array([
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,
      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,1, 1,1,0,
      0,0,0, 1,0,0, 1,0,1,
      0,0,0, 1,0,1, 0,0,1,
      0,0,0, 0,0,1, 0,1,1,
      0,0,0, 0,1,1, 0,1,0,
      1,0,0, 1,1,0, 1,1,1,
      1,0,0, 1,1,1, 1,0,1,
      0,0,1, 1,0,1, 1,1,1,
      0,0,1, 1,1,1, 0,1,1
    ]);
    this.cubeVerts32UV = new Float32Array([
      0,0,0, 0,0,1, 1,0,1, 1,1,0, 0,1,0,
      0,0,0, 0,0,0, 1,0,0, 1,1,1, 0,1,1,
      0,1,0, 0,0,0, 1,1,0, 1,1,1, 1,1,1,
      0,1,0, 0,0,1, 1,1,1, 1,1,1, 0,1,0,
      0,0,0, 0,0,1, 0,0,1, 0,1,0, 1,1,1,
      0,0,0, 0,0,1, 0,1,1, 1,0,0, 1,0,1,
      0,0,0, 0,0,0, 0,1,0, 1,0,1, 1,1,1,
      0,0,0, 0,0,0, 1,1,1, 1,0,1, 0,1,0,
      1,0,0, 0,0,1, 1,0,1, 0,1,1, 1,1,1,
      1,0,0, 0,0,1, 1,1,1, 1,1,0, 1,0,1,
      0,0,1, 0,0,1, 0,1,1, 0,1,1, 1,1,1,
      0,0,1, 0,0,1, 1,1,1, 1,0,1, 1,0,1

    ]);
    this.cubeVerts = [
      0,0,0, 1,1,0, 1,0,0,
      0,0,0, 0,1,0, 1,1,0,
      0,1,0, 0,1,1, 1,1,1,
      0,1,0, 1,1,1, 1,1,0,
      0,0,0, 1,0,0, 1,0,1,
      0,0,0, 1,0,1, 0,0,1,
      0,0,0, 0,0,1, 0,1,1,
      0,0,0, 0,1,1, 0,1,0,
      1,0,0, 1,1,0, 1,1,1,
      1,0,0, 1,1,1, 1,0,1,
      0,0,1, 1,0,1, 1,1,1,
      0,0,1, 1,1,1, 0,1,1
    ];
  }
  render() {
    var rgba = this.color;

    gl.uniform1i(u_whichTexture, this.textureNum);

    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);

    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
/* testing, correction
    // Front
    drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
    drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

    // Top
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
    drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);

    // Bottom
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    drawTriangle3DUV([0,0,0, 0,0,1, 1,0,1], [0,0, 0,1, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
    drawTriangle3DUV([0,0,0, 1,0,1, 1,0,0], [0,0, 1,1, 1,0], [0,-1,0, 0,-1,0, 0,-1,0]);

    // Left
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
    drawTriangle3DUV([0,1,0, 0,1,1, 0,0,0], [0,0, 0,1, 1,1], [-1,0,0, -1,0,0, -1,0,0]);
    drawTriangle3DUV([0,0,0, 0,1,1, 0,0,1], [0,0, 1,1, 1,0], [-1,0,0, -1,0,0, -1,0,0]);

    // Right
    gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
    drawTriangle3DUV([1,1,0, 1,1,1, 1,0,0], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
    drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);

    // Back
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    drawTriangle3DUV([0,0,1, 1,1,1, 1,0,1], [0,0, 0,1, 1,1], [0,0,1, 0,0,1, 0,0,1]);
    drawTriangle3DUV([0,0,1, 0,1,1, 1,1,1], [0,0, 1,1, 1,0], [0,0,1, 0,0,1, 0,0,1]);
*/

    // Front
    drawTriangle3DUVNormal([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0], [0,0,-1, 0,0,-1, 0,0,-1]);
    drawTriangle3DUVNormal([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1], [0,0,-1, 0,0,-1, 0,0,-1]);

    // Top
    //gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    drawTriangle3DUVNormal([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1], [0,1,0, 0,1,0, 0,1,0]);
    drawTriangle3DUVNormal([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0], [0,1,0, 0,1,0, 0,1,0]);

    // Bottom
    //gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    drawTriangle3DUVNormal([0,0,0, 1,0,0, 1,0,1], [0,0, 1,0, 1,1], [0,-1,0, 0,-1,0, 0,-1,0]);
    drawTriangle3DUVNormal([0,0,0, 1,0,1, 0,0,1], [0,0, 1,1, 0,1], [0,-1,0, 0,-1,0, 0,-1,0]);

    // Left
    //gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
    drawTriangle3DUVNormal([0,0,0, 0,0,1, 0,1,1], [0,0, 1,0, 1,1], [-1,0,0, -1,0,0, -1,0,0]);
    drawTriangle3DUVNormal([0,0,0, 0,1,1, 0,1,0], [0,0, 1,1, 0,1], [-1,0,0, -1,0,0, -1,0,0]);

    // Right
    //gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
    drawTriangle3DUVNormal([1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1], [1,0,0, 1,0,0, 1,0,0]);
    drawTriangle3DUVNormal([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0], [1,0,0, 1,0,0, 1,0,0]);

    // Back
    //gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    drawTriangle3DUVNormal([0,0,1, 1,0,1, 1,1,1], [0,0, 1,0, 1,1], [0,0,1, 0,0,1, 0,0,1]);
    drawTriangle3DUVNormal([0,0,1, 1,1,1, 0,1,1], [0,0, 1,1, 0,1], [0,0,1, 0,0,1, 0,0,1]);

    /* old cube, idk why theres an extra side but its there now! >:(
    drawTriangle3DUV( [0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0] );
    drawTriangle3DUV( [0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1] );

    // Front
    drawTriangle3DUV([0,0,0, 1,1,0, 1,0,0], [0,0, 1,1, 1,0]);
    drawTriangle3DUV([0,0,0, 0,1,0, 1,1,0], [0,0, 0,1, 1,1]);

    // Top
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    drawTriangle3DUV([0,1,0, 0,1,1, 1,1,1], [0,0, 0,1, 1,1]);
    drawTriangle3DUV([0,1,0, 1,1,1, 1,1,0], [0,0, 1,1, 1,0]);

    // Bottom
    gl.uniform4f(u_FragColor, rgba[0]*0.8, rgba[1]*0.8, rgba[2]*0.8, rgba[3]);
    drawTriangle3DUV([0,0,0, 1,0,0, 1,0,1], [0,0, 1,0, 1,1]);
    drawTriangle3DUV([0,0,0, 1,0,1, 0,0,1], [0,0, 1,1, 0,1]);

    // Left
    gl.uniform4f(u_FragColor, rgba[0]*0.7, rgba[1]*0.7, rgba[2]*0.7, rgba[3]);
    drawTriangle3DUV([0,0,0, 0,0,1, 0,1,1], [0,0, 1,0, 1,1]);
    drawTriangle3DUV([0,0,0, 0,1,1, 0,1,0], [0,0, 1,1, 0,1]);

    // Right
    gl.uniform4f(u_FragColor, rgba[0]*0.6, rgba[1]*0.6, rgba[2]*0.6, rgba[3]);
    drawTriangle3DUV([1,0,0, 1,1,0, 1,1,1], [0,0, 0,1, 1,1]);
    drawTriangle3DUV([1,0,0, 1,1,1, 1,0,1], [0,0, 1,1, 1,0]);

    // Back
    gl.uniform4f(u_FragColor, rgba[0]*0.5, rgba[1]*0.5, rgba[2]*0.5, rgba[3]);
    drawTriangle3DUV([0,0,1, 1,0,1, 1,1,1], [0,0, 1,0, 1,1]);
    drawTriangle3DUV([0,0,1, 1,1,1, 0,1,1], [0,0, 1,1, 0,1]);


    // older cubes just in case!
    // Front of cube
    drawTriangle3D([0,0,0, 1,1,0, 1,0,0]);
    drawTriangle3D([0,0,0, 0,1,0, 1,1,0]);

    // Top of cube
    gl.uniform4f(u_FragColor, rgba[0]*0.9, rgba[1]*0.9, rgba[2]*0.9, rgba[3]);
    drawTriangle3D([0,1,0, 0,1,1, 1,1,1]);
    drawTriangle3D([0,1,0, 1,1,1, 1,1,0]);

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
    */
  }
  renderfast() {
    var rgba = this.color;
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    
    var allverts=[];

    allverts=allverts.concat( [0,0,0, 1,1,0, 1,0,0] ); // front
    allverts=allverts.concat( [0,0,0, 1,0,1, 1,1,0] );

    allverts=allverts.concat( [0,1,0, 0,1,1, 1,1,1] ); // top
    allverts=allverts.concat( [0,1,0, 1,1,1, 1,1,0] );

    allverts=allverts.concat( [1,1,0, 1,1,1, 1,0,0] ); // right
    allverts=allverts.concat( [1,0,0, 1,1,1, 1,0,1] );

    allverts=allverts.concat( [0,1,0, 0,1,1, 0,0,0] ); // left
    allverts=allverts.concat( [0,0,0, 0,1,1, 0,0,1] );

    allverts=allverts.concat( [0,0,0, 0,0,1, 1,0,1] ); // bottom
    allverts=allverts.concat( [0,0,0, 1,0,1, 1,0,0] );

    allverts=allverts.concat( [0,0,1, 1,1,1, 1,0,1] ); // back
    allverts=allverts.concat( [0,0,1, 0,1,1, 1,1,1] );

    drawTriangle3D(allverts);
  }
  renderfaster() {
    var rgba = this.color;
    gl.uniform1i(u_whichTexture, this.textureNum);
    gl.uniform4f(u_FragColor, rgba[0], rgba[1], rgba[2], rgba[3]);
    gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    if(g_vertexBuffer==null) {
      initTriangle3D();
    }
    gl.bufferData(gl.ARRAY_BUFFER, this.cubeVerts32, gl.DYNAMIC_DRAW)
    gl.drawArrays(gl.TRIANGLES, 0, 36);
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