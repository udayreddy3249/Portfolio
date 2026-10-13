// @ts-nocheck -- plain Three.js scene kept untyped for brevity.
"use client";

import * as THREE from "three";

/**
 * Background agent network for the sections after the hero.
 * A globe of linked nodes with data pulses; pink nodes are agents.
 * Page scroll (0 → 1) turns the globe, moves the camera in, and makes the glowing ball
 * hop from agent to agent.
 */
export function createAgentNetwork(canvas: HTMLCanvasElement) {
  const TEAL = new THREE.Color("#3ee6d8"), VIOLET = new THREE.Color("#a78bfa"), PINK = new THREE.Color("#ff6fb5");

  const dot = (() => {
    const c = document.createElement("canvas"); c.width = c.height = 128;
    const g = c.getContext("2d"); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(0.25, "rgba(255,255,255,0.35)"); r.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = r; g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
  })();
  const sprite = (color, size, opacity = 1) => {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: dot, color, transparent: true, opacity, depthWrite: false, blending: THREE.AdditiveBlending }));
    s.scale.set(size, size, 1);
    return s;
  };

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);

  const globe = new THREE.Group();
  scene.add(globe);

  // Nodes on a sphere (Fibonacci layout) plus a sparse outer shell
  const nodes = [];
  const N = 110, R = 2.2;
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, rr = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5));
    nodes.push(new THREE.Vector3(Math.cos(th) * rr * R, y * R, Math.sin(th) * rr * R));
  }
  const edges = [];
  nodes.forEach((a, i) => {
    nodes.map((b, j) => [j, a.distanceTo(b)]).filter(([j]) => j > i).sort((x, y) => x[1] - y[1]).slice(0, 3).forEach(([j]) => edges.push([i, j]));
  });
  const seg = [];
  edges.forEach(([i, j]) => seg.push(...nodes[i].toArray(), ...nodes[j].toArray()));
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute("position", new THREE.Float32BufferAttribute(seg, 3));
  const lines = new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.32, blending: THREE.AdditiveBlending, depthWrite: false }));
  globe.add(lines);

  const ptGeo = new THREE.BufferGeometry();
  ptGeo.setAttribute("position", new THREE.Float32BufferAttribute(nodes.flatMap((v) => v.toArray()), 3));
  globe.add(new THREE.Points(ptGeo, new THREE.PointsMaterial({ map: dot, color: TEAL, size: 0.16, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));

  // Agents
  const agentIdx = [4, 19, 33, 47, 61, 75, 90, 104];
  const agents = agentIdx.map((i) => {
    const s = sprite(PINK, 0.75, 1);
    s.position.copy(nodes[i]);
    globe.add(s);
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.14, 0.17, 32), new THREE.MeshBasicMaterial({ color: PINK, transparent: true, opacity: 0.7, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false }));
    ring.position.copy(nodes[i]);
    ring.lookAt(0, 0, 0);
    globe.add(ring);
    return { s, ring };
  });

  // Data pulses travelling along links
  const pulses = Array.from({ length: 36 }, () => {
    const s = sprite(new THREE.Color("#e9fffd"), 0.22, 0.95);
    globe.add(s);
    return { s, e: edges[(Math.random() * edges.length) | 0], t: Math.random(), v: 0.35 + Math.random() * 0.7 };
  });

  // Outer orbit rings
  const orbitMat = new THREE.LineBasicMaterial({ color: TEAL, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending });
  [2.75, 3.2].forEach((r, k) => {
    const pts = Array.from({ length: 129 }, (_, i) => { const a = (i / 128) * Math.PI * 2; return new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r); });
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), orbitMat);
    l.rotation.x = k ? 1.2 : 0.35;
    l.rotation.z = k ? -0.4 : 0.2;
    globe.add(l);
  });

  // Dust
  const dust = [];
  for (let i = 0; i < 260; i++) dust.push((Math.random() - 0.5) * 16, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10 - 2);
  const dg = new THREE.BufferGeometry(); dg.setAttribute("position", new THREE.Float32BufferAttribute(dust, 3));
  const dustPts = new THREE.Points(dg, new THREE.PointsMaterial({ map: dot, color: VIOLET, size: 0.06, transparent: true, opacity: 0.6, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(dustPts);

  // The glowing ball that hops between agents
  const ball = new THREE.Group();
  ball.add(new THREE.Mesh(new THREE.SphereGeometry(0.09, 20, 14), new THREE.MeshBasicMaterial({ color: "#ffffff" })));
  ball.add(sprite(new THREE.Color("#d9c4ff"), 1.0, 0.95));
  ball.add(sprite(VIOLET, 2.2, 0.35));
  scene.add(ball);
  const trailGeo = new THREE.BufferGeometry();
  const TRAIL = 40;
  trailGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(TRAIL * 3), 3));
  const trail = new THREE.Line(trailGeo, new THREE.LineBasicMaterial({ color: "#d9c4ff", transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending }));
  scene.add(trail);
  const trailPts = Array.from({ length: TRAIL }, () => new THREE.Vector3());

  const state = { progress: 0, sp: 0, wide: true };
  let clock = 0, last = performance.now(), raf = 0, running = false;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const tmp = new THREE.Vector3();

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    state.wide = w / h > 1.1;
    camera.updateProjectionMatrix();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  function render(dt) {
    state.sp += (state.progress - state.sp) * (reduced ? 1 : 1 - Math.exp(-dt * 5));
    const p = state.sp;
    // Globe turns and tilts with scroll; slow idle spin on top
    globe.rotation.y = p * Math.PI * 3 + clock * 0.04;
    globe.rotation.x = 0.35 + Math.sin(p * Math.PI * 2) * 0.25;
    // Camera dollies in and swings around as you go down the page
    const d = (state.wide ? 9.5 : 11.5) - p * 2.2;
    const az = -0.3 + p * 0.9;
    camera.position.set(Math.sin(az) * d, 1.2 - p * 2.4, Math.cos(az) * d);
    camera.lookAt(0, 0, 0);
    // Wide screens: globe sits right of the text column
    if (state.wide) camera.setViewOffset(canvas.clientWidth, canvas.clientHeight, -canvas.clientWidth * 0.2, 0, canvas.clientWidth, canvas.clientHeight);
    else camera.clearViewOffset();
    dustPts.rotation.y = clock * 0.01 + p * 0.6;

    pulses.forEach((q) => {
      q.t += dt * q.v;
      if (q.t > 1) { q.t = 0; q.e = edges[(Math.random() * edges.length) | 0]; }
      q.s.position.lerpVectors(nodes[q.e[0]], nodes[q.e[1]], q.t);
    });
    agents.forEach((a, i) => {
      a.s.material.opacity = 0.7 + Math.sin(clock * 3 + i) * 0.3;
      a.ring.scale.setScalar(1 + ((clock * 0.8 + i * 0.3) % 1) * 1.2);
      a.ring.material.opacity = 0.7 * (1 - ((clock * 0.8 + i * 0.3) % 1));
    });

    // Ball hops agent → agent along a lifted arc as you scroll
    const hops = agentIdx.length - 1;
    const f = Math.min(hops - 0.0001, p * hops);
    const i0 = Math.floor(f), k = f - i0;
    const e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
    tmp.lerpVectors(nodes[agentIdx[i0]], nodes[agentIdx[i0 + 1]], e).normalize().multiplyScalar(R * (1.12 + Math.sin(k * Math.PI) * 0.45));
    globe.localToWorld(tmp);
    ball.position.copy(tmp);
    trailPts.pop();
    trailPts.unshift(ball.position.clone());
    const arr = trailGeo.attributes.position.array;
    trailPts.forEach((v, i) => v.toArray(arr, i * 3));
    trailGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!reduced) clock += dt;
    render(reduced ? 0.016 : dt);
    raf = requestAnimationFrame(loop);
  }
  // seed trail at the start position
  render(0.016);
  trailPts.forEach((v) => v.copy(ball.position));

  return {
    setProgress(p) { state.progress = Math.min(1, Math.max(0, p)); if (!running) render(0.016); },
    start() { if (running) return; running = true; last = performance.now(); raf = requestAnimationFrame(loop); },
    stop() { running = false; cancelAnimationFrame(raf); },
    dispose() {
      running = false; cancelAnimationFrame(raf); ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => x.dispose?.()); });
      dot.dispose();
      renderer.dispose();
    },
  };
}
