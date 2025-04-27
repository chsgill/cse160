// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_GlobalRotateMatrix;
  void main() {
    gl_Position = u_GlobalRotateMatrix * u_ModelMatrix * a_Position;
  }`

// Fragment shader program
var FSHADER_SOURCE =`
  precision mediump float;
  uniform vec4 u_FragColor; // uniform変数
  void main() {
    gl_FragColor = u_FragColor;
  }`

// Globals
let canvas;
let gl;
let a_Postion;
let a_FragColor;
let u_Size;
let u_ModelMatrix;
let u_GlobalRotateMatrix;

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

function addActionsForHtmlUI(){
  document.getElementById('animationButton').onclick = function() { g_yellowAnimation = !g_yellowAnimation; }

  document.getElementById('resetButton').onclick = function() { g_yellowAngle = 0; g_globalXAngle = 0; g_globalYAngle = 0; g_armAngle = 0; g_handAngle = 0;}

  document.getElementById('xangleSlide').addEventListener('mousemove', function() {g_globalXAngle = this.value; renderAllShapes(); });

  document.getElementById('yangleSlide').addEventListener('mousemove', function() {g_globalYAngle = this.value; renderAllShapes(); });  

  document.getElementById('armSlide').addEventListener('mousemove', function() {g_armAngle = this.value; renderAllShapes(); });

  document.getElementById('handSlide').addEventListener('mousemove', function() {g_handAngle = this.value; renderAllShapes(); });
}

function main() {

  setupWebGL();
  connectVariablesToGLSL();
  addActionsForHtmlUI();

  
  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = handleMouseMove;

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Render
  requestAnimationFrame(tick);
}

var g_shapesList = []; // ignore for now

function handleMouseMove(ev) {
  let [x,y] =  convertCoordinatesEventToGL(ev);

  if (x < -0.2) g_globalXAngle--;
  if (x > 0.2) g_globalXAngle++;
  if (y < -0.2) g_globalYAngle--;
  if (y > 0.2) g_globalYAngle++;
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
}
function renderAllShapes(){

  //var startTine = performance.now();

  var globalRotMat = new Matrix4();
  globalRotMat.rotate(g_globalXAngle, 0, 1, 0);
  globalRotMat.rotate(g_globalYAngle, 1, 0, 0); // Rotation around X-axis (vertical/yaxis)
  gl.uniformMatrix4fv(u_GlobalRotateMatrix, false, globalRotMat.elements);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.clear(gl.COLOR_BUFFER_BIT);

  //var len = g_shapesList.length;
  //for(var i = 0; i < len; i++) {
  //  g_shapesList[i].render();
  //}

  //drawTriangle3D( [-1.0,0.0,0.0, -0.5,-1.0,0.0, 0.0,0.0,0.0] );

  let skinColor = [g_yellowAngle,1.0,0.0,1.0];
  
  var head = new Cube();
  head.color = skinColor;
  head.matrix.translate(-0.13, 0.6+(g_yellowAngle/45), -0.20); //-0.25, 0.1, 0.0
  head.matrix.rotate(10-(g_yellowAngle*3), -1, 0, 0);
  //head.matrix.rotate(1,-g_yellowAngle, 0, 1);
  head.matrix.scale(0.26, 0.2, 0.3) // 0.5, 1, 0.5
  //head.matrix.rotate((g_yellowAngle), 10, 0, 0);
  headMatrix = new Matrix4(head.matrix);
  head.render();

  var lefteye = new Cube();
  lefteye.color = [g_yellowAngle,0.0,0.0,1.0];
  lefteye.matrix = head.matrix;
  lefteye.matrix.translate(-0.13, 0.5+(g_yellowAngle/45), -0.19); //-0.25, 0.1, 0.0
  //nape.matrix.rotate(10-(g_yellowAngle*3), -1, 0, 0);
  //head.matrix.rotate(1,-g_yellowAngle, 0, 1);
  lefteye.matrix.scale(0.26, 0.3, 0.3) // 0.5, 1, 0.5
  //head.matrix.rotate((g_yellowAngle), 10, 0, 0);
  lefteye.render();

  var righteye = new Cube();
  righteye.color = [g_yellowAngle,0.0,0.0,1.0];
  righteye.matrix = lefteye.matrix;
  righteye.matrix.translate(3.8, 0, 0);
  righteye.render();
  
  var nose = new Cube();
  nose.color = skinColor;
  nose.matrix.translate(-0.2, 0.55+(g_yellowAngle/45), -0.25); //-0.25, 0.1, 0.0
  nose.matrix.rotate(10-(g_yellowAngle*3), -1, 0, 0);
  //head.matrix.rotate(1,-g_yellowAngle, 0, 1);
  nose.matrix.scale(0.4, 0.15, 0.3) // 0.5, 1, 0.5
  //head.matrix.rotate((g_yellowAngle), 10, 0, 0);
  nose.render();

  /*
  var mouth = new Cube();
  mouth.color = [1.0,0.0,1.0,1.0];
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
  jaw.matrix.translate(-0.15, 0.4+(g_yellowAngle/45), -0.2); //-0.25, 0.1, 0.0
  jaw.matrix.rotate(-10+(g_yellowAngle*3), 1, 0, 0);
  //jaw.matrix.rotate(1,1+g_yellowAngle, 0, 1);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  jaw.matrix.scale(0.30, 0.1, 0.3) // 0.5, 1, 0.5
  //jaw.matrix.rotate(0, 1-(g_yellowAngle), 0, 0);
  jaw.render();

  var mouth = new Cube();
  mouth.color = [1.0,0.0,1.0,1.0];
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
  neck.matrix.translate(-0.12, 0.4+(g_yellowAngle/45), -0.1); //-0.25, 0.1, 0.0
  neck.matrix.rotate(-30, 1, 0, 0);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  neck.matrix.scale(0.25, 0.1, 0.2) // 0.5, 1, 0.5
  neck.matrix.rotate(0, 1-(g_yellowAngle), 0, 0);
  neck.render();

// chest
  var outerChest = new Cube();
  outerChest.color = skinColor;
  outerChest.matrix.translate(-0.26, 0.15+(g_yellowAngle/45), 0.1); //-0.25, 0.1, 0.0
  outerChest.matrix.rotate(-30, 1, 0, 0);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  outerChest.matrix.scale(0.52, 0.31, 0.3) // 0.5, 1, 0.5)
  outerChest.render();
  
  var chest = new Cube();
  chest.color = [1.0,1.0,0.0,1.0];
  chest.matrix.translate(-0.25, 0.1+(g_yellowAngle/45), 0.0); //-0.25, 0.1, 0.0
  chest.matrix.rotate(-30, 1, 0, 0);
  //chest.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  chest.matrix.scale(0.5, 0.3, 0.3) // 0.5, 1, 0.5)
  chest.render();

  // core
  var outerCore = new Cube();
  outerCore.color = skinColor;
  outerCore.matrix = outerChest.matrix;
  outerCore.matrix.translate(0.2, -0.6, -0.35);
  outerCore.matrix.rotate(30, 2, 0, 0);
  //core.matrix.rotate(-g_yellowAngle, 0, 0, 1);
  outerCore.matrix.scale(0.6, 1, 0.6) // 0.5, 1, 0.5
  var outerCoreMatrix = new Matrix4(outerCore.matrix);
  outerCore.render();
  
  var core = new Cube();
  core.color = [1.0,1.0,0.0,1.0];
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
  rightThigh.matrix = coreMatrix;
  rightThigh.matrix.translate(0.6, -0.8, 0.01);
  rightThigh.matrix.rotate(-g_yellowAngle, 0, 1, 1);
  rightThigh.matrix.scale(0.4, 0.8, 1.2);
  rightThigh.render();

  var rightCalf = new Cube();
  rightCalf.color = [1.0,0.0,0.0,1.0];
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
  leftThigh.matrix = core.matrix;
  leftThigh.matrix.translate(0, -0.8, 0.01);
  leftThigh.matrix.rotate(+g_yellowAngle, 0, 1, 1);
  leftThigh.matrix.scale(0.4, 0.8, 1.2);
  leftThigh.render();

  var leftCalf = new Cube();
  leftCalf.color = [1.0,0.0,0.0,1.0];
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
  rightShoulder.matrix.translate(0.37, 0.2+(g_yellowAngle/45), 0.0);
  rightShoulder.matrix.rotate(45.0, 0.0, 0.0, 1.0);
  rightShoulder.matrix.rotate(g_armAngle, -1.0, 1.0, 0.0);
  rightShoulder.matrix.rotate(-g_yellowAngle, 1, 0, 1); //-g_yellowAngle, 0, 0, 1
  rightShoulder.matrix.scale(0.3, 0.3, 0.3); // 0.25, 0.7, 0.5
  rightShoulder.render();
  
  var rightBicep = new Cube();
  rightBicep.color = skinColor;
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
  leftShoulder.matrix.translate(-0.37, 0.2+(g_yellowAngle/45), 0.0);
  leftShoulder.matrix.rotate(45.0, 0.0, 0.0, 1.0);
  leftShoulder.matrix.rotate(g_armAngle, -1.0, 1.0, 0.0);
  leftShoulder.matrix.rotate(g_yellowAngle, 0, 1, 1);
  leftShoulder.matrix.scale(0.3, 0.3, 0.3); // 0.25, 0.7, 0.5
  leftShoulder.render();

  var leftBicep = new Cube();
  leftBicep.color = skinColor;
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