// ============================================
// Three.js scene model — serializable 3D scene
// ============================================

import * as THREE from 'three';

export type ThreeSceneConfig = {
  camera: {
    type: 'perspective' | 'orthographic';
    position: { x: number; y: number; z: number };
    lookAt: { x: number; y: number; z: number };
    fov?: number;
    near?: number;
    far?: number;
    zoom?: number;
  };
  lights: ThreeLight[];
  objects: ThreeObject[];
  background: string;
  fog?: { color: string; near: number; far: number };
};

export type ThreeLight = {
  id: string;
  type: 'ambient' | 'directional' | 'point' | 'spot' | 'hemisphere';
  color: string;
  intensity: number;
  position?: { x: number; y: number; z: number };
  target?: { x: number; y: number; z: number };
  castShadow?: boolean;
};

export type ThreeObject = {
  id: string;
  type: 'mesh' | 'line' | 'points' | 'group';
  geometry: ThreeGeometry;
  material: ThreeMaterial;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  scale: { x: number; y: number; z: number };
  name?: string;
  visible?: boolean;
};

export type ThreeGeometry = {
  type: 'box' | 'sphere' | 'cylinder' | 'cone' | 'torus' | 'plane' | 'custom';
  params?: Record<string, number>;
};

export type ThreeMaterial = {
  type: 'standard' | 'phong' | 'basic' | 'lambert';
  color: string;
  metalness?: number;
  roughness?: number;
  opacity?: number;
  transparent?: boolean;
  emissive?: string;
  emissiveIntensity?: number;
};

/** Create a default Three.js scene config */
export function createThreeSceneConfig(): ThreeSceneConfig {
  return {
    camera: {
      type: 'perspective',
      position: { x: 5, y: 5, z: 5 },
      lookAt: { x: 0, y: 0, z: 0 },
      fov: 75,
      near: 0.1,
      far: 1000,
    },
    lights: [
      {
        id: 'ambient-1',
        type: 'ambient',
        color: '#ffffff',
        intensity: 0.5,
      },
      {
        id: 'directional-1',
        type: 'directional',
        color: '#ffffff',
        intensity: 1,
        position: { x: 5, y: 10, z: 7 },
        castShadow: true,
      },
    ],
    objects: [
      {
        id: 'box-1',
        type: 'mesh',
        geometry: { type: 'box', params: { width: 1, height: 1, depth: 1 } },
        material: { type: 'standard', color: '#3b82f6', metalness: 0.1, roughness: 0.5 },
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
        name: 'Cube',
      },
    ],
    background: '#1a1a2e',
  };
}
