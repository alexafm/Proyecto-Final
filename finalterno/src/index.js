/* global $, THREE */
'use strict';

var scene, camera, renderer;
var controls;
var canvas;

var groupMTL;
var groupOBJ;

var STATES = {
  INITIAL  : 0,
  PANNING  : 1,
  CONTROLS : 2,
  ROTATE   : 3
};

var state = STATES.INITIAL;
var Z_STOP = 9.0;

var glowMaterial = new THREE.MeshPhongMaterial({
  color    : 0xff0000,
  emmisive : 0xe31818,
  shininess: 100,
  side : THREE.DoubleSide
});

var raycaster = new THREE.Raycaster();
var mouse     = new THREE.Vector2();

function setup () {

  // Begin creation of THREE basic objects
  canvas = $('canvas')[0];

  scene = new THREE.Scene();

  // Create the camera
  var aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
  camera.position.z = 20;
  camera.position.y = 2;
  camera.lookAt(new THREE.Vector3(0, 2, 0));

  // Renderer
  renderer = new THREE.WebGLRenderer({
    canvas    : canvas,
    antialias : true,
    alpha     : true
  });
  renderer.setClearColor(0x000000);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Light setup
  var ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  scene.add(new THREE.AxisHelper(100));

  // Key fill rim
  var keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
  keyLight.position.set( -35, 30, 35 );

  var fillLight = new THREE.DirectionalLight(0xffffff, 0.1);
  fillLight.position.set(30, 20, 20);

  var rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
  rimLight.position.set( -10, 30, -30 );

  scene.add(keyLight);
  scene.add(fillLight);
  scene.add(rimLight);

  $(window).on('resize', onWindowResize);

  $(window).on('click', function (evt) {
    var x =evt.clientX;
    var y =evt.clientY;

    $('#overlay').css({
      top: y,
      left: x,
      width: 0,
      height: 0
    });
    $('#overlay').animate({
      width: 320,
      height: 120,
    });
  });
  // End creation of THREE basic objects

  // Loding an mtlloader
var loader = new THREE.MTLLoader();
loader.load('models/dos.mtl', onLoadMTL);
}

function onLoadMTL ( group ) {
  groupMTL= group;

  // Loding an objloader
var loader = new THREE.OBJLoader();
loader.load('models/dos.obj', onLoadOBJ);
}

function onLoadOBJ ( group ) {
  groupOBJ = group;

  for (var i = 0; i < group.children.length; i++) {
    var mesh = group.children[i];
    //mesh.rotation.x = -Math.PI / 2.0;
    //mesh.rotation.z = -Math.PI / 2.0;

    // Transform from buffergeometry to geometry
    var geom = new THREE.Geometry();
    geom.fromBufferGeometry(mesh.geometry);
    geom.mergeVertices();

    mesh.geometry = geom;
    if (i === 29) {
      mesh.material = glowMaterial;
    } else {
      //mesh.visible = false;
      mesh.material = new THREE.MeshNormalMaterial({
        side : THREE.DoubleSide
      });
    }

    scene.add(mesh);
  }
}

function onWindowResize () {
  var aspectRatio = window.innerWidth / window.innerHeight;
  camera.aspect = aspectRatio;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate () {
  if (state === STATES.PANNING) {
    camera.position.z -= 0.05;

    if (camera.position.z <= Z_STOP) {
      state = STATES.CONTROLS;
      onChangeState();
    }
  }

  if (state === STATES.CONTROLS) {
    controls.update();
  }

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function onChangeState () {
  if (state === STATES.CONTROLS) {

    // Crate controls
    controls = new THREE.TrackballControls(camera);
    controls.maxDistance = 3;
    controls.minDistance = 1;
    controls.noSpan = true;
    controls.target = new THREE.Vector3(0, 2, Z_STOP);

    $(window).on('mousemove', onMouseMove);
  }
}

function onMouseMove ( event ) {
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  var intersects = raycaster.intersectObjects(scene.children);
  if (intersects.length > 0) {
    console.log('Le dimos a algo');3
  }
}

$('.toggle').on('click', function() {
	$('.menu').toggleClass('active');
});

$(document).ready(function () {
  setup();
  animate();

  setTimeout(function() {
    state = STATES.PANNING;
    onChangeState();
  }, 2 * 1000);
});
