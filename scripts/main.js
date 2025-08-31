import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

gsap.registerPlugin(ScrollTrigger);

/* ---------------------------
   Scene / Renderer / Camera / Lights
----------------------------*/
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
const bg = {r: 0.5, g: 0.7, b: 0.9};
scene.background = new THREE.Color(bg.r, bg.g, bg.b);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(-2, 2, 3);
scene.add(camera);


scene.add(new THREE.HemisphereLight(0xffffff, 0x444444, 1));
const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);



/* ---------------------------
   Terrain
------------------------------ */
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';


function createRadialGradient(size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");

  const gradient = ctx.createRadialGradient(
    size/2, size/2, size * 0.2, 
    size/2, size/2, size/2  
  );

  gradient.addColorStop(0.0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.6, "rgba(255,255,255,1)");
  gradient.addColorStop(1.0, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 16; 
  return texture;
}







const terrainSize = 300;
const subdivisions = 80;

const terrainGeo = new THREE.PlaneGeometry(terrainSize, terrainSize, subdivisions, subdivisions);
terrainGeo.rotateX(-Math.PI / 2);

const noise = new ImprovedNoise();
const pos = terrainGeo.attributes.position;
for (let i = 0; i < pos.count; i++) {
  const x = pos.getX(i);
  const z = pos.getZ(i);
  const height = noise.noise(x * 0.1, z * 0.1, 0) * 0.8;
  pos.setY(i, height);
}
pos.needsUpdate = true;

const terrainMat = new THREE.MeshStandardMaterial({
  color: 0xa6835b,
  flatShading: true,
  transparent: true,
  opacity: 1,
  alphaMap: createRadialGradient(),
  side: THREE.DoubleSide
});

const terrain = new THREE.Mesh(terrainGeo, terrainMat);
terrain.position.y = -2;
scene.add(terrain);

const groundMat = new THREE.MeshStandardMaterial({ 
  color: 0xa6835b,
  transparent: true,
  opacity: 1,
  depthWrite: false,
  alphaMap: createRadialGradient(), 
  side: THREE.DoubleSide
});

const ground = new THREE.Mesh(new THREE.CircleGeometry(1000, 128), groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -3;
ground.renderOrder = -1;
scene.add(ground);





const scrubCount = 200;
const centerRadius = 1;
const radius = terrainSize * 1.5;

const scrubMat = new THREE.MeshStandardMaterial({
  color: 0x556e46,
  flatShading: true,
  transparent: true,
  opacity: 1
});


const scrubGeometries = [];
for (let i = 0; i < scrubCount; i++) {
  let x, z;
  do {
    x = (Math.random() - 0.5) * 100; 
    z = (Math.random() - 0.5) * 100;
  } while (
    Math.sqrt(x * x + z * z) < centerRadius ||
    Math.sqrt(x * x + z * z) > radius
  );

  const r = 0.2 + Math.random() * 0.2;
  const hemiGeo = new THREE.SphereGeometry(r, 6, 6, 0, Math.PI * 2, 0, Math.PI / 2);
  hemiGeo.translate(x, noise.noise(x * 0.1, z * 0.1, 0) * 0.5 + terrain.position.y + r / 2, z);
  scrubGeometries.push(hemiGeo);
}

const rockCount = 60;
const rockGeometries = [];
const rockMat = new THREE.MeshStandardMaterial({
  color: 0x8b7d6b,
  flatShading: true,
  transparent: true,
  opacity: 1
});

for (let i = 0; i < rockCount; i++) {
  let x, z;
  do {
    x = (Math.random() - 0.5) * terrainSize;
    z = (Math.random() - 0.5) * terrainSize;
  } while (
    Math.sqrt(x * x + z * z) < centerRadius ||
    Math.sqrt(x * x + z * z) > radius
  );

  const s = 0.1 + Math.random() * 0.2;
  const rockGeo = new THREE.BoxGeometry(s, s, s);
  rockGeo.translate(
    x,
    noise.noise(x * 0.1, z * 0.1, 0) * 0.5 + terrain.position.y + s / 2,
    z
  );
  rockGeometries.push(rockGeo);
}

let scrubMesh;

if (scrubGeometries.length > 0) {
  const mergedScrubGeo = BufferGeometryUtils.mergeGeometries(scrubGeometries, false);
  scrubMesh = new THREE.Mesh(mergedScrubGeo, scrubMat);
  scene.add(scrubMesh);
}

let rockMesh; 
if (rockGeometries.length > 0) {
  const mergedRockGeo = BufferGeometryUtils.mergeGeometries(rockGeometries, false);
  rockMesh = new THREE.Mesh(mergedRockGeo, rockMat);
  scene.add(rockMesh);
}





/* ---------------------------
Clouds
---------------------------*/
const cloudLayers = [
  { count: 1000, height: 160, spread: 600,  puffScale: 7 },   
  { count: 600, height: 180, spread: 300,  puffScale: 2 },   
  { count: 80,  height: 500, spread: 100, puffScale: 1.5 } 
];

const cloudMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  transparent: true,
  opacity: 0.6,
  roughness: 0.8,
  metalness: 0,
  flatShading: true,
  depthWrite: false
});

