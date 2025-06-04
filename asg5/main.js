import * as THREE from 'three';
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

// canvas+renderer
const canvas = document.querySelector( '#c' );
const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

// texture loader
const loader = new THREE.TextureLoader();
const texture = loader.load( 'gold.jpg' );
texture.colorSpace = THREE.SRGBColorSpace;
const crystal = loader.load( 'crystal.jpg' );
crystal.colorSpace = THREE.SRGBColorSpace;

var dolphin
// OBJ+MTL loader
{
  const objLoader = new OBJLoader();
  const mtlLoader = new MTLLoader();
  mtlLoader.load('Dolphin_Low_Poly.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
  objLoader.load('Dolphin_Low_Poly.obj', (dolphinL) => {
    dolphin = dolphinL;
    dcube.add(dolphin);
    // dolphin.add(camera); // camera change
  });
  });
}

// materials
const indigo = new THREE.MeshPhongMaterial( { color: 0x8F00FF} );
const blue = new THREE.MeshPhongMaterial( { color: 0x0400FF} );
const green = new THREE.MeshPhongMaterial( { color: 0x04FF00} );
const orange = new THREE.MeshPhongMaterial( { color: 0xFF9100} );
const red = new THREE.MeshPhongMaterial( { color: 0xFF0000} );
const brown = new THREE.MeshPhongMaterial( { color: 0x543000} );
const material = new THREE.MeshPhongMaterial({ map: texture });
const diamond = new THREE.MeshPhongMaterial({ map: crystal });

// user buttons
var f1cam = false;
var f2cam = false;
var f3cam = false;
var f4cam = false;
var f5cam = false;
var s1cam = false;
var s2cam = false;
var s3cam = false;
var s4cam = false;
var dcam = false;
var crystalMode = false;
var showGui = true;
window.addEventListener('keydown', (e) => {
  if(e.key == 1)
  {
    f1cam = !f1cam;
    if (f1cam) {
      fb1.add(camera);
    } else {
      scene.add(camera);
    }
    f2cam = false;
    f3cam = false;
    f4cam = false;
    f5cam = false;
    s1cam = false;
    s2cam = false;
    s3cam = false;
    s4cam = false;
    dcam = false;
  }
  if(e.key == 2)
  {
    f2cam = !f2cam;
    if (f2cam) {
      fb2.add(camera);
    } else {
      scene.add(camera);
    }
    f1cam = false;
    f3cam = false;
    f4cam = false;
    f5cam = false;
    s1cam = false;
    s2cam = false;
    s3cam = false;
    s4cam = false;
    dcam = false;
  }
  if(e.key == 3)
  {
    f3cam = !f3cam;
    if (f3cam) {
      fb3.add(camera);
    } else {
      scene.add(camera);
    }
    f1cam = false;
    f2cam = false;
    f4cam = false;
    f5cam = false;
    s1cam = false;
    s2cam = false;
    s3cam = false;
    s4cam = false;
    dcam = false;
  }
  if(e.key == 4)
  {
    f4cam = !f4cam;
    if (f4cam) {
      fb4.add(camera);
    } else {
      scene.add(camera);
    }
    f1cam = false;
    f2cam = false;
    f3cam = false;
    f5cam = false;
    s1cam = false;
    s2cam = false;
    s3cam = false;
    s4cam = false;
    dcam = false;
  }
  if(e.key == 5)
  {
    f5cam = !f5cam;
    if (f5cam) {
      fb5.add(camera);
    } else {
      scene.add(camera);
    }
    f1cam = false;
    f2cam = false;
    f3cam = false;
    f4cam = false;
    s1cam = false;
    s2cam = false;
    s3cam = false;
    s4cam = false;
    dcam = false;
  }
  if(e.key == 6)
  {
    s1cam = !s1cam;
    if (s1cam) {
      b1b.add(camera);
    } else {
      scene.add(camera);
    }
    f1cam = false;
    f2cam = false;
    f3cam = false;
    f4cam = false;
    f5cam = false;
    s2cam = false;
    s3cam = false;
    s4cam = false;
    dcam = false;
  }
  if(e.key == 7)
  {
    s2cam = !s2cam;
    if (s2cam) {
      b2b.add(camera);
    } else {
      scene.add(camera);
    }
    f1cam = false;
    f2cam = false;
    f3cam = false;
    f4cam = false;
    f5cam = false;
    s1cam = false;
    s3cam = false;
    s4cam = false;
    dcam = false;
  }
  if(e.key == 8)
  {
    s3cam = !s3cam;
    if (s3cam) {
      b3b.add(camera);
    } else {
      scene.add(camera);
    }
    f1cam = false;
    f2cam = false;
    f3cam = false;
    f4cam = false;
    f5cam = false;
    s1cam = false;
    s2cam = false;
    s4cam = false;
    dcam = false;
  }
  if(e.key == 9)
  {
    s4cam = !s4cam;
    if (s4cam) {
      b4b.add(camera);
    } else {
      scene.add(camera);
    }
    f1cam = false;
    f2cam = false;
    f3cam = false;
    f4cam = false;
    f5cam = false;
    s1cam = false;
    s2cam = false;
    s3cam = false;
    dcam = false;
  }
  if(e.key == 0)
  {
    dcam = !dcam;
    if (dcam) {
      dolphin.add(camera);
      //camera.lookAt(dolphin.position);
    } else {
      scene.add(camera);
    }
    f1cam = false;
    f2cam = false;
    f3cam = false;
    f4cam = false;
    f5cam = false;
    s1cam = false;
    s2cam = false;
    s3cam = false;
    s4cam = false;
  }
  if(e.key == 'd' || e.key == 'D') {
    crystalMode = !crystalMode;
    islandc.visible = crystalMode;
    islandc1.visible = crystalMode;
    islandc2.visible = crystalMode;
    islandc3.visible = crystalMode;
  }
  if(e.key == 'h' || e.key == 'H') {
    showGui = !showGui;
    gui.domElement.style.opacity = showGui ? "1" : "0";
  }
  if(e.key == 'r' || e.key == 'R') {
    window.location.reload();
  }
});

