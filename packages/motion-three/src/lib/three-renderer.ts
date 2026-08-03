// ============================================
// Three.js renderer — frame capture for export
// ============================================

import * as THREE from 'three';
import type { ThreeSceneConfig } from './three-types.js';

/** Render a Three.js scene to a canvas frame */
export async function renderThreeFrame(
  canvas: HTMLCanvasElement,
  config: ThreeSceneConfig,
  frame: number,
  fps: number
): Promise<void> {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    preserveDrawingBuffer: true,
  });

  renderer.setSize(canvas.width, canvas.height);
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(config.background);

  // Camera
  const aspect = canvas.width / canvas.height;
  let camera: THREE.Camera;
  if (config.camera.type === 'orthographic') {
    const zoom = config.camera.zoom ?? 5;
    camera = new THREE.OrthographicCamera(-zoom * aspect, zoom * aspect, zoom, -zoom, config.camera.near ?? 0.1, config.camera.far ?? 1000);
  } else {
    camera = new THREE.PerspectiveCamera(config.camera.fov ?? 75, aspect, config.camera.near ?? 0.1, config.camera.far ?? 1000);
  }
  camera.position.set(config.camera.position.x, config.camera.position.y, config.camera.position.z);
  camera.lookAt(config.camera.lookAt.x, config.camera.lookAt.y, config.camera.lookAt.z);

  // Lights
  for (const l of config.lights) {
    let light: THREE.Light;
    if (l.type === 'ambient') light = new THREE.AmbientLight(new THREE.Color(l.color), l.intensity);
    else if (l.type === 'directional') {
      light = new THREE.DirectionalLight(new THREE.Color(l.color), l.intensity);
      if (l.position) light.position.set(l.position.x, l.position.y, l.position.z);
    }
    else if (l.type === 'point') {
      light = new THREE.PointLight(new THREE.Color(l.color), l.intensity);
      if (l.position) light.position.set(l.position.x, l.position.y, l.position.z);
    }
    else if (l.type === 'hemisphere') light = new THREE.HemisphereLight(new THREE.Color(l.color), new THREE.Color('#ffffff'), l.intensity);
    else continue;
    scene.add(light);
  }

  // Objects
  for (const obj of config.objects) {
    if (obj.visible === false) continue;
    const g = createGeometry(obj.geometry);
    const m = createMaterial(obj.material);
    const mesh = new THREE.Mesh(g, m);
    mesh.position.set(obj.position.x, obj.position.y, obj.position.z);
    mesh.rotation.set(obj.rotation.x, obj.rotation.y, obj.rotation.z);
    mesh.scale.set(obj.scale.x, obj.scale.y, obj.scale.z);
    scene.add(mesh);
  }

  // Apply per-frame animation (rotate objects by frame)
  const time = frame / fps;
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.rotation.y = time * 0.5;
    }
  });

  renderer.render(scene, camera);
  renderer.dispose();
}

function createGeometry(def: ThreeSceneConfig['objects'][0]['geometry']): THREE.BufferGeometry {
  switch (def.type) {
    case 'box': return new THREE.BoxGeometry(def.params?.width ?? 1, def.params?.height ?? 1, def.params?.depth ?? 1);
    case 'sphere': return new THREE.SphereGeometry(def.params?.radius ?? 1, 32, 16);
    case 'cylinder': return new THREE.CylinderGeometry(def.params?.radiusTop ?? 1, def.params?.radiusBottom ?? 1, def.params?.height ?? 1);
    case 'cone': return new THREE.ConeGeometry(def.params?.radius ?? 1, def.params?.height ?? 1);
    case 'torus': return new THREE.TorusGeometry(def.params?.radius ?? 1, def.params?.tube ?? 0.3, 16, 100);
    case 'plane': return new THREE.PlaneGeometry(def.params?.width ?? 1, def.params?.height ?? 1);
    default: return new THREE.BoxGeometry(1, 1, 1);
  }
}

function createMaterial(def: ThreeSceneConfig['objects'][0]['material']): THREE.Material {
  const color = new THREE.Color(def.color);
  if (def.type === 'standard') return new THREE.MeshStandardMaterial({ color, metalness: def.metalness ?? 0, roughness: def.roughness ?? 0.5, transparent: def.transparent, opacity: def.opacity ?? 1 });
  if (def.type === 'phong') return new THREE.MeshPhongMaterial({ color, transparent: def.transparent, opacity: def.opacity ?? 1 });
  if (def.type === 'lambert') return new THREE.MeshLambertMaterial({ color, transparent: def.transparent, opacity: def.opacity ?? 1 });
  return new THREE.MeshBasicMaterial({ color, transparent: def.transparent, opacity: def.opacity ?? 1 });
}