const cloudGeometries = [];

for (let layer of cloudLayers) {
  for (let i = 0; i < layer.count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * layer.spread;
    const baseX = Math.cos(angle) * radius;
    const baseZ = Math.sin(angle) * radius;
    const baseY = layer.height + Math.random() * 1.5;


    const puffParts = 3 + Math.floor(Math.random() * 3);
    for (let j = 0; j < puffParts; j++) {
      const scaleX = (0.8 + Math.random() * 0.8) * layer.puffScale;
      const scaleY = (0.5 + Math.random() * 0.5) * layer.puffScale;
      const scaleZ = (0.8 + Math.random() * 0.8) * layer.puffScale;

      const sphere = new THREE.SphereGeometry(1, 6, 6);
      sphere.scale(scaleX, scaleY, scaleZ);

      const offsetX = (Math.random() - 0.5) * 1.2 * layer.puffScale;
      const offsetY = (Math.random() - 0.5) * 0.5 * layer.puffScale * 0.5; 
      const offsetZ = (Math.random() - 0.5) * 1.2 * layer.puffScale;
      sphere.translate(baseX + offsetX, baseY + offsetY, baseZ + offsetZ);

      cloudGeometries.push(sphere);
    }
  }
}

const mergedCloudGeo = BufferGeometryUtils.mergeGeometries(cloudGeometries, false);
const cloudMesh = new THREE.Mesh(mergedCloudGeo, cloudMat);
scene.add(cloudMesh);











/* ---------------------------
   Load HDR Environment
---------------------------*/
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

new RGBELoader().load("assets/env/sky.hdr", (hdrTexture) => {
  const envMap = pmremGenerator.fromEquirectangular(hdrTexture).texture;
  scene.environment = envMap;
  hdrTexture.dispose();
});

/* ---------------------------
   Load Models
---------------------------*/
const loader = new GLTFLoader();
let rocket, launchpad;

const rocketHeight = 3;
let camState;


let tl;    
let poseTimes = [];      
let subphaseWindows = [];    
let virtualOffsets = [];
let virtualMap = {};     
const PIXELS_PER_VIRTUAL = 20;


const travelFactor = 0.02; 
const minSegmentDur = 0.12;  
const fadeFrac = 0.12;      
const minFade = 0.06;    
const maxFade = 0.45;

Promise.all([
  loader.loadAsync("assets/models/rocket-animation.glb"),
  loader.loadAsync("assets/models/launchpad.glb"),
]).then(([rocketGLTF, padGLTF]) => {
  rocket = rocketGLTF.scene;
  launchpad = padGLTF.scene;


  rocket.scale.set(1, 1, 1);
  rocket.position.set(0, -1.8, 0);

  launchpad.scale.set(1, 1, 1);
  launchpad.position.set(-0.2, -2, -0.4);

  rocket.traverse(obj => {
    if (obj.isMesh && obj.material) {
      obj.material.metalness = 1.0;
      obj.material.roughness = 0.01;
      obj.material.envMapIntensity = 2.0;
      obj.material.needsUpdate = true;
    }
  });

  launchpad.traverse(obj => {
    if (obj.isMesh && obj.material) {
      obj.material.transparent = true;
      obj.material.opacity = 1;
      obj.material.depthWrite = true;
    }
  });

  scene.add(launchpad);
  scene.add(rocket);

  camState = {
    offsetX: camera.position.x - rocket.position.x,
    offsetY: camera.position.y - rocket.position.y,
    offsetZ: camera.position.z - rocket.position.z
  };

  buildScrollTimeline(); 
  applyCamera();


  onResize();
  updateFromTimeline();
  ScrollTrigger.refresh();
}).catch(e => console.error("Model load failed:", e));