// camera
const fov = 75;
const aspect = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
camera.position.z = 45; // 5->15

// orbit controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0, 0);
controls.update();

// window/scene
const scene = new THREE.Scene();
//const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth-20 , window.innerHeight-20 );
renderer.domElement.style.position = "absolute";
renderer.domElement.style.top = "10px";
renderer.domElement.style.left = "10px";
renderer.domElement.style.right = "10px";
document.body.appendChild( renderer.domElement );

// skybox loader
{
const loader = new THREE.TextureLoader(); // fantasySkybox.jpg  box2.png
const texture = loader.load(
    'box2.png',
    () => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    });
}

// GUI
const instructions = {
    R: "RESET",
    1: "fish1",
    2: "fish2",
    3: "fish3",
    4: "fish4",
    5: "fish5",
    6: "seagull1",
    7: "seagull2",
    8: "seagull3",
    9: "seagull4",
    0: "dolphin",
    D: "MegaDiamondMode!",
    H: "HIDE GUI"
};
const gui = new GUI();
gui.title("Dolphin Diamond Dream");
gui.domElement.style.position = 'absolute';
gui.domElement.style.opacity = showGui ? "1" : "0";
gui.domElement.style.top = '10px';
gui.domElement.style.left = '10px';
gui.domElement.style.width = "200px";
gui.add(instructions, "1").disable();
gui.add(instructions, "2").disable();
gui.add(instructions, "3").disable();
gui.add(instructions, "4").disable();
gui.add(instructions, "5").disable();
gui.add(instructions, "6").disable();
gui.add(instructions, "7").disable();
gui.add(instructions, "8").disable();
gui.add(instructions, "9").disable();
gui.add(instructions, "0").disable();
gui.add(instructions, "D").disable();
gui.add(instructions, "R").disable();
gui.add(instructions, "H").disable();

