/* globals Detector */

import THREE from 'three';
import Plane from './plane';

if (!Detector.webgl) {
    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = '';
}

let container;
let controls;
let camera;
let scene;
let renderer;

const plane = new Plane();

function onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

function initRenderer() {
    renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor(0x17293a);
}

function initCamera() {
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.01, 10000);
    camera.position.set(0, 100, 300);
    camera.lookAt(scene.position);
}

function initControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.userPan = false;
    controls.userPanSpeed = 0.0;
    controls.maxDistance = 5000.0;
    controls.maxPolarAngle = Math.PI * 0.495;
    controls.center.set(0, 0, 0);
}

function initLight() {
    const light = new THREE.HemisphereLight(0xffffff, 0xffffff, 1);
    light.position.set(-1, 1, -1);

    const directionalLight = new THREE.DirectionalLight(0xF03861, 1);
    directionalLight.position.set(0, 15, 0);

    const pointLight = new THREE.PointLight(0xfca4c5, 1);
    pointLight.position.set(0, 1000, 0);

    const hemisphereLight = new THREE.HemisphereLight(0x5F15FF, 0x42F58D, 1);
    hemisphereLight.position.set(-20, 20, 30);

    // scene.add(light);
    // scene.add(directionalLight);
    // scene.add(pointLight);
    scene.add(hemisphereLight);
}

function init() {
    initRenderer();

    container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    window.addEventListener('resize', onResize);

    initCamera();
    initControls();
    initLight();

    scene.add(plane.mesh);
}

function render(timeStamp) {
    plane.update(timeStamp);
    controls.update();
    renderer.render(scene, camera);
}

function animate(timeStamp) {
    requestAnimationFrame(animate);
    render(timeStamp);
}

init();
animate();
