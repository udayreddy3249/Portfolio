// @ts-nocheck -- procedural toy scene, ported from the option preview; plain Three.js kept untyped for brevity.
"use client";

import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/**
 * Dev Toy hero scene: a vinyl-toy developer at his desk.
 * Scroll (0 → 1): types → swivels to the visitor → waves → stands and opens his arms.
 * His head and eyes follow the mouse; the glowing ball circles him.
 */
export function createDevToyScene(canvas: HTMLCanvasElement) {
const TEAL = "#3ee6d8", VIOLET = "#a78bfa", PINK = "#ff6fb5";
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const lerp = (a, b, t) => a + (b - a) * t;

/* ---------------- materials & helpers ---------------- */
const vinyl = (c, r = 0.42) => new THREE.MeshPhysicalMaterial({ color: c, roughness: r, clearcoat: 0.7, clearcoatRoughness: 0.3 });
const fabric = (c) => new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.82, sheen: 1, sheenRoughness: 0.55, sheenColor: new THREE.Color(c).lerp(new THREE.Color("#ffffff"), 0.35) });
const glowMat = (c, i = 2.2) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: i, toneMapped: false });

function mesh(geo, mat, parent, pos, scale, rot) {
  const m = new THREE.Mesh(geo, mat);
  m.castShadow = true;
  if (pos) m.position.set(...pos);
  if (scale) m.scale.set(...scale);
  if (rot) m.rotation.set(...rot);
  parent.add(m);
  return m;
}
/** Capsule hanging from a joint; returns the joint at its far end. */
function limb(parent, r, len, mat) {
  mesh(new THREE.CapsuleGeometry(r, len, 8, 20), mat, parent, [0, -len / 2, 0]);
  const end = new THREE.Group();
  end.position.y = -len;
  parent.add(end);
  return end;
}
function dotTex(stops) {
  const c = document.createElement("canvas"); c.width = c.height = 256;
  const g = c.getContext("2d"); const r = g.createRadialGradient(128, 128, 0, 128, 128, 128);
  stops.forEach(([o, col]) => r.addColorStop(o, col)); g.fillStyle = r; g.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
const ORB_TEX = dotTex([[0, "rgba(255,255,255,1)"], [0.2, "rgba(214,180,255,0.9)"], [0.5, "rgba(167,139,250,0.3)"], [1, "rgba(167,139,250,0)"]]);
const FLOOR_TEX = dotTex([[0, "rgba(190,120,255,0.55)"], [0.35, "rgba(255,111,181,0.2)"], [0.7, "rgba(62,230,216,0.05)"], [1, "rgba(0,0,0,0)"]]);

function makeOrb(scene) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(new THREE.SphereGeometry(0.075, 24, 16), new THREE.MeshBasicMaterial({ color: "#ffffff" })));
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: ORB_TEX, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  s.scale.set(0.95, 0.95, 1); g.add(s);
  const l = new THREE.PointLight("#c4a2ff", 5, 3.4, 1.6); g.add(l);
  scene.add(g);
  return g;
}

function stage(scene) {
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), new THREE.ShadowMaterial({ opacity: 0.45 }));
  ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(6, 6), new THREE.MeshBasicMaterial({ map: FLOOR_TEX, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.rotation.x = -Math.PI / 2; glow.position.y = 0.003; scene.add(glow);

  scene.add(new THREE.HemisphereLight("#9aa8ff", "#1a0f22", 0.6));
  const key = new THREE.DirectionalLight("#fff3e6", 2.2);
  key.position.set(3, 6, 4); key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024); key.shadow.radius = 6; key.shadow.bias = -0.0005;
  Object.assign(key.shadow.camera, { left: -3, right: 3, top: 4, bottom: -2, near: 0.5, far: 20 });
  scene.add(key);
  const rimA = new THREE.DirectionalLight(TEAL, 2.6); rimA.position.set(-5, 3, -3); scene.add(rimA);
  const rimB = new THREE.DirectionalLight(PINK, 1.8); rimB.position.set(5, 2.5, -4); scene.add(rimB);
}

/* ---------------- toy human rig ---------------- */
function makeHuman(o) {
  const root = new THREE.Group();
  const pelvis = new THREE.Group(); pelvis.position.y = 0.8; root.add(pelvis);
  mesh(new THREE.SphereGeometry(0.27, 28, 18), fabric(o.pants), pelvis, [0, 0, 0], [1.12, 0.72, 0.95]);
  const spine = new THREE.Group(); spine.position.y = 0.04; pelvis.add(spine);
  mesh(new THREE.CapsuleGeometry(0.29, 0.3, 10, 28), fabric(o.top), spine, [0, 0.32, 0], [1.08, 1, 0.86]);
  mesh(new THREE.TorusGeometry(0.16, 0.065, 12, 32), fabric(o.trim || o.top), spine, [0, 0.64, 0], null, [Math.PI / 2, 0, 0]);
  if (o.hoodStrings) {
    [0.06, -0.06].forEach((x) => mesh(new THREE.CapsuleGeometry(0.012, 0.14, 4, 8), vinyl("#f3f3f6"), spine, [x, 0.5, 0.25]));
  }
  mesh(new THREE.CircleGeometry(0.055, 28), glowMat(o.accent, 1.6), spine, [0, 0.4, 0.252]);
  if (o.backpack) {
    mesh(new RoundedBoxGeometry(0.5, 0.56, 0.24, 4, 0.08), vinyl(o.backpack, 0.55), spine, [0, 0.34, -0.33]);
    mesh(new RoundedBoxGeometry(0.34, 0.2, 0.08, 3, 0.04), vinyl(o.accent, 0.5), spine, [0, 0.22, -0.46]);
    [0.17, -0.17].forEach((x) => mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 20, Math.PI), vinyl(o.backpack), spine, [x, 0.42, -0.06], null, [0, Math.PI / 2, 0]));
  }

  const arm = (side) => {
    const sh = new THREE.Group(); sh.position.set(0.335 * side, 0.58, 0); spine.add(sh);
    mesh(new THREE.SphereGeometry(0.112, 18, 14), fabric(o.top), sh);
    const el = limb(sh, 0.095, 0.22, fabric(o.top));
    const wr = limb(el, 0.088, 0.18, fabric(o.top));
    mesh(new THREE.CylinderGeometry(0.095, 0.095, 0.05, 18), fabric(o.trim || o.top), wr, [0, -0.02, 0]);
    mesh(new THREE.SphereGeometry(0.1, 22, 16), vinyl(o.skin, 0.5), wr, [0, -0.09, 0.01], [0.95, 1.08, 0.85]);
    mesh(new THREE.CapsuleGeometry(0.03, 0.05, 4, 8), vinyl(o.skin, 0.5), wr, [-0.075 * side, -0.07, 0.05], null, [0.4, 0, 0.6 * side]);
    return { sh, el };
  };
  const leg = (side) => {
    const hip = new THREE.Group(); hip.position.set(0.145 * side, -0.06, 0); pelvis.add(hip);
    const knee = limb(hip, 0.12, 0.28, fabric(o.pants));
    const ank = limb(knee, 0.105, 0.28, fabric(o.pants));
    mesh(new RoundedBoxGeometry(0.24, 0.17, 0.38, 4, 0.075), vinyl(o.shoe, 0.35), ank, [0, -0.06, 0.07]);
    mesh(new RoundedBoxGeometry(0.25, 0.05, 0.39, 3, 0.022), vinyl(o.sole || "#cfd3dc", 0.6), ank, [0, -0.135, 0.07]);
    mesh(new THREE.BoxGeometry(0.26, 0.018, 0.08), vinyl(o.accent, 0.4), ank, [0, -0.04, 0.12]);
    return { hip, knee };
  };
  const A = arm(1), B = arm(-1), LA = leg(1), LB = leg(-1);

  // head
  const neck = new THREE.Group(); neck.position.y = 0.68; spine.add(neck);
  mesh(new THREE.CapsuleGeometry(0.08, 0.06, 6, 12), vinyl(o.skin), neck, [0, 0.03, 0]);
  const head = new THREE.Group(); head.position.y = 0.08; neck.add(head);
  mesh(new THREE.SphereGeometry(0.42, 48, 36), vinyl(o.skin, 0.48), head, [0, 0.36, 0], [1, 0.96, 0.94]);
  [0.41, -0.41].forEach((x) => mesh(new THREE.SphereGeometry(0.075, 16, 12), vinyl(o.skin, 0.5), head, [x, 0.35, 0], [0.5, 1, 0.8]));

  // face
  const eyeGeo = new THREE.SphereGeometry(0.064, 24, 16);
  const eyeMat = new THREE.MeshPhysicalMaterial({ color: "#14100f", roughness: 0.15, clearcoat: 1 });
  const eyes = [], happy = [];
  [0.14, -0.14].forEach((x) => {
    const e = new THREE.Group(); e.position.set(x, 0.385, 0.372); head.add(e);
    mesh(eyeGeo, eyeMat, e, [0, 0, 0], [0.85, 1.2, 0.45]);
    mesh(new THREE.SphereGeometry(0.019, 10, 8), new THREE.MeshBasicMaterial({ color: "#ffffff" }), e, [0.02, 0.032, 0.026]);
    eyes.push(e);
    const h = mesh(new THREE.TorusGeometry(0.05, 0.014, 8, 20, Math.PI), new THREE.MeshPhysicalMaterial({ color: "#14100f", roughness: 0.3 }), head, [x, 0.37, 0.378]);
    h.visible = false; happy.push(h);
    mesh(new THREE.CapsuleGeometry(0.015, 0.075, 4, 8), vinyl(o.hair, 0.7), head, [x, 0.49, 0.36], null, [0, 0, Math.PI / 2 + (x > 0 ? -0.12 : 0.12)]);
    const cheek = mesh(new THREE.SphereGeometry(0.052, 16, 12), new THREE.MeshBasicMaterial({ color: "#ff8fa8", transparent: true, opacity: 0.45 }), head, [x * 1.72, 0.29, 0.31], [1, 0.6, 0.3]);
    cheek.castShadow = false;
  });
  mesh(new THREE.SphereGeometry(0.036, 14, 10), vinyl(o.skinDark || o.skin, 0.45), head, [0, 0.31, 0.402]);
  const mouth = mesh(new THREE.TorusGeometry(0.058, 0.014, 8, 24, Math.PI), new THREE.MeshPhysicalMaterial({ color: "#3a1c1c", roughness: 0.4 }), head, [0, 0.235, 0.378], null, [0, 0, Math.PI]);
  if (o.beard) {
    mesh(new THREE.SphereGeometry(0.4, 36, 24, 0, Math.PI * 2, Math.PI * 0.58, Math.PI * 0.42), vinyl(o.hair, 0.8), head, [0, 0.38, 0.02], [1.01, 0.98, 0.96]);
  }
  // hair
  mesh(new THREE.SphereGeometry(0.44, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.42), vinyl(o.hair, 0.75), head, [0, 0.38, -0.02], [1, 1, 1], [-0.32, 0, 0]);
  if (o.cap) {
    const capMat = new THREE.MeshPhysicalMaterial({ color: o.cap, roughness: 0.62, clearcoat: 0.15 });
    const cap = new THREE.Group(); cap.position.set(0, 0.5, -0.03); cap.rotation.x = o.capBack ? 0.2 : -0.2; head.add(cap);
    mesh(new THREE.SphereGeometry(0.43, 40, 24, 0, Math.PI * 2, 0, Math.PI / 2), capMat, cap, [0, 0, 0], [1, 0.66, 1]);
    mesh(new THREE.TorusGeometry(0.425, 0.022, 8, 48), capMat, cap, [0, 0.005, 0], null, [Math.PI / 2, 0, 0]);
    mesh(new THREE.CylinderGeometry(0.27, 0.29, 0.03, 36, 1, false, Math.PI * 0.5, Math.PI), new THREE.MeshPhysicalMaterial({ color: o.capBrim || o.cap, roughness: 0.6 }), cap, [0, 0.0, o.capBack ? -0.36 : 0.36], [1, 1, 1.1], [o.capBack ? -0.1 : 0.1, o.capBack ? Math.PI : 0, 0]);
    mesh(new THREE.SphereGeometry(0.035, 12, 8), vinyl(o.accent), cap, [0, 0.285, 0]);
  }
  if (o.headphones) {
    mesh(new THREE.TorusGeometry(0.47, 0.035, 12, 40, Math.PI), vinyl("#1d2030", 0.35), head, [0, 0.36, -0.02]);
    [0.47, -0.47].forEach((x) => {
      mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.11, 28), vinyl("#1d2030", 0.35), head, [x, 0.33, 0], null, [0, 0, Math.PI / 2]);
      mesh(new THREE.TorusGeometry(0.1, 0.018, 8, 28), glowMat(o.accent, 2), head, [x * 1.13, 0.33, 0], null, [0, Math.PI / 2, 0]);
    });
  }

  let blinkT = 1.5;
  const face = {
    happy: false,
    update(dt) {
      blinkT -= dt;
      const closing = blinkT < 0.12;
      if (blinkT < 0) blinkT = 2.4 + Math.random() * 2.2;
      eyes.forEach((e) => { e.visible = !face.happy; e.scale.y = closing ? 0.12 : 1; });
      happy.forEach((h) => (h.visible = face.happy));
      mouth.scale.setScalar(face.happy ? 1.35 : 1);
    },
  };
  return { root, pelvis, spine, neck, head, A, B, LA, LB, face };
}

/** Apply a pose object to a rig. */
function applyPose(r, P) {
  r.pelvis.position.y = P.pelvisY;
  r.spine.rotation.set(P.spine[0], P.spine[1], P.spine[2]);
  r.A.sh.rotation.set(...P.aSh); r.A.el.rotation.set(...P.aEl);
  r.B.sh.rotation.set(...P.bSh); r.B.el.rotation.set(...P.bEl);
  r.LA.hip.rotation.set(P.hips[0], 0, P.hipZ[0]); r.LA.knee.rotation.x = P.knees[0];
  r.LB.hip.rotation.set(P.hips[1], 0, P.hipZ[1]); r.LB.knee.rotation.x = P.knees[1];
}
function mixPose(a, b, t) {
  const out = {};
  for (const k in a) out[k] = Array.isArray(a[k]) ? a[k].map((v, i) => lerp(v, b[k][i], t)) : lerp(a[k], b[k], t);
  return out;
}

/** Turn the head toward a world point, within limits. */
const _v = new THREE.Vector3(), _w = new THREE.Vector3();
function lookAt(rig, target, weight, dt) {
  rig.head.getWorldPosition(_w); _w.y += 0.36;
  const local = rig.neck.parent.worldToLocal(_v.copy(target)).sub(rig.neck.parent.worldToLocal(_w.clone()));
  const yaw = clamp(Math.atan2(local.x, local.z), -0.8, 0.8) * weight;
  const pitch = clamp(-Math.atan2(local.y, Math.hypot(local.x, local.z)), -0.4, 0.35) * weight;
  const k = 1 - Math.exp(-dt * 6);
  rig.neck.rotation.y += (yaw - rig.neck.rotation.y) * k;
  rig.neck.rotation.x += (pitch - rig.neck.rotation.x) * k;
}

/* ---------------- A: Dev Toy at desk ---------------- */
function screenTexture() {
  const c = document.createElement("canvas"); c.width = 640; c.height = 400;
  const g = c.getContext("2d");
  g.fillStyle = "#0d1220"; g.fillRect(0, 0, 640, 400);
  g.fillStyle = "#ffffff12"; g.fillRect(0, 0, 640, 30);
  ["#ff5f57", "#febc2e", "#28c840"].forEach((col, i) => { g.fillStyle = col; g.beginPath(); g.arc(22 + i * 20, 15, 6, 0, 7); g.fill(); });
  const pal = [TEAL, VIOLET, PINK, "#f2b230", "#cfd5e3"];
  for (let l = 0; l < 12; l++) { let x = 26 + (l % 3) * 26; for (let p = 0; p < 3; p++) { const w = 34 + ((l * 37 + p * 53) % 120); g.fillStyle = pal[(l + p) % 5]; g.globalAlpha = 0.85; g.fillRect(x, 54 + l * 27, w, 10); x += w + 12; } }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

function buildDev(scene, camera) {
  stage(scene);
  const rig = makeHuman({ skin: "#a8704b", skinDark: "#93603f", hair: "#191310", top: "#2a2346", trim: "#3a3160", pants: "#1d2130", shoe: "#f4f4f8", accent: TEAL, cap: "#f2f2f6", capBrim: "#1d2030", headphones: true, hoodStrings: true });

  // desk
  const desk = new THREE.Group(); desk.position.set(1.0, 0, 0); scene.add(desk);
  mesh(new RoundedBoxGeometry(0.85, 0.06, 1.6, 3, 0.02), vinyl("#ecebf2", 0.3), desk, [0, 0.88, 0]).receiveShadow = true;
  [[-0.38, 0.74], [0.38, 0.74], [-0.38, -0.74], [0.38, -0.74]].forEach(([x, z]) => mesh(new THREE.BoxGeometry(0.05, 0.86, 0.05), vinyl("#15161c", 0.4), desk, [x, 0.43, z]));
  mesh(new RoundedBoxGeometry(0.22, 0.03, 0.62, 2, 0.01), vinyl("#d8dae3", 0.5), desk, [-0.2, 0.925, 0]);
  mesh(new RoundedBoxGeometry(0.14, 0.02, 0.2, 2, 0.01), vinyl("#d8dae3", 0.5), desk, [-0.2, 0.92, -0.48]);
  mesh(new RoundedBoxGeometry(0.06, 0.62, 1.05, 3, 0.03), vinyl("#e889b0", 0.35), desk, [0.3, 1.36, 0]);
  const scr = new THREE.Mesh(new THREE.PlaneGeometry(0.95, 0.54), new THREE.MeshBasicMaterial({ map: screenTexture(), toneMapped: false }));
  scr.position.set(0.268, 1.36, 0); scr.rotation.y = -Math.PI / 2; desk.add(scr);
  mesh(new THREE.BoxGeometry(0.05, 0.3, 0.08), vinyl("#e889b0", 0.35), desk, [0.32, 1.04, 0]);
  mesh(new RoundedBoxGeometry(0.26, 0.03, 0.3, 2, 0.01), vinyl("#e889b0", 0.35), desk, [0.3, 0.91, 0]);
  mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.13, 20), vinyl("#f6f6f8", 0.3), desk, [-0.1, 0.975, 0.62]);
  // plant
  mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.13, 20), vinyl("#f2b230", 0.4), desk, [0.15, 0.975, -0.62]);
  [[0, 0.12, 0], [0.05, 0.09, 0.04], [-0.05, 0.1, -0.03]].forEach(([x, y, z]) => mesh(new THREE.SphereGeometry(0.07, 14, 10), vinyl("#3fbf7f", 0.6), desk, [0.15 + x, 0.98 + y, -0.62 + z]));

  // swivel chair holding the character
  const chair = new THREE.Group(); scene.add(chair);
  mesh(new RoundedBoxGeometry(0.62, 0.1, 0.6, 3, 0.04), vinyl("#30304a", 0.6), chair, [0, 0.47, -0.02]);
  mesh(new RoundedBoxGeometry(0.58, 0.72, 0.1, 3, 0.05), vinyl("#30304a", 0.6), chair, [0, 0.92, -0.33], null, [-0.1, 0, 0]);
  mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.34, 12), vinyl("#15161c", 0.3), chair, [0, 0.27, 0]);
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2;
    mesh(new THREE.BoxGeometry(0.04, 0.035, 0.32), vinyl("#15161c", 0.3), chair, [Math.sin(a) * 0.16, 0.08, Math.cos(a) * 0.16], null, [0, a, 0]);
    mesh(new THREE.SphereGeometry(0.035, 10, 8), vinyl("#15161c", 0.3), chair, [Math.sin(a) * 0.31, 0.035, Math.cos(a) * 0.31]);
  }
  chair.add(rig.root);

  const orb = makeOrb(scene);
  const sitY = 0.6;
  const P = {
    type: { pelvisY: sitY, spine: [0.14, 0, 0], aSh: [-1.12, 0, -0.18], aEl: [-0.42, 0, 0], bSh: [-1.12, 0, 0.18], bEl: [-0.42, 0, 0], hips: [-1.5, -1.5], hipZ: [0.06, -0.06], knees: [1.5, 1.5] },
    relax: { pelvisY: sitY, spine: [0.02, 0, 0], aSh: [-0.45, 0, 0.12], aEl: [-0.95, 0, 0], bSh: [-0.45, 0, -0.12], bEl: [-0.95, 0, 0], hips: [-1.5, -1.5], hipZ: [0.1, -0.1], knees: [1.5, 1.5] },
    wave: { pelvisY: sitY, spine: [0, 0, 0.05], aSh: [-0.15, 0, 2.55], aEl: [-0.35, 0, 0], bSh: [-0.45, 0, -0.12], bEl: [-0.95, 0, 0], hips: [-1.5, -1.5], hipZ: [0.1, -0.1], knees: [1.5, 1.5] },
    stand: { pelvisY: 0.8, spine: [0, 0, 0], aSh: [-0.1, 0, 1.15], aEl: [-0.25, 0, 0], bSh: [-0.1, 0, -1.15], bEl: [-0.25, 0, 0], hips: [0, 0], hipZ: [0.02, -0.02], knees: [0, 0] },
  };
  const camAz = 0.42;
  const mouseTarget = new THREE.Vector3();
  return {
    target: new THREE.Vector3(0.22, 1.05, 0.1), dist: 5.4, az: camAz, el: 0.22,
    update(t, p, dt, mouse) {
      let pose;
      if (p < 0.25) pose = P.type;
      else if (p < 0.45) pose = mixPose(P.type, P.relax, smooth(0.25, 0.45, p));
      else if (p < 0.72) pose = mixPose(P.relax, P.wave, smooth(0.45, 0.55, p));
      else pose = mixPose(P.wave, P.stand, smooth(0.72, 0.88, p));
      pose = { ...pose, aEl: [...pose.aEl], bEl: [...pose.bEl] };
      const typing = 1 - smooth(0.22, 0.3, p);
      pose.aEl[0] += Math.sin(t * 15) * 0.07 * typing;
      pose.bEl[0] += Math.sin(t * 15 + 1.7) * 0.07 * typing;
      const waving = smooth(0.48, 0.56, p) * (1 - smooth(0.72, 0.8, p));
      pose.aEl[2] += Math.sin(t * 9) * 0.5 * waving;
      pose.pelvisY += Math.sin(t * 2) * 0.006;
      applyPose(rig, pose);
      chair.rotation.y = lerp(Math.PI / 2, camAz, smooth(0.25, 0.45, p));
      rig.root.position.z = lerp(0, 0.38, smooth(0.72, 0.88, p));
      rig.face.happy = p > 0.47;
      rig.face.update(dt);
      // ball: hovers by the screen, then circles him
      const a = 0.9 - p * Math.PI * 2.2 + t * 0.25;
      orb.position.set(0.45 + Math.cos(a) * 1.15, 1.55 + Math.sin(t * 1.4) * 0.08 + Math.sin(a * 1.3) * 0.25, Math.sin(a) * 1.05);
      // Head follows the mouse while it moves; otherwise it watches the ball.
      if (mouse) {
        const fwd = new THREE.Vector3(); camera.getWorldDirection(fwd);
        const right = new THREE.Vector3().crossVectors(fwd, camera.up).normalize();
        const up = new THREE.Vector3().crossVectors(right, fwd).normalize();
        mouseTarget.copy(camera.position).addScaledVector(fwd, 3.2).addScaledVector(right, mouse.x * 2.4).addScaledVector(up, mouse.y * 1.4);
        lookAt(rig, mouseTarget, 1, dt);
      } else {
        lookAt(rig, orb.position, p < 0.45 ? 0.9 : 0.4, dt);
      }
    },
  };
}


  /* ---------- renderer & loop ---------- */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;
  const scene = new THREE.Scene();
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
  pm.dispose();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 60);
  const ctl = buildDev(scene, camera);

  const state = { progress: 0, sp: 0, mx: 0, my: 0, cmx: 0, cmy: 0, lastMove: -10 };
  let clock = 0, last = performance.now(), raf = 0, running = false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  function render(dt) {
    state.sp += (state.progress - state.sp) * (reduced ? 1 : 1 - Math.exp(-dt * 7));
    state.cmx += (state.mx - state.cmx) * 0.05;
    state.cmy += (state.my - state.cmy) * 0.05;
    const c = ctl, aspect = camera.aspect;
    const fit = aspect < 0.9 ? 1.45 : aspect < 1.2 ? 1.15 : 1;
    const az = c.az + state.cmx * 0.1 - state.sp * 0.22, el = c.el + state.cmy * 0.04;
    const d = c.dist * fit;
    camera.position.set(c.target.x + Math.sin(az) * Math.cos(el) * d, c.target.y + Math.sin(el) * d, c.target.z + Math.cos(az) * Math.cos(el) * d);
    camera.lookAt(c.target);
    const mouseActive = clock - state.lastMove < 2.5;
    c.update(clock + 1, state.sp, dt, mouseActive ? { x: state.mx, y: state.my } : null);
    renderer.render(scene, camera);
  }
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduced) clock += dt;
    render(reduced ? 0.016 : dt);
    raf = requestAnimationFrame(loop);
  }
  return {
    setProgress(p) { state.progress = Math.min(1, Math.max(0, p)); if (!running) render(0.016); },
    setPointer(x, y) { state.mx = x; state.my = y; state.lastMove = clock; },
    start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
    dispose() {
      running = false; cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => { x.map?.dispose?.(); x.dispose?.(); }); });
      scene.environment?.dispose?.();
      renderer.dispose();
    },
  };
}