// ambient lighting
const acolor = 0xFF9500; // EBBB00
const aintensity = 5; // 1
const alight = new THREE.AmbientLight(acolor, aintensity);
scene.add(alight);

// phong lighting
const color = 0xFFFFFF;
const intensity = 5; // 3
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(10, 2, -4); //-1, 2, 4
scene.add(light);

// hemisphere
const groundColor = 0xB1E1FF; // brownish orange
const skyColor = 0x4DFFD2;  // light blue B97A20
const hintensity = 5;
const hlight = new THREE.HemisphereLight(groundColor, skyColor, hintensity);
scene.add(hlight);

// gold cube - 1
const cube = new THREE.BoxGeometry( .5, .5, .5 );
const gold = new THREE.Mesh( cube, material );
gold.position.y = 4.5;
scene.add( gold );

// pyramid - 2
const frustrum = new THREE.SphereGeometry(
	5.0,
	4, 1,
	Math.PI * 0.50, Math.PI * 2.00,
	-Math.PI * 0.50, Math.PI  ); // 80, 66
const pyramid = new THREE.Mesh(frustrum, material);
pyramid.position.y = -2;
scene.add(pyramid);

// island - 3, 4
const land1 = new THREE.SphereGeometry(
	15.0,
	12, 1,
	0, Math.PI * 2.00,
	0.0, Math.PI * 0.30 ); // 80, 66 0xF7C663
const sand = new THREE.MeshPhongMaterial({ color: 0xAA8844});
const island1 = new THREE.Mesh(land1, sand);
island1.position.y = -15.83;
scene.add(island1);
const land2 = new THREE.ConeGeometry(
	12.1, -10.0,
	12, 1,
	true,
	0, -Math.PI * 2.00 );
const island2 = new THREE.Mesh(land2, sand);
island2.position.y = -12;
scene.add(island2);

// water - 5
var radius = 12.0;
var height = 6.0;
const torus = new THREE.TorusGeometry(radius, height, 15, 12 );
const sea = new THREE.MeshPhongMaterial({ color: 0x62F2FC,
    transparent: true,
    opacity: 0.5
});
const water = new THREE.Mesh(torus, sea);
water.position.y = -10; // -12.5
water.rotation.x = 33;
scene.add(water);

// dolphin cube - 6
const objcube = new THREE.BoxGeometry( .01, .01, .01 );
const dcube = new THREE.Mesh( objcube, material );
scene.add( dcube );

// fish1 - 7, 8
const fbody = new THREE.BoxGeometry( 0.4, 0.25, 0.2 );
const ftail = new THREE.BoxGeometry( 0.3, 0.30, 0.05 );
const fb1 = new THREE.Mesh( fbody, indigo );
fb1.position.z = 10;
scene.add( fb1 );
const ft1 = new THREE.Mesh( ftail, blue );
fb1.add( ft1 );
ft1.position.x += 0.35;

// fish2 - 9, 10
const fb2 = new THREE.Mesh( fbody, blue );
fb2.position.z = 10;
scene.add( fb2 );
const ft2 = new THREE.Mesh( ftail, green );
fb2.add( ft2 );
ft2.position.x += 0.35;

// fish3 - 11, 12
const fb3 = new THREE.Mesh( fbody, green );
fb3.position.z = 10;
scene.add( fb3 );
const ft3 = new THREE.Mesh( ftail, orange );
fb3.add( ft3 );
ft3.position.x += 0.35;

// fish4 - 13, 14
const fb4 = new THREE.Mesh( fbody, orange );
fb4.position.z = 10;
scene.add( fb4 );
const ft4 = new THREE.Mesh( ftail, red );
fb4.add( ft4 );
ft4.position.x += 0.35;

// fish5 - 15, 16
const fb5 = new THREE.Mesh( fbody, red );
fb5.position.z = 10;
scene.add( fb5 );
const ft5 = new THREE.Mesh( ftail, indigo );
fb5.add( ft5 );
ft5.position.x += 0.35;

