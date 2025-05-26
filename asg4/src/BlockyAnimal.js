// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  precision mediump float;
  attribute vec4 a_Position;
  attribute vec2 a_UV;
  attribute vec3 a_Normal;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  varying vec4 v_VertPos;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjectionMatrix;
  void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
    v_UV = a_UV;
    v_Normal = a_Normal;
    v_VertPos = u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  varying vec2 v_UV;
  varying vec3 v_Normal;
  uniform vec4 u_FragColor; // uniform変数
  uniform sampler2D u_Sampler0;
  uniform sampler2D u_Sampler1;
  uniform int u_whichTexture;
  uniform vec3 u_lightPos;
  uniform vec3 u_cameraPos;
  uniform vec4 v_VertPos;
  uniform bool u_lightOn;
  uniform vec3 u_lightColor;

  void main() {

    if (u_whichTexture == -3) {
      gl_FragColor = vec4((v_Normal+1.0)/2.0, 1.0); // use normal debug color

    } else if(u_whichTexture == -2 || u_whichTexture == -4) {
      gl_FragColor = u_FragColor; // use color
    
    } else if (u_whichTexture == -1) {
      gl_FragColor = vec4(v_UV,1.0,1.0); // uv debug color
    
    } else if (u_whichTexture == 0) {
      gl_FragColor = texture2D(u_Sampler0, v_UV); // texture0
    
    } else if (u_whichTexture == 1) {
      gl_FragColor = texture2D(u_Sampler1, v_UV); // texture1
    
    } else {
      gl_FragColor = vec4(1,.2,.2,1); // err color
    }

    //vec3 lightVector = vec3(v_VertPos)-u_lightPos;
    vec3 lightVector = u_lightPos-vec3(v_VertPos);
    float r = length(lightVector);
    /*if(r < 1.0) {
      gl_FragColor = vec4(1,0,0,1);
    } else if (r < 2.0) {
      gl_FragColor = vec4(0,1,0,1);
    }*/
    // Light falloff visualization 1/r^2
    //gl_FragColor = vec4(vec3(gl_FragColor)/(r*r),1);

    vec3 L = normalize(lightVector);
    vec3 N = normalize(v_Normal);
    float nDotL = max(dot(N,L), 0.0);
    //gl_FragColor = gl_FragColor * nDotL;
    //gl_FragColor.a = 1.0;  // set unlit to black

    vec3 R = reflect(-L, N);

    vec3 E = normalize(u_cameraPos-vec3(v_VertPos));
    
    vec3 specular = pow(max(dot(E,R), 0.0), 64.0) * 0.8 * u_lightColor; //float specular = pow(max(dot(E,R), 0.0), 10.0);
    
    vec3 diffuse = u_lightColor * vec3(gl_FragColor) * nDotL * 0.7; // vec3(1.0,1.0,0.9)
    vec3 ambient = vec3(gl_FragColor) * 0.2;
    //gl_FragColor = vec4(specular+diffuse+ambient, 1.0); // set unlit to ambient lighting
    if (u_lightOn) {
      if (u_whichTexture != -4)
      {
        gl_FragColor = vec4(specular+diffuse+ambient, 1.0);
      }// else {
      //  gl_FragColor = vec4(diffuse+ambient, 1.0);
      //}
    }
  }`

// Globals
let canvas;
let gl;
let a_Postion;
let a_UV;
let a_Normal;
let a_FragColor;
let u_Size;
let u_ModelMatrix;
let u_ProjectionMatrix;
let u_ViewMatrix;
let u_GlobalRotateMatrix;
let u_Sampler0;
let u_Sampler1;
let u_whichTexture;
let u_lightPos;
let u_cameraPos;
let u_lightColor;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
 
  gl.enable(gl.DEPTH_TEST);

}
function connectVariablesToGLSL(){
   // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of a_Position
  a_UV = gl.getAttribLocation(gl.program, 'a_UV');
  if (a_UV < 0) {
    console.log('Failed to get the storage location of a_UV');
    return;
  }

  a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
  if (a_Normal < 0) {
    console.log('Failed to get the storage lcoation of a_Normal');
    return;
  }

  u_lightPos = gl.getUniformLocation(gl.program, 'u_lightPos');
  if (!u_lightPos) {
    console.log('Failed to get the storage location of u_lightPos');
    return;
  }

  u_cameraPos = gl.getUniformLocation(gl.program, 'u_cameraPos');
  if (!u_cameraPos) {
    console.log('Failed to get the storage location of u_cameraPos');
    return;
  }

  u_lightOn = gl.getUniformLocation(gl.program, 'u_lightOn');
  if (!u_lightOn) {
    console.log('Failed to get the storage location of u_lightOn');
    return;
  }

  u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
  if (!u_lightColor) {
    console.log('Failed to get the storage location of u_lightColor');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }

  u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) {
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }

  u_GlobalRotateMatrix = gl.getUniformLocation(gl.program, 'u_GlobalRotateMatrix');
  if (!u_GlobalRotateMatrix) {
    console.log('Failed to get the storage location of u_GlobalRotateMatrix');
    return;
  }
 
  u_ProjectionMatrix = gl.getUniformLocation(gl.program, 'u_ProjectionMatrix');
  if (!u_ProjectionMatrix) {
    console.log('Failed to get the storage location of u_ProjectionMatrix');
    return;
  }

  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  if (!u_ViewMatrix) {
    console.log('Failed to get the storage location of u_ViewMatrix');
    return;
  }
/*
  projectionMatrix = new Matrix4();
  projectionMatrix.setPerspective(60, canvas.width/canvas.height, 0.1, 100);
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);

  viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0, 0, 3, 0, 0, -100, 0, 1, 0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  projectionMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projectionMatrix.elements);
  viewMatrix = new Matrix4();
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);
*/

  // Get the storage location of u Sampler
  u_Sampler0 = gl.getUniformLocation(gl.program, 'u_Sampler0');
  if(!u_Sampler0) {
    console.log('Failed to get the storage location of u_Sampler0');
    return false;
  }

  u_Sampler1 = gl.getUniformLocation(gl.program, 'u_Sampler1');
  if(!u_Sampler1) {
    console.log('Failed to get the storage location of u_Sampler1');
    return false;
  }

  u_whichTexture = gl.getUniformLocation(gl.program, 'u_whichTexture');
  if(!u_whichTexture) {
    console.log('Failed to get the storage location of u_whichTexture');
    return false;
  }

  var identityM = new Matrix4();
  gl.uniformMatrix4fv(u_ModelMatrix, false, identityM.elements);  
}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

let g_selectedColor=[1.0,1.0,1.0,1.0];
let g_selectedSize = 5;
let g_selectedType=POINT;
let g_globalXAngle = 0;
let g_globalYAngle = 0;
let g_yellowAngle = 0;
let g_mouthAngle = 0;
let g_yellowAnimation = false;
let g_mouthAnimation = false;
let g_armAngle = 0;
let g_handAngle = 0;
let collision = true;
let mapChoice = 1;
let g_NormalOn = false;
let g_lightPos = [0,1,-2];
let g_lightOn = true;
let g_lightAnimation = true;
let g_lightR = 1.0;
let g_lightG = 1.0;
let g_lightB = 1.0;
let g_lightColor = [g_lightR, g_lightG, g_lightB];

function addActionsForHtmlUI(){
  document.getElementById('normalButton').onclick = function() { g_NormalOn = !g_NormalOn; console.log(g_NormalOn); }

  document.getElementById('lightButton').onclick = function() { g_lightOn = !g_lightOn; console.log(g_lightOn); }

  document.getElementById('lightAniButton').onclick = function() { g_lightAnimation = !g_lightAnimation; console.log(g_lightAnimation); }

  document.getElementById('animationButton').onclick = function() { g_yellowAnimation = !g_yellowAnimation; }

  document.getElementById('resetButton').onclick = function() { collision = !collision; }

  document.getElementById('xlightSlide').addEventListener('mousemove', function() {g_lightPos[0] = this.value/100; renderAllShapes(); });

  document.getElementById('ylightSlide').addEventListener('mousemove', function() {g_lightPos[1] = this.value/100; renderAllShapes(); });  

  document.getElementById('zlightSlide').addEventListener('mousemove', function() {g_lightPos[2] = this.value/100; renderAllShapes(); }); 

  document.getElementById('rlightSlide').addEventListener('mousemove', function() {g_lightR = this.value; renderAllShapes(); });

  document.getElementById('glightSlide').addEventListener('mousemove', function() {g_lightG = this.value;  renderAllShapes(); });  

  document.getElementById('blightSlide').addEventListener('mousemove', function() {g_lightB = this.value;  renderAllShapes(); }); 

  document.getElementById('xangleSlide').addEventListener('mousemove', function() {g_globalXAngle = this.value; renderAllShapes(); });

  document.getElementById('yangleSlide').addEventListener('mousemove', function() {g_globalYAngle = this.value; renderAllShapes(); });  

  document.getElementById('armSlide').addEventListener('mousemove', function() {g_armAngle = this.value; renderAllShapes(); });

  document.getElementById('handSlide').addEventListener('mousemove', function() {g_handAngle = this.value; renderAllShapes(); });
}

function initTextures() {
  var image = new Image(); // Create the image objects
  var image2 = new Image();
  if (!image || !image2) {
  console.log('Failed to create the image objects')
  return true;
  }
  // Register the vent handler to be called on loading an image
  image.onload = function() { sendTextureToTEXTURE0(image); };
  image2.onload = function() { sendTextureToTEXTURE1(image2); };
  
  image.src = 'sky.jpg';
  image2.src = 'wall.jpg';

  return true;
}

function sendTextureToTEXTURE0(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip the image's y-axis
  // Enable texture unit0
  gl.activeTexture(gl.TEXTURE0);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler0, 0);
  //gl.clear(gl.COLOR_BUFFER_BIT);
  //gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  console.log('finished loadTexture');
}

function sendTextureToTEXTURE1(image) {
  var texture = gl.createTexture();
  if (!texture) {
    console.log('Failed to create the texture2 object');
    return false;
  }

  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // flip the image's y-axis
  // Enable texture unit1
  gl.activeTexture(gl.TEXTURE1);
  // bind the texture object to the target
  gl.bindTexture(gl.TEXTURE_2D, texture);
  
  // set the texture parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  // set the texture image
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
  gl.uniform1i(u_Sampler1, 1);
  

  console.log('finished loadTexture2');
}


function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = handleMouseMove;

  document.onkeydown = keydown;

  initTextures();

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Render
  requestAnimationFrame(tick);
}

var g_shapesList = []; // ignore for now

const sensitivity = 0.5; // 0.8
function handleMouseMove(ev) {
  let [x,y] =  convertCoordinatesEventToGL(ev);

  if (x < -0.2) g_camera.panLeft(sensitivity); //g_globalXAngle--;
  if (x > 0.2) g_camera.panRight(sensitivity); //g_globalXAngle++;
  if (y < -0.2) g_camera.panUp(sensitivity); //g_globalYAngle--;
  if (y > 0.2) g_camera.panDown(sensitivity); //g_globalYAngle++;

  //renderAllShapes();
  //requestAnimationFrame(handleMouseMove);
}
function click(ev) {
  if(ev.shiftKey) {
    g_mouthAnimation = true;  
    console.log('SLAD');
  }
  else {
    g_globalXAngle = 0; 
    g_globalYAngle = 0;
  }

  let [x,y] = convertCoordinatesEventToGL(ev);

  if(ev.button === 0) // left click
  {
    console.log("destroy");
  }
  else if(ev.button === 2) // right click
  { 
    canvas.oncontextmenu = () => false;
    console.log("place");
  }
  renderAllShapes(); 
}
function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

  return([x,y]);
}

let lastTime = performance.now();
let fps = 0;
let lastUpdateTime = performance.now();
function updateFPS() {
  const currentTime = performance.now();
  const delta = currentTime - lastTime;
  fps = Math.round(1000 / delta); // Calculate FPS
  lastTime = currentTime;
  
  if(currentTime - lastUpdateTime >= 500) {
    document.getElementById('fpsDisplay').innerText = `FPS: ${fps}`;
    lastUpdateTime = currentTime;  
  }
  requestAnimationFrame(updateFPS);
}

const fpsDisplay = document.createElement('div');
fpsDisplay.id = 'fpsDisplay';
fpsDisplay.style.position = 'fixed';
fpsDisplay.style.top = '10px';
fpsDisplay.style.left = '10px';
fpsDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
fpsDisplay.style.color = 'white';
fpsDisplay.style.padding = '5px';
fpsDisplay.style.borderRadius = '5px';
fpsDisplay.style.fontFamily = 'Arial, sans-serif';
fpsDisplay.style.zIndex = '1000';
document.body.appendChild(fpsDisplay);

updateFPS();

var g_startTime = performance.now()/1000.0;
var g_seconds = performance.now()/1000.0-g_startTime;
var g_mouthAnimationSpeed = 0.5;
var g_mouthAnimationToggle = false;
function tick() {

  g_seconds=performance.now()/1000.0;//-g_startTime;

  //console.log(performance.now);
  updateAnimationAngles();
  renderAllShapes();
  requestAnimationFrame(tick);
}
function updateAnimationAngles() {
  if(g_yellowAnimation) {
    g_yellowAngle = (5*Math.sin(g_seconds)); //45
  }
  if(g_mouthAnimation) {
    if(g_mouthAnimationToggle == false) {
      g_mouthAngle += 0.5;
      if(g_mouthAngle > 5) { g_mouthAnimationToggle = true; }
    }
    if(g_mouthAnimationToggle == true) {
      g_mouthAngle -= 0.5;
      if(g_mouthAngle == 0) { 
        g_mouthAnimationToggle = false;
        g_mouthAnimation = false;
      }
    }
  }
  if(g_lightAnimation) {
    g_lightPos[0] = 2.0 * Math.cos(g_seconds);
    g_lightPos[2] = 2.0 * Math.sin(g_seconds);
  }
}
var g_camera = new Camera();
var movespeed = 0.32;
function keydown(ev) {
  const angleStep = (Math.PI / 36) * 2; // 5 degree step

  switch (ev.keyCode) {
    case 32: // SPACE - move up
      g_camera.eye.elements[1]+=movespeed;
      break;
    case 86: // V - move down
      g_camera.eye.elements[1]-=movespeed;
      break;
    case 87: // W - move forward
      g_camera.forward(movespeed);
      break;
    case 83: // S - move backward
      g_camera.back(movespeed);
      break;
    case 65: // A - move left
      g_camera.left(movespeed);
      break;
    case 68: // D - move right
      g_camera.right(movespeed);
      break;
    case 81: // Q - turn left
      g_camera.panLeft(9);
      break;
    case 69: // E - turn right
      g_camera.panRight(9);
      break;
    default:
      return;
    }
  //console.log(g_camera.eye.getX()+", "+g_camera.eye.getY()+", "+g_camera.eye.getZ())
  if(collision) {
  if(g_camera.eye.getX() < -5) g_camera.eye.elements[0] = -5;
  if(g_camera.eye.getX() > 5) g_camera.eye.elements[0] = 5;
  if(g_camera.eye.getY() < -0.65) g_camera.eye.elements[1] = -0.65;
  if(g_camera.eye.getZ() < -5) g_camera.eye.elements[2] = -5;
  if(g_camera.eye.getZ() > 5) g_camera.eye.elements[2] = 5; }

  renderAllShapes();
  console.log(ev.keyCode);
}

let teapot = new Model(gl, "../teapot.obj");
function renderAllShapes() {

  var projMat = new Matrix4();
  projMat.setPerspective(60, canvas.width/canvas.height, .1, 1000); // 50,,100
  gl.uniformMatrix4fv(u_ProjectionMatrix, false, projMat.elements);

  var viewMat = new Matrix4();
  viewMat.setLookAt(g_camera.eye.getX(),g_camera.eye.getY(),g_camera.eye.getZ(), g_camera.at.getX(),g_camera.at.getY(),g_camera.at.getZ(), g_camera.up.getX(),g_camera.up.getY(),g_camera.up.getZ()); // {eye,at,up}
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMat.elements);

  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalXAngle, 0, 1, 0);
  globalRotMat.rotate(g_globalYAngle, 1, 0, 0); // Rotation around X-axis (vertical/yaxis)
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // lighting variables
  gl.uniform3f(u_lightPos, g_lightPos[0], g_lightPos[1], g_lightPos[2]);
  gl.uniform3f(u_cameraPos, g_camera.eye.getX(), g_camera.eye.getY(), g_camera.eye.getZ());
  gl.uniform1i(u_lightOn, g_lightOn);
  g_lightColor = [g_lightR, g_lightG, g_lightB];
  gl.uniform3f(u_lightColor, g_lightColor[0], g_lightColor[1], g_lightColor[2]);

  teapot.color = [1.0, 0.0, 0.0, 1.0];
  teapot.matrix.translate(5,-5,0);
  teapot.matrix.scale(.1, 1, 1);
  teapot.matrix.rotate(45, 0, 1, 0);
  teapot.render(gl, gl.program);

  var light = new Cube();
  light.color = [g_lightColor[0], g_lightColor[1], g_lightColor[2],1.0]; // 2,2,0
  light.textureNum=-4;  // -1 
  light.matrix.translate(g_lightPos[0],g_lightPos[1],g_lightPos[2]);
  light.matrix.scale(0.1,0.1,0.1);  // 0.1,0.1,0.1   
  light.matrix.translate(0.5,14,0.5); // -0.5,-0.5,-0.5   0.5,14,0.5
  light.render();

  var ball = new Sphere();
  ball.color = [1.0,1.0,1.0,1.0];
  //ball.textureNum=-1;   
  if (g_NormalOn) ball.textureNum = -3;
  ball.matrix.translate(0, 1.5, 0);
  ball.matrix.scale(0.5, 0.5, 0.5);
  ball.render();

/*
  // floor
  var floor = new Cube();
  floor.color = [1.0,0.0,1.0,1.0];
  floor.textureNum=-1; // -1
  //if (g_NormalOn) floor.textureNum = -3;
  floor.matrix.translate(0, -1, 0.0); // -0.75
  floor.matrix.scale(10, 0, 10);
  floor.matrix.translate(-0.5, 0, -0.5);
  floor.render();
*/

  // sky
  var sky = new Cube();
  sky.color = [0.5,1.0,1.0,1.0];
  sky.textureNum=0; // 0
  if (g_NormalOn) sky.textureNum = -3;
  sky.matrix.scale(10,10,10); //50,50,50);
  sky.matrix.translate(-0.5, -0.5, -0.5);
  sky.render();

  let skinColor = [g_yellowAngle,1.0,0.0,1.0];
  
  var head = new Cube();
  head.color = skinColor;
  //head.textureNum=0;
  if (g_NormalOn) head.textureNum = -3;
  head.matrix.translate(-0.13, 0.6+(g_yellowAngle/45), -0.20); //-0.25, 0.1, 0.0
  head.matrix.rotate(10-(g_yellowAngle*3), -1, 0, 0);
  //head.matrix.rotate(1,-g_yellowAngle, 0, 1);
  head.matrix.scale(0.26, 0.2, 0.3) // 0.5, 1, 0.5
  //head.matrix.rotate((g_yellowAngle), 10, 0, 0);
  headMatrix = new Matrix4(head.matrix);
  head.render();

  var lefteye = new Cube();
  lefteye.color = [g_yellowAngle,0.0,0.0,1.0];
  lefteye.textureNum = -4;
  //if (g_NormalOn) lefteye.textureNum = -3;
  lefteye.matrix = head.matrix;
  lefteye.matrix.translate(-0.13, 0.5+(g_yellowAngle/45), -0.19); //-0.25, 0.1, 0.0
  //nape.matrix.rotate(10-(g_yellowAngle*3), -1, 0, 0);
  //head.matrix.rotate(1,-g_yellowAngle, 0, 1);
  lefteye.matrix.scale(0.26, 0.3, 0.3) // 0.5, 1, 0.5
  //head.matrix.rotate((g_yellowAngle), 10, 0, 0);
  lefteye.render();

  var righteye = new Cube();
  righteye.color = [g_yellowAngle,0.0,0.0,1.0];
  lefteye.textureNum = -4;
  //if (g_NormalOn) righteye.textureNum = -3;
  righteye.matrix = lefteye.matrix;
  righteye.matrix.translate(3.8, 0, 0);
  righteye.render();
  
  var nose = new Cube();
  nose.color = skinColor;
  if (g_NormalOn) nose.textureNum = -3;
  nose.matrix.translate(-0.2, 0.55+(g_yellowAngle/45), -0.25); //-0.25, 0.1, 0.0
  nose.matrix.rotate(10-(g_yellowAngle*3), -1, 0, 0);
  //head.matrix.rotate(1,-g_yellowAngle, 0, 1);
  nose.matrix.scale(0.4, 0.15, 0.3) // 0.5, 1, 0.5
  //head.matrix.rotate((g_yellowAngle), 10, 0, 0);
  nose.render();

  /*
  var mouth = new Cube();
  mouth.color = [1.0,0.0,1.0,1.0];
  if (g_NormalOn) mouth.textureNum = -3;
  mouth.matrix.translate(-0.115, 0.56+(g_yellowAngle/45), 0.1); //-0.19
  mouth.matrix.rotate(-190-(g_yellowAngle*-2), 1, 0, 0);
  //jaw.matrix.rotate(1,1+g_yellowAngle, 0, 1);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  mouth.matrix.scale(0.23, 0.05, 0.3) // 0.23, 0.05, 0.3
  //jaw.matrix.rotate(0, 1-(g_yellowAngle), 0, 0);
  mouth.render();
  */
  
  var jaw = new Cube();
  jaw.color = [1.0,1.0,0.0,1.0];
  if (g_NormalOn) jaw.textureNum = -3;
  jaw.matrix.translate(-0.15, 0.4+(g_yellowAngle/45), -0.2); //-0.25, 0.1, 0.0
  jaw.matrix.rotate(-10+(g_yellowAngle*3), 1, 0, 0);
  //jaw.matrix.rotate(1,1+g_yellowAngle, 0, 1);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  jaw.matrix.scale(0.30, 0.1, 0.3) // 0.5, 1, 0.5
  //jaw.matrix.rotate(0, 1-(g_yellowAngle), 0, 0);
  jaw.render();

  var mouth = new Cube();
  mouth.color = [1.0,0.0,1.0,1.0];
  if (g_NormalOn) mouth.textureNum = -3;
  mouth.matrix = jaw.matrix;
  mouth.matrix.translate(0.22, 1.5+(g_yellowAngle/45), 0.7); //-0.19
  mouth.matrix.rotate(-180, 1, 0, 0);
  //jaw.matrix.rotate(1,1+g_yellowAngle, 0, 1);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  mouth.matrix.scale(0.55, 0.4, .7+Math.abs(g_mouthAngle*0.5)) // 0.23, 0.05, 0.3
  //jaw.matrix.rotate(0, 1-(g_yellowAngle), 0, 0);
  mouth.render();

  var neck = new Cube();
  neck.color = [1.0,1.0,0.0,1.0];
  if (g_NormalOn) neck.textureNum = -3;
  neck.matrix.translate(-0.12, 0.4+(g_yellowAngle/45), -0.1); //-0.25, 0.1, 0.0
  neck.matrix.rotate(-30, 1, 0, 0);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  neck.matrix.scale(0.25, 0.1, 0.2) // 0.5, 1, 0.5
  neck.matrix.rotate(0, 1-(g_yellowAngle), 0, 0);
  neck.render();

// chest
  var outerChest = new Cube();
  outerChest.color = skinColor;
  if (g_NormalOn) outerChest.textureNum = -3;
  outerChest.matrix.translate(-0.26, 0.15+(g_yellowAngle/45), 0.1); //-0.25, 0.1, 0.0
  outerChest.matrix.rotate(-30, 1, 0, 0);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  outerChest.matrix.scale(0.52, 0.31, 0.3) // 0.5, 1, 0.5)
  outerChest.render();
  
  var chest = new Cube();
  chest.color = [1.0,1.0,0.0,1.0];
  if (g_NormalOn) chest.textureNum = -3;
  chest.matrix.translate(-0.25, 0.1+(g_yellowAngle/45), 0.0); //-0.25, 0.1, 0.0
  chest.matrix.rotate(-30, 1, 0, 0);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  chest.matrix.scale(0.5, 0.3, 0.3) // 0.5, 1, 0.5)
  chest.render();

  // core
  var outerCore = new Cube();
  outerCore.color = skinColor;
  if (g_NormalOn) outerCore.textureNum = -3;
  outerCore.matrix = outerChest.matrix;
  outerCore.matrix.translate(0.2, -0.6, -0.35);
  outerCore.matrix.rotate(30, 2, 0, 0);
  //core.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  outerCore.matrix.scale(0.6, 1, 0.6) // 0.5, 1, 0.5
  var outerCoreMatrix = new Matrix4(outerCore.matrix);
  outerCore.render();
  
  var core = new Cube();
  core.color = [1.0,1.0,0.0,1.0];
  if (g_NormalOn) core.textureNum = -3;
  core.matrix = chest.matrix;
  core.matrix.translate(0.2, -0.6, 0.0);
  core.matrix.rotate(30, 2, 0, 0);
  //core.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  core.matrix.scale(0.6, 1, 0.6) // 0.5, 1, 0.5
  var coreMatrix = new Matrix4(core.matrix);
  core.render();

  //right leg
  var rightThigh = new Cube();
  rightThigh.color = skinColor;
  if (g_NormalOn) rightThigh.textureNum = -3;
  rightThigh.matrix = coreMatrix;
  rightThigh.matrix.translate(0.6, -0.8, 0.01);
  rightThigh.matrix.rotate(-g_yellowAngle, 0, 1, 1);
  rightThigh.matrix.scale(0.4, 0.8, 1.2);
  rightThigh.render();

  var rightCalf = new Cube();
  rightCalf.color = [1.0,0.0,0.0,1.0];
  if (g_NormalOn) rightCalf.textureNum = -3;
  rightCalf.matrix = rightThigh.matrix;
  rightCalf.matrix.translate(0, -0.4, 0.01);
  //rightThigh.matrix.rotate(g_yellowAngle, 0, 1, 1);
  rightCalf.matrix.scale(1, 1.5, 0.8);
  rightCalf.matrix.rotate(50, 90, 0, 1);
  rightCalf.matrix.rotate(10, -g_yellowAngle, 0, 1);
  rightCalf.render();

  //left leg
  var leftThigh = new Cube();
  leftThigh.color = skinColor;
  if (g_NormalOn) leftThigh.textureNum = -3;
  leftThigh.matrix = core.matrix;
  leftThigh.matrix.translate(0, -0.8, 0.01);
  leftThigh.matrix.rotate(+g_yellowAngle, 0, 1, 1);
  leftThigh.matrix.scale(0.4, 0.8, 1.2);
  leftThigh.render();

  var leftCalf = new Cube();
  leftCalf.color = [1.0,0.0,0.0,1.0];
  if (g_NormalOn) leftCalf.textureNum = -3;
  leftCalf.matrix = leftThigh.matrix;
  leftCalf.matrix.translate(0, -0.4, 0.01);
  //rightThigh.matrix.rotate(g_yellowAngle, 0, 1, 1);
  leftCalf.matrix.scale(1, 1.5, 0.8);
  leftCalf.matrix.rotate(50, 90, 0, 1);
  leftCalf.matrix.rotate(-10, g_yellowAngle, 0, 1);
  leftCalf.render();

  // right arm 
  var rightShoulder = new Cube();
  rightShoulder.color = skinColor;
  if (g_NormalOn) rightShoulder.textureNum = -3;
  rightShoulder.matrix.translate(0.37, 0.2+(g_yellowAngle/45), 0.0);
  rightShoulder.matrix.rotate(45.0, 0.0, 0.0, 1.0);
  rightShoulder.matrix.rotate(g_armAngle, -1.0, 1.0, 0.0);
  rightShoulder.matrix.rotate(-g_yellowAngle, 1, 0, 1); //-g_yellowAngle, 0, 0, 1
  rightShoulder.matrix.scale(0.3, 0.3, 0.3); // 0.25, 0.7, 0.5
  rightShoulder.render();
  
  var rightBicep = new Cube();
  rightBicep.color = skinColor;
  if (g_NormalOn) rightBicep.textureNum = -3;
  rightBicep.matrix = rightShoulder.matrix;
  rightBicep.matrix.translate(-0.9, -0.6, -0.1);
  rightBicep.matrix.rotate(-40.0, 0.0, 0.0, 1.0);
  rightBicep.matrix.rotate(g_handAngle, 1.0, 0.0, 0.0);
  rightBicep.matrix.scale(1, 1.5, 1.2); // 0.25, 0.7, 0.5
  rightBicep.matrix.translate(-0.1, 0.2, 0.0);
  rightBicep.matrix.rotate(-40.0, 0.0, 0.0, 1.0); //rightBicep.matrix.scale(1, 1.8, 1.2); // 0.25, 0.7, 0.5
  rightBicep.render();

/*
  var rightHand = new Cube();
  rightHand.color = [1.0,0.0,0.0,1.0];
  if (g_NormalOn) rightHand.textureNum = -3;
  rightHand.matrix = rightBicep.matrix;
  rightHand.matrix.translate(0.2, -.25, 0.15);
  rightHand.matrix.rotate(-50, 0.0, 0.0, 1.0); // -40
  rightHand.matrix.scale(0.5, 0.8, 0.7);
  rightHand.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  //rightHand.render();
  rightHand.drawTriangularPrism();
*/
  var rightHand = new Cube();
  rightHand.color = [1.0,0.0,0.0,1.0];
  if (g_NormalOn) rightHand.textureNum = -3;
  rightHand.matrix = rightBicep.matrix;
  rightHand.matrix.translate(0.2, -.25, 0.15);
  rightHand.matrix.rotate(-50, 1.0, 0.0, 1.0); // (-50, 1.0, 0.0, 1.0);
  rightHand.matrix.scale(0.5, 0.8, 0.7);
  rightHand.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  //rightHand.render();
  rightHand.drawTriangularPrism();
  
  // left arm
  var leftShoulder = new Cube();
  leftShoulder.color = skinColor;
  if (g_NormalOn) leftShoulder.textureNum = -3;
  leftShoulder.matrix.translate(-0.37, 0.2+(g_yellowAngle/45), 0.0);
  leftShoulder.matrix.rotate(45.0, 0.0, 0.0, 1.0);
  leftShoulder.matrix.rotate(g_armAngle, -1.0, 1.0, 0.0);
  leftShoulder.matrix.rotate(g_yellowAngle, 0, 1, 1);
  leftShoulder.matrix.scale(0.3, 0.3, 0.3); // 0.25, 0.7, 0.5
  leftShoulder.render();

  var leftBicep = new Cube();
  leftBicep.color = skinColor;
  if (g_NormalOn) leftBicep.textureNum = -3;
  leftBicep.matrix = leftShoulder.matrix;
  leftBicep.matrix.translate(-1.4, -.1, -0.1);
  leftBicep.matrix.rotate(-50, 0.0, 0.0, 1.0);
  leftBicep.matrix.rotate(g_handAngle, 1.0, 0.0, 0.0);
  leftBicep.matrix.scale(1, 1.5, 1.2);
  leftBicep.matrix.translate(0.45, -0.35, 0.0);
  leftBicep.matrix.rotate(40.0, 0.0, 0.0, 1.0);
  leftBicep.render();

/*
  var leftHand = new Cube();
  leftHand.color = [1.0,0.0,0.0,1.0];
  leftHand.matrix = leftBicep.matrix;
  leftHand.matrix.translate(-0.15, 0, 0.15);
  leftHand.matrix.rotate(-50, 0.0, 0.0, 1.0);
  leftHand.matrix.scale(0.8, 0.5, 0.7);
  leftHand.matrix.rotate(g_yellowAngle, 0, 0, 1);
  leftHand.render();
*/
  var leftHand = new Cube();
  leftHand.color = [1.0,0.0,0.0,1.0];
  if (g_NormalOn) leftHand.textureNum = -3;
  leftHand.matrix = leftBicep.matrix;
  leftHand.matrix.translate(0.35, -0.6, 0.15);
  leftHand.matrix.rotate(50, -1.0, 0.0, 1.0);
  leftHand.matrix.scale(0.5, 0.8, 0.7);
  leftHand.matrix.rotate(g_yellowAngle, 0, 0, 1);
  leftHand.drawTriangularPrism();

  //var duration = performance.now - startTime;
  //sendTextToHTML(" ms: " + Math.floor(duration) + " fps: " + Math.floor(10000/duration));
}

function sendTextToHTML(text, htmlID) {
  var htmlElm = document.getELementById(htmlID);
  if(!htmlElm) {
    console.log("Failed to get " + htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}