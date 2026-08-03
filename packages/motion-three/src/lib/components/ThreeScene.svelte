<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import type { ThreeSceneConfig } from '../three-types.js';

  let {
    config,
    width = 800,
    height = 450,
    onReady,
  }: {
    config: ThreeSceneConfig;
    width?: number;
    height?: number;
    onReady?: (renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.Camera) => void;
  } = $props();

  let container: HTMLDivElement | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let scene: THREE.Scene | null = null;
  let camera: THREE.PerspectiveCamera | THREE.OrthographicCamera | null = null;
  let animationId: number | null = null;

  onMount(() => {
    if (!container) return;

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(config.background);

    if (config.fog) {
      scene.fog = new THREE.Fog(new THREE.Color(config.fog.color), config.fog.near, config.fog.far);
    }

    // Camera
    if (config.camera.type === 'orthographic') {
      const aspect = width / height;
      const zoom = config.camera.zoom ?? 5;
      camera = new THREE.OrthographicCamera(
        -zoom * aspect, zoom * aspect, zoom, -zoom, config.camera.near ?? 0.1, config.camera.far ?? 1000
      );
    } else {
      camera = new THREE.PerspectiveCamera(config.camera.fov ?? 75, width / height, config.camera.near ?? 0.1, config.camera.far ?? 1000);
    }

    camera.position.set(config.camera.position.x, config.camera.position.y, config.camera.position.z);
    camera.lookAt(config.camera.lookAt.x, config.camera.lookAt.y, config.camera.lookAt.z);

    // Lights
    for (const lightDef of config.lights) {
      let light: THREE.Light;
      switch (lightDef.type) {
        case 'ambient':
          light = new THREE.AmbientLight(new THREE.Color(lightDef.color), lightDef.intensity);
          break;
        case 'directional':
          light = new THREE.DirectionalLight(new THREE.Color(lightDef.color), lightDef.intensity);
          if (lightDef.position) light.position.set(lightDef.position.x, lightDef.position.y, lightDef.position.z);
          if ((light as THREE.DirectionalLight).target && lightDef.target) {
            (light as THREE.DirectionalLight).target.position.set(lightDef.target.x, lightDef.target.y, lightDef.target.z);
          }
          break;
        case 'point':
          light = new THREE.PointLight(new THREE.Color(lightDef.color), lightDef.intensity);
          if (lightDef.position) light.position.set(lightDef.position.x, lightDef.position.y, lightDef.position.z);
          break;
        case 'spot':
          light = new THREE.SpotLight(new THREE.Color(lightDef.color), lightDef.intensity);
          if (lightDef.position) light.position.set(lightDef.position.x, lightDef.position.y, lightDef.position.z);
          break;
        case 'hemisphere':
          light = new THREE.HemisphereLight(new THREE.Color(lightDef.color), new THREE.Color('#ffffff'), lightDef.intensity);
          break;
        default:
          continue;
      }
      scene!.add(light);
    }

    // Objects
    for (const objDef of config.objects) {
      if (objDef.visible === false) continue;

      let geometry: THREE.BufferGeometry;
      switch (objDef.geometry.type) {
        case 'box':
          geometry = new THREE.BoxGeometry(objDef.geometry.params?.width ?? 1, objDef.geometry.params?.height ?? 1, objDef.geometry.params?.depth ?? 1);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(objDef.geometry.params?.radius ?? 1, 32, 16);
          break;
        case 'cylinder':
          geometry = new THREE.CylinderGeometry(objDef.geometry.params?.radiusTop ?? 1, objDef.geometry.params?.radiusBottom ?? 1, objDef.geometry.params?.height ?? 1);
          break;
        case 'cone':
          geometry = new THREE.ConeGeometry(objDef.geometry.params?.radius ?? 1, objDef.geometry.params?.height ?? 1);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(objDef.geometry.params?.radius ?? 1, objDef.geometry.params?.tube ?? 0.3, 16, 100);
          break;
        case 'plane':
          geometry = new THREE.PlaneGeometry(objDef.geometry.params?.width ?? 1, objDef.geometry.params?.height ?? 1);
          break;
        default:
          geometry = new THREE.BoxGeometry(1, 1, 1);
      }

      let material: THREE.Material;
      const mat = objDef.material;
      switch (mat.type) {
        case 'standard':
          material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(mat.color),
            metalness: mat.metalness ?? 0,
            roughness: mat.roughness ?? 0.5,
            transparent: mat.transparent,
            opacity: mat.opacity ?? 1,
            emissive: mat.emissive ? new THREE.Color(mat.emissive) : undefined,
            emissiveIntensity: mat.emissiveIntensity,
          });
          break;
        case 'phong':
          material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(mat.color),
            transparent: mat.transparent,
            opacity: mat.opacity ?? 1,
          });
          break;
        case 'lambert':
          material = new THREE.MeshLambertMaterial({
            color: new THREE.Color(mat.color),
            transparent: mat.transparent,
            opacity: mat.opacity ?? 1,
          });
          break;
        default:
          material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(mat.color),
            transparent: mat.transparent,
            opacity: mat.opacity ?? 1,
          });
      }

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(objDef.position.x, objDef.position.y, objDef.position.z);
      mesh.rotation.set(objDef.rotation.x, objDef.rotation.y, objDef.rotation.z);
      mesh.scale.set(objDef.scale.x, objDef.scale.y, objDef.scale.z);
      mesh.castShadow = mat.type !== 'basic';
      mesh.name = objDef.name ?? objDef.id;
      scene!.add(mesh);
    }

    // Render loop
    function animate() {
      animationId = requestAnimationFrame(animate);
      renderer!.render(scene!, camera!);
    }
    animate();

    onReady?.(renderer, scene, camera);
  });

  onDestroy(() => {
    if (animationId) cancelAnimationFrame(animationId);
    if (renderer) {
      renderer.dispose();
      container?.removeChild(renderer.domElement);
    }
    if (scene) scene.clear();
  });

  export function getRenderer() { return renderer; }
  export function getScene() { return scene; }
  export function getCamera() { return camera; }
</script>

<div bind:this={container} class="rounded-lg overflow-hidden bg-black/10"></div>