/* ---------------------------
   Rocket Postiion y values, Camera/Subphase Keyframes (in narrative order)
---------------------------*/
const keyframes = [
  { y: -1.8, offset: { x: -2, y: 4, z: 3 }, subId: "subphase-alto", segWeight: 10.0, seconds: 0, bgColor: 0x97c4da }, 
  { y: 20, offset: { x: -1, y: 4, z: 1 }, subId: "subphase-thrust", segWeight: 10.0, seconds: 1, bgColor: 0xa2c9db }, 
  { y: 80, offset: { x: 0, y: 3, z: 2 }, subId: "subphase-maxq", segWeight: 1.0, seconds: 7, bgColor: 0xc9a3b2 },
  { y: 250, offset: { x: 2, y: 4, z: 4 }, subId: "subphase-burnout", segWeight: 3.0, seconds: 8, bgColor: 0xf0cc89 },
  { y: 300, offset: { x: 3, y: 2, z: 4 }, subId: "subphase-velocity", segWeight: 3.0, seconds: 9, bgColor: 0x7ec4d9 },
  { y: 330, offset: { x: 4, y: 1, z: 4 }, subId: "subphase-decline", segWeight: 2.0, seconds: 10, bgColor: 0x599dc2 },
  { y: 800, offset: { x: 12, y: 1, z: 12 }, subId: "subphase-apogee", segWeight: 1.5, seconds: 38, bgColor: 0x294887 },
  { y: 700,  offset: { x: 5, y: -1, z: 4 }, subId: "subphase-drogue", segWeight: 2, seconds: 39, bgColor: 0x2d4387 }, 
  { y: 600,  offset: { x: 4,  y: -3,  z: 3 }, subId: "subphase-drogue-descent", segWeight: 1.2, seconds: 40, bgColor: 0x36467a }, 
  { y: 150,  offset: { x: 0,  y: 7,  z: 12 }, subId: "subphase-main", segWeight: 2, seconds: 71, bgColor: 0x000033 },
  { y: 90,   offset: { x: 0,  y: 5,  z: 2 }, subId: "subphase-main-descent", segWeight: 1.2, seconds: 72, bgColor: 0x000033 },
  { y: 50,    offset: { x: 0,  y: 3,  z: 12 }, subId: "subphase-touchdown", segWeight: 1.2, seconds: 120, bgColor: 0x000033 }, 
];

/* ---------------------------
   Scroll timeline
---------------------------*/
function buildScrollTimeline() {
  tl = gsap.timeline({ defaults: { ease: "none" } });


  const segmentDurations = [];
  for (let i = 0; i < keyframes.length - 1; i++) {
    const a = keyframes[i].y;
    const b = keyframes[i + 1].y;
    const dy = Math.abs(b - a);
    const base = Math.max(minSegmentDur, dy * travelFactor);
    const weight = keyframes[i].segWeight ?? 1;
    const segDur = base * weight;
    segmentDurations[i] = segDur;
  }


  poseTimes = [];
  let acc = 0;

  tl.set(rocket.position, { y: keyframes[0].y }, 0);
  poseTimes[0] = 0;

  for (let i = 0; i < segmentDurations.length; i++) {
    const dur = segmentDurations[i];

    tl.to(rocket.position, { y: keyframes[i + 1].y, duration: dur }, ">");
    acc += dur;
    poseTimes[i + 1] = acc; 
  }




  const total = tl.duration();
  subphaseWindows = keyframes.map((kf, i) => {
    const start = poseTimes[i] ?? 0;
    const end = (i < keyframes.length - 1) ? (poseTimes[i + 1]) : total;
    const span = Math.max(0.0001, end - start);


    const fade = clamp(span * fadeFrac, minFade, maxFade);

  
    return {
      id: kf.subId,
      start, end,
      fadeInStart: start,
      fadeInEnd: start + fade,
      fadeOutStart: end - fade,
      fadeOutEnd: end,
    };
  });

  

const rocketTrack = parseInt(getComputedStyle(document.documentElement)
                 .getPropertyValue("--rocket-track")) || 40000;

ScrollTrigger.create({
  animation: tl,
  trigger: "#rocket-section2",
  start: "top top",
  end: `+=${rocketTrack}`,
  scrub: true,
  pin: true,
  onUpdate: updateFromTimeline
});


virtualOffsets = [0];
for (let i = 0; i < segmentDurations.length; i++) {
  virtualOffsets[i + 1] = virtualOffsets[i] + segmentDurations[i];
}
totalVirtual = Math.max(1e-6, virtualOffsets[virtualOffsets.length - 1]);


virtualMap = {};
subphaseWindows.forEach((win, i) => {
  virtualMap[win.id] = virtualOffsets[i] ?? 0;
});

layoutTimelineEvents();

}

/* ---------------------------
   Helpers
---------------------------*/
function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

function getCurrentSegmentIndex(time) {

  for (let i = 0; i < keyframes.length - 1; i++) {
    const t0 = poseTimes[i] ?? 0;
    const t1 = poseTimes[i + 1];
    if (time >= t0 && time <= t1) return i;
  }

  return Math.max(0, keyframes.length - 2);
}




function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}


function updateTimelineClock(currentTime) {
  if (!keyframes || keyframes.length === 0) return;
  const clockEl = document.getElementById("timeline-clock");
  if (!clockEl) return;

  let i = 0;
  while (i < poseTimes.length - 1 && currentTime > poseTimes[i + 1]) i++;

  const t0 = poseTimes[i];
  const t1 = poseTimes[i + 1] ?? t0 + 1e-6;
  const k0 = keyframes[i];
  const k1 = keyframes[i + 1] ?? k0;

  const local = clamp((currentTime - t0) / (t1 - t0), 0, 1);
  const seconds = Math.round(k0.seconds + (k1.seconds - k0.seconds) * local);

  clockEl.textContent = `T+ ${formatTime(seconds)}`;
}


function updateBackgroundColor(currentTime) {
  const segIndex = getCurrentSegmentIndex(currentTime);
  const k0 = keyframes[segIndex];
  const k1 = keyframes[segIndex + 1] ?? k0;
  const t0 = poseTimes[segIndex] ?? 0;
  const t1 = poseTimes[segIndex + 1] ?? t0 + 1e-6;

  const local = clamp((currentTime - t0) / (t1 - t0), 0, 1);


  const c0 = new THREE.Color(k0.bgColor);
  const c1 = new THREE.Color(k1.bgColor);


  const currentColor = c0.clone().lerp(c1, local);

  scene.background = currentColor;
}



function updateFromTimeline() {
  if (!rocket || !tl) return;
  const time = tl.time();


  subphaseWindows.forEach(win => {
    const el = document.getElementById(win.id);
    if (!el) return;

    let opacity = 0;
    if (win.id === "subphase-alto" && time < win.fadeOutStart) {
      opacity = 1; 
    } else if (time >= win.fadeInStart && time <= win.fadeInEnd) {
      opacity = (time - win.fadeInStart) / Math.max(1e-6, win.fadeInEnd - win.fadeInStart);
    } else if (time > win.fadeInEnd && time < win.fadeOutStart) {
      opacity = 1;
    } else if (time >= win.fadeOutStart && time <= win.fadeOutEnd) {
      opacity = 1 - (time - win.fadeOutStart) / Math.max(1e-6, win.fadeOutEnd - win.fadeOutStart);
    }
    opacity = clamp(opacity, 0, 1);

    el.style.opacity = opacity.toFixed(2);
    el.style.pointerEvents = opacity > 0.1 ? "auto" : "none";
  });


  document.querySelectorAll(".section").forEach(section => {
    const subs = section.querySelectorAll(".subphase");
    const heading = section.querySelector("h1");
    if (!heading) return;
    const anyVisible = Array.from(subs).some(
      sub => parseFloat(sub.style.opacity || "0") > 0.05
    );
    heading.style.opacity = anyVisible ? 1 : 0;
    section.style.opacity = anyVisible ? 1 : 0;
  });


  const segIndex = getCurrentSegmentIndex(time);
  const k0 = keyframes[segIndex];
  const k1 = keyframes[segIndex + 1];
  const t0 = poseTimes[segIndex] ?? 0;
  const t1 = poseTimes[segIndex + 1] ?? t0 + 1e-6;
  const local = clamp((time - t0) / Math.max(1e-6, (t1 - t0)), 0, 1);

  const targetX = THREE.MathUtils.lerp(k0.offset.x, k1.offset.x, local);
  const targetY = THREE.MathUtils.lerp(k0.offset.y, k1.offset.y, local);
  const targetZ = THREE.MathUtils.lerp(k0.offset.z, k1.offset.z, local);

  const lag = 0.05;
  camState.offsetX += (targetX - camState.offsetX) * lag;
  camState.offsetY += (targetY - camState.offsetY) * lag;
  camState.offsetZ += (targetZ - camState.offsetZ) * lag;
  applyCamera();


  if (terrain) {
    const y = rocket.position.y;

    const terrainFadeStart = 0;
    const terrainFadeEnd   = 50;
    terrain.material.opacity = clamp(
      1 - (y - terrainFadeStart) / (terrainFadeEnd - terrainFadeStart), 0, 1
    );
    terrain.material.needsUpdate = true;

    const objectsFadeStart = 240;
    const objectsFadeEnd   = 260;
    const otherOpacity = clamp(
      1 - (y - objectsFadeStart) / (objectsFadeEnd - objectsFadeStart), 0, 1
    );

    [ground, scrubMesh, rockMesh].forEach(obj => {
      if (obj) {
        obj.material.opacity = otherOpacity;
        obj.material.needsUpdate = true;
      }
    });
  }


  const timelineEl = document.querySelector("#timeline-panel .timeline");
  const panel = document.getElementById("timeline-panel");
  if (timelineEl && panel && subphaseWindows && subphaseWindows.length) {
    const currentVirtual = timeToVirtual(time);
    const panelCenter = panel.clientHeight / 2;



    timelineEl.querySelectorAll(".timeline-event").forEach(ev => {
  const id = ev.dataset.subid;
  const eventVirtual = virtualMap[id] ?? 0;

  const delta = currentVirtual - eventVirtual;
  const onScreenCenter = panelCenter + delta * PIXELS_PER_VIRTUAL;

  ev.style.position = "absolute";
  ev.style.left = "0";
  ev.style.top = `${onScreenCenter - ev.offsetHeight / 2}px`;

  const dist = Math.abs(delta * PIXELS_PER_VIRTUAL);
  const maxDist = panel.clientHeight / 2;
  const scale = clamp(1.1 - dist / maxDist * 0.3, 0.7, 1.1);

  const opacity = clamp(1.05 - dist / maxDist, 0.25, 1);


  const labelEl = ev.querySelector(".labels, .label");
  if (labelEl) {
    labelEl.style.transform = `scale(${scale})`;
    labelEl.style.transformOrigin = "right center";
    labelEl.style.opacity = opacity.toFixed(2);
  }

  const circleEl = ev.querySelector(".circle");
  if (circleEl) {
    circleEl.style.opacity = "1";
  }
  updateTimelineClock(time);
   updateBackgroundColor(time);
}
);




updateTimelineSegments();


    subphaseWindows.forEach((win, i) => {
      const el = timelineEl.querySelector(`.timeline-event[data-subid="${win.id}"]`);
      if (!el) return;
      const isActive = (i === getCurrentSegmentIndex(time));
      const isCompleted = (time >= win.start);
      el.classList.toggle("active", isActive);
      el.classList.toggle("completed", isCompleted);
    });
  }
}









function updateTimelineSegments() {
  const timeline = document.querySelector("#timeline-panel .timeline");
  const linesContainer = document.querySelector("#timeline-panel .timeline-lines");
  if (!timeline || !linesContainer) return;


  linesContainer.innerHTML = "";


  const events = Array.from(timeline.querySelectorAll(".timeline-event")).map(ev => {
    const circle = ev.querySelector(".circle");
    const radius = circle ? (circle.offsetHeight / 2) : 0;
    return {
      top: parseFloat(ev.style.top) || ev.offsetTop,
      height: ev.offsetHeight,
      radius
    };
  }).sort((a, b) => a.top - b.top);


  for (let i = 0; i < events.length - 1; i++) {
    const thisCenter = events[i].top + events[i].height / 2;
    const nextCenter = events[i + 1].top + events[i + 1].height / 2;

    const segTop    = thisCenter + events[i].radius;
    const segHeight = (nextCenter - events[i + 1].radius) - segTop; 
    const seg = document.createElement("div");
    seg.className = "segment";
    seg.style.top = `${segTop}px`;
    seg.style.height = `${segHeight}px`;
    linesContainer.appendChild(seg);
  }
}





/* ---------------------------
   Layout timeline container 
---------------------------*/
function layoutTimelineEvents() {
  const timelineEl = document.querySelector("#timeline-panel .timeline");
  if (!timelineEl) return;
  timelineEl.style.position = "relative";
  timelineEl.style.height = "100%"; 
}


/* ---------------------------
   Convert timeline time → virtual position
---------------------------*/
function timeToVirtual(time) {
  const segIndex = getCurrentSegmentIndex(time);
  const t0 = poseTimes[segIndex];
  const t1 = poseTimes[segIndex + 1];
  const local = clamp((time - t0) / Math.max(1e-6, t1 - t0), 0, 1);

  const v0 = virtualOffsets[segIndex];
  const v1 = virtualOffsets[segIndex + 1];
  return v0 + (v1 - v0) * local;
}



/* ---------------------------
   Apply camera transform
---------------------------*/
function applyCamera() {
  if (!camState || !rocket) return;
  camera.position.set(
    rocket.position.x + camState.offsetX,
    rocket.position.y + camState.offsetY,
    rocket.position.z + camState.offsetZ
  );
  camera.lookAt(
    rocket.position.x,
    rocket.position.y + rocketHeight / 2,
    rocket.position.z
  );
  camera.updateMatrixWorld();
}

/* ---------------------------
   Resize handling
---------------------------*/
function onResize() {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  updateFromTimeline();
  ScrollTrigger.refresh();
}
window.addEventListener("resize", onResize);

/* ---------------------------
   Render loop
---------------------------*/
renderer.setAnimationLoop(() => {
  updateFromTimeline();
  renderer.render(scene, camera);
});






function setTimelineColumnPx() {
  const panel = document.getElementById('timeline-panel');
  if (!panel) return;
  const px = Math.round(panel.clientWidth * 0.15);
  panel.style.setProperty('--timeline-x', `${px}px`);
}
window.addEventListener('resize', setTimelineColumnPx);
setTimelineColumnPx();






function buildTimelineFromSections() {
  const timelineEl = document.querySelector("#timeline-panel .timeline");
  timelineEl.innerHTML = "";

  const sections = Array.from(document.querySelectorAll(".section"));

  sections.forEach(section => {
    const phaseName = section.querySelector("h1")?.textContent.trim();
    const subphaseEls = Array.from(section.querySelectorAll(".subphase"));
    if (!phaseName || subphaseEls.length === 0) return;


    const firstSubName = subphaseEls[0].querySelector("h2")?.textContent.trim();
    const firstSubId   = subphaseEls[0].id;
    const firstEvent   = document.createElement("div");
    firstEvent.className = "timeline-event phase-first";
    firstEvent.dataset.subid = firstSubId;
firstEvent.innerHTML = `
  <div class="labels">
    <div class="phase-label">${phaseName}</div>
    <div class="subphase-label">${firstSubName}</div>
  </div>
  <div class="circle big"></div>
`;
    timelineEl.appendChild(firstEvent);


    for (let i = 1; i < subphaseEls.length; i++) {
      const spName = subphaseEls[i].querySelector("h2")?.textContent.trim();
      const spId   = subphaseEls[i].id;
      if (!spName) continue;

      const subEvent = document.createElement("div");
      subEvent.className = "timeline-event timeline-subphase";
      subEvent.dataset.subid = spId;
subEvent.innerHTML = `
  <div class="label">${spName}</div>
  <div class="circle small"></div>
`;
      timelineEl.appendChild(subEvent);
    }
  });
}




document.addEventListener("DOMContentLoaded", buildTimelineFromSections);