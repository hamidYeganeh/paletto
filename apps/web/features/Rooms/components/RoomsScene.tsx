"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export type SceneObject = {
  name: string;
  size: string;
  side: number;
  position: {
    x: number;
    z: number;
    yOffset: number;
  };
  frontColor: string;
  sideColor: string;
};

const vertexShader = /* glsl */ `
  varying vec3 vViewNormal;

  void main() {
    vViewNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;

  uniform vec3 uFrontColor;
  uniform vec3 uSideColor;
  uniform float uOpacity;
  varying vec3 vViewNormal;

  void main() {
    float facing = smoothstep(0.1, 0.8, vViewNormal.z);
    vec3 tex = mix(uSideColor, uFrontColor, facing);

    gl_FragColor.rgb = tex;
    gl_FragColor.a = uOpacity;
  }
`;
type RoomsSceneProps = {
  objects: SceneObject[];
  selected: SceneObject | null;
  onSelect: (object: SceneObject) => void;
};

type ShaderUniforms = {
  uFrontColor: THREE.IUniform;
  uSideColor: THREE.IUniform;
  uOpacity: THREE.IUniform;
};

export const RoomsScene = ({ objects, selected, onSelect }: RoomsSceneProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const lastSelectedRef = useRef<SceneObject | null>(null);
  const selectedNameRef = useRef<string | null>(null);
  const viewModeRef = useRef<"idle" | "zoom" | "return">("idle");
  const triggerReturnRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!selected && lastSelectedRef.current) {
      triggerReturnRef.current();
    }
    lastSelectedRef.current = selected;
    selectedNameRef.current = selected?.name ?? null;
  }, [selected]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0xffffff, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.position = "absolute";
    renderer.domElement.style.inset = "0";
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 150);
    camera.position.set(0, 8, 16);
    camera.lookAt(0, 0, 0);

    const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      side: THREE.DoubleSide,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uFrontColor: { value: new THREE.Color("#295142") },
        uSideColor: { value: new THREE.Color("#1f3a2b") },
        uOpacity: { value: 1 },
      },
    });

    const group = new THREE.Group();
    scene.add(group);

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const cameraTarget = new THREE.Vector3(0, 0, 0);
    const baseTarget = new THREE.Vector3(0, 0, 0);
    const prevCameraPosition = new THREE.Vector3();
    const prevCameraTarget = new THREE.Vector3();
    const desiredCameraPosition = new THREE.Vector3();
    const desiredCameraTarget = new THREE.Vector3();
    const prevGroupRotationY = { current: group.rotation.y };
    const prevGroupPositionZ = { current: group.position.z };
    const sceneObjects = objects;
    const materials: THREE.ShaderMaterial[] = [];
    const meshes: Array<{ mesh: THREE.Mesh; uniforms: ShaderUniforms }> = [];

    sceneObjects.forEach((object) => {
      const meshMaterial = material.clone();
      const meshUniforms = meshMaterial.uniforms as ShaderUniforms;
      meshUniforms.uFrontColor.value = new THREE.Color(object.frontColor);
      meshUniforms.uSideColor.value = new THREE.Color(object.sideColor);

      const mesh = new THREE.Mesh(geometry, meshMaterial);
      mesh.scale.setScalar(object.side);
      mesh.position.set(
        object.position.x,
        object.side / 2 + object.position.yOffset,
        object.position.z,
      );
      mesh.userData = object;
      group.add(mesh);
      materials.push(meshMaterial);
      meshes.push({ mesh, uniforms: meshUniforms });
    });

    const selectObject = (mesh: THREE.Mesh, object: SceneObject) => {
      const objectPosition = new THREE.Vector3();
      mesh.getWorldPosition(objectPosition);

      prevCameraPosition.copy(camera.position);
      prevCameraTarget.copy(cameraTarget);
      prevGroupRotationY.current = group.rotation.y;
      prevGroupPositionZ.current = group.position.z;

      const direction = new THREE.Vector3()
        .subVectors(camera.position, objectPosition)
        .normalize();
      const distance = Math.max(4, object.side * 3);
      desiredCameraPosition
        .copy(objectPosition)
        .add(direction.multiplyScalar(distance));
      desiredCameraPosition.y = 2;
      desiredCameraTarget.copy(objectPosition);

      viewModeRef.current = "zoom";
      onSelect(object);
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (viewModeRef.current !== "idle") return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(group.children, false);
      if (intersects.length > 0) {
        const hit = intersects[0];
        if (!hit) return;
        const hitMesh = hit.object as THREE.Mesh;
        const object = hitMesh.userData as SceneObject | undefined;
        if (object) {
          selectObject(hitMesh, object);
        }
      }
    };

    renderer.domElement.addEventListener("pointerdown", handlePointerDown);

    triggerReturnRef.current = () => {
      if (viewModeRef.current === "idle") return;
      viewModeRef.current = "return";
    };

    const resize = () => {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    const animate = (time: number) => {
      frameId = window.requestAnimationFrame(animate);
      const selectedName = selectedNameRef.current;
      meshes.forEach(({ mesh, uniforms }) => {
        const target =
          selectedName && mesh.userData.name !== selectedName ? 0 : 1;
        const current = typeof uniforms.uOpacity.value === "number"
          ? uniforms.uOpacity.value
          : 1;
        uniforms.uOpacity.value = THREE.MathUtils.lerp(current, target, 0.08);
      });

      if (viewModeRef.current === "idle") {
        group.rotation.y += 0.0018;
        group.position.z = Math.sin(time * 0.00035) * 1.2;
        cameraTarget.lerp(baseTarget, 0.05);
        camera.lookAt(cameraTarget);
      } else if (viewModeRef.current === "zoom") {
        camera.position.lerp(desiredCameraPosition, 0.05);
        cameraTarget.lerp(desiredCameraTarget, 0.05);
        camera.lookAt(cameraTarget);
      } else if (viewModeRef.current === "return") {
        camera.position.lerp(prevCameraPosition, 0.05);
        cameraTarget.lerp(prevCameraTarget, 0.05);
        camera.lookAt(cameraTarget);
        group.rotation.y = THREE.MathUtils.lerp(
          group.rotation.y,
          prevGroupRotationY.current,
          0.05,
        );
        group.position.z = THREE.MathUtils.lerp(
          group.position.z,
          prevGroupPositionZ.current,
          0.05,
        );

        if (
          camera.position.distanceTo(prevCameraPosition) < 0.02 &&
          Math.abs(group.rotation.y - prevGroupRotationY.current) < 0.01 &&
          Math.abs(group.position.z - prevGroupPositionZ.current) < 0.01
        ) {
          viewModeRef.current = "idle";
        }
      }

      renderer.render(scene, camera);
    };

    animate(0);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
      geometry.dispose();
      material.dispose();
      materials.forEach((meshMaterial) => meshMaterial.dispose());
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [objects, onSelect]);

  return <div ref={containerRef} className="fixed inset-0 z-0" />;
};