// birds 17,18,19, 20,21,22, 23,24,25, 26,27,28
const wing = new THREE.BoxGeometry( 0.3, 0.05, 0.6 );
const b1b = new THREE.Mesh( fbody, diamond );
const b1w1 = new THREE.Mesh( wing, diamond );
const b1w2 = new THREE.Mesh( wing, diamond );
b1w1.position.z += 0.3;
b1w2.position.z -= 0.3;
scene.add( b1b );
b1b.add( b1w1 );
b1b.add( b1w2 );
const b2b = new THREE.Mesh( fbody, diamond );
const b2w1 = new THREE.Mesh( wing, diamond );
const b2w2 = new THREE.Mesh( wing, diamond );
b2w1.position.z += 0.3;
b2w2.position.z -= 0.3;
scene.add( b2b );
b2b.add( b2w1 );
b2b.add( b2w2 );
const b3b = new THREE.Mesh( fbody, diamond );
const b3w1 = new THREE.Mesh( wing, diamond );
const b3w2 = new THREE.Mesh( wing, diamond );
b3w1.position.z += 0.3;
b3w2.position.z -= 0.3;
scene.add( b3b );
b3b.add( b3w1 );
b3b.add( b3w2 );
const b4b = new THREE.Mesh( fbody, diamond );
const b4w1 = new THREE.Mesh( wing, diamond );
const b4w2 = new THREE.Mesh( wing, diamond );
b4b.position.z = 10;
b4w1.position.z += 0.3;
b4w2.position.z -= 0.3;
scene.add( b4b );
b4b.add( b4w1 );
b4b.add( b4w2 );

// island crystals 29,30,31,32
const shard1 = new THREE.CylinderGeometry(3, 0, 10, 3 );
const shard = new THREE.CylinderGeometry(0, 3, 10, 3 );
const islandc = new THREE.Mesh( shard1, diamond);
islandc.position.y = -19; // 19
scene.add( islandc );
const islandc1 = new THREE.Mesh( shard, diamond);
islandc1.rotation.z = 1.5;
islandc1.position.y = -10;
islandc1.scale.set(0.5,0.5,0.5);
scene.add( islandc1 );
const islandc2 = new THREE.Mesh( shard, diamond);
islandc2.rotation.z = 1.5;
islandc2.position.y = -10;
islandc2.scale.set(0.5,0.5,0.5);
scene.add( islandc2 );
const islandc3 = new THREE.Mesh( shard, diamond);
islandc3.rotation.z = 1.5;
islandc3.position.y = -10;
islandc3.scale.set(0.5,0.5,0.5);
scene.add( islandc3 );
islandc.visible = crystalMode;
islandc1.visible = crystalMode;
islandc2.visible = crystalMode;
islandc3.visible = crystalMode;

function render(time) {
  time *= 0.001;  // convert time to seconds
 
  if(crystalMode)
  {
    gold.material = diamond;
    gold.rotation.x = time*5;
    gold.rotation.y = time*5;
    gold.position.y = Math.sin(time)*2+10;
    pyramid.material = diamond;
    pyramid.rotation.y = -time;
    dcube.rotation.z = 0;
    dcube.position.y = 1.5*(Math.pow(Math.cos(2 * Math.sin(time)), 2)*(Math.cos(time*2)*5-8))*5+10;
    island1.rotation.y = -time;
    island2.rotation.y = -time;
    islandc.rotation.y = -time;
    islandc1.rotation.y = time*0.25+1.66;
    islandc1.position.x = Math.sin(time*0.25)*22;
    islandc1.position.z = Math.cos(time*0.25)*22;
    islandc2.rotation.y = time*0.25-0.45;
    islandc2.position.x = -Math.sin(time*0.25-5.2)*22;
    islandc2.position.z = -Math.cos(time*0.25-5.2)*22;
    islandc3.rotation.y = time*0.25-2.55;
    islandc3.position.x = Math.sin(time*0.25-10.4)*22;
    islandc3.position.z = Math.cos(time*0.25-10.4)*22;
  }
  else
  {
    gold.material = material;
    pyramid.material = material;
    gold.rotation.x = time;
    gold.rotation.y = time;
    gold.position.y = Math.sin(time)*0.5+4.5;
    if(dcam)
    dcube.rotation.z = 0;
    else
    dcube.rotation.z = time*2; //happy dolphin!
    dcube.position.y = 1.5*Math.pow(Math.cos(2 * Math.sin(time)), 2)*5-8;
  }

  // dolphin animation
  dcube.rotation.x = -(Math.pow(Math.cos(2 * Math.sin(time)), 2)*Math.cos(time))*0.5;
  dcube.rotation.y = -time;
  dcube.position.x = Math.cos(time)*15;
  //Math.cos(time*2)*5 - 8;
  dcube.position.z = Math.sin(time)*15;

  // fishes
  fb1.rotation.y = -time*0.5 + 1.5;
  ft1.rotation.y = -Math.sin(time*5)/2;
  fb1.position.x = Math.cos(time*0.5)*15;
  fb1.position.y = Math.cos(time)*2 - 10;
  fb1.position.z = Math.sin(time*0.5)*15;

  fb2.rotation.y = -time*0.5 + 1.5;
  ft2.rotation.y = -Math.sin(time*4.8)/2;
  fb2.position.x = Math.cos(time*0.5)*13;
  fb2.position.y = Math.cos(time)*1.5 - 11;
  fb2.position.z = Math.sin(time*0.5)*13+1;

  fb3.rotation.y = -time*0.5 + 1.5;
  ft3.rotation.y = -Math.sin(time*5.2)/2;
  fb3.position.x = Math.cos(time*0.5)*14+1;
  fb3.position.y = Math.cos(time)*2.5 - 9;
  fb3.position.z = Math.sin(time*0.5)*14;

  fb4.rotation.y = -time*0.5 + 1.5;
  ft4.rotation.y = -Math.sin(time*5)/2;
  fb4.position.x = Math.cos(time*0.5)*13.5-1;
  fb4.position.y = Math.cos(time)*2 - 12;
  fb4.position.z = Math.sin(time*0.5)*13.5;

  fb5.rotation.y = -time*0.5 + 1.5;
  ft5.rotation.y = -Math.sin(time*5)/2;
  fb5.position.x = Math.cos(time*0.5)*14.5;
  fb5.position.y = Math.cos(time)*2 - 8;
  fb5.position.z = Math.sin(time*0.5)*14.5-1;
  
  // birds
  b1w1.rotation.x = Math.sin(time)/2;
  b1w2.rotation.x = -Math.sin(time)/2;
  b1b.rotation.y = time;
  b1b.position.x = Math.sin(time)*10;
  b1b.position.y = Math.sin(time)*10+10;
  b1b.position.z = Math.cos(time)*10+0.5;

  b2w1.rotation.x = Math.sin(time)/2;
  b2w2.rotation.x = -Math.sin(time)/2;
  b2b.rotation.y = time;
  b2b.position.x = -Math.sin(time)*10;
  b2b.position.y = -Math.sin(time*0.5)*10+10;
  b2b.position.z = -Math.cos(time)*10+0.5;

  b3w1.rotation.x = Math.sin(time)/2;
  b3w2.rotation.x = -Math.sin(time)/2;
  b3b.rotation.y = -time-1.5;
  b3b.position.x = Math.cos(time)*10;
  b3b.position.y = -Math.cos(time*2)*10+10;
  b3b.position.z = Math.sin(time)*10+0.5;

  b4w1.rotation.x = Math.sin(time*2)/2;
  b4w2.rotation.x = -Math.sin(time*2)/2;
  b4b.rotation.y = -time*2-1.5;
  b4b.position.x = Math.cos(time*2)*10;
  b4b.position.y = Math.cos(time)*10+10;
  b4b.position.z = Math.sin(time*2)*10+0.5;

  // waves
  const newHeight = 6.0 + Math.cos(time)*0.5;
  water.geometry.dispose(); // Clean up old geometry
  water.geometry = new THREE.TorusGeometry(12, newHeight, 15, 12);

  renderer.render(scene, camera);
 
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
