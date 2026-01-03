"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { Color, type IUniform, type Mesh, type ShaderMaterial } from "three";

type UniformValue<T> = { value: T };

type SilkUniforms = Record<string, IUniform> & {
  uTime: UniformValue<number>;
  uColor: UniformValue<Color>;
  uSpeed: UniformValue<number>;
  uScale: UniformValue<number>;
  uRotation: UniformValue<number>;
  uNoiseIntensity: UniformValue<number>;
};

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;

uniform float uTime;
uniform vec3  uColor;
uniform float uSpeed;
uniform float uScale;
uniform float uRotation;
uniform float uNoiseIntensity;

const float e = 2.71828182845904523536;

float noise(vec2 texCoord) {
  float G = e;
  vec2  r = (G * sin(G * texCoord));
  return fract(r.x * r.y * (1.0 + texCoord.x));
}

vec2 rotateUvs(vec2 uv, float angle) {
  float c = cos(angle);
  float s = sin(angle);
  mat2  rot = mat2(c, -s, s, c);
  return rot * uv;
}

void main() {
  float rnd        = noise(gl_FragCoord.xy);
  vec2  uv         = rotateUvs(vUv * uScale, uRotation);
  vec2  tex        = uv * uScale;
  float tOffset    = uSpeed * uTime;

  tex.y += 0.03 * sin(8.0 * tex.x - tOffset);

  float pattern = 0.6 +
                  0.4 * sin(5.0 * (tex.x + tex.y +
                                   cos(3.0 * tex.x + 5.0 * tex.y) +
                                   0.02 * tOffset) +
                           sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));

  vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
  col.a = 1.0;
  gl_FragColor = col;
}
`;

function SilkPlane({
  uniforms,
  meshRef,
}: {
  uniforms: SilkUniforms;
  meshRef: React.RefObject<Mesh | null>;
}) {
  const { viewport } = useThree();

  useLayoutEffect(() => {
    if (meshRef.current) {
      meshRef.current.scale.set(viewport.width, viewport.height, 1);
    }
  }, [meshRef, viewport]);

  useFrame((_state: RootState, delta: number) => {
    if (!meshRef.current) return;
    const material = meshRef.current.material as ShaderMaterial & {
      uniforms: SilkUniforms;
    };
    material.uniforms.uTime.value += 0.1 * delta;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

function FrameThrottle({
  enabled,
  fps = 30,
}: {
  enabled: boolean;
  fps?: number;
}) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
    if (!enabled) return;

    let rafId = 0;
    let last = 0;
    const frameMs = 1000 / fps;

    const loop = (now: number) => {
      if (now - last >= frameMs) {
        last = now;
        invalidate();
      }
      rafId = window.requestAnimationFrame(loop);
    };

    rafId = window.requestAnimationFrame(loop);
    return () => window.cancelAnimationFrame(rafId);
  }, [enabled, fps, invalidate]);

  return null;
}

export type SilkBackgroundProps = {
  speed?: number;
  scale?: number;
  color?: string;
  noiseIntensity?: number;
  rotation?: number;
  fps?: number;
  className?: string;
  onReady?: () => void;
};

export default function SilkBackground({
  speed = 5,
  scale = 1,
  color = "#7B7481",
  noiseIntensity = 1.5,
  rotation = 0,
  fps = 30,
  className,
  onReady,
}: SilkBackgroundProps) {
  const meshRef = useRef<Mesh>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const onVisibilityChange = () =>
      setIsVisible(document.visibilityState === "visible");
    onVisibilityChange();
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const uniforms = useMemo<SilkUniforms>(
    () => ({
      uSpeed: { value: speed },
      uScale: { value: scale },
      uNoiseIntensity: { value: noiseIntensity },
      uColor: { value: new Color(color) },
      uRotation: { value: rotation },
      uTime: { value: 0 },
    }),
    []
  );

  useEffect(() => {
    uniforms.uSpeed.value = speed;
    uniforms.uScale.value = scale;
    uniforms.uNoiseIntensity.value = noiseIntensity;
    uniforms.uRotation.value = rotation;
  }, [noiseIntensity, rotation, scale, speed, uniforms]);

  useEffect(() => {
    uniforms.uColor.value.set(color);
  }, [color, uniforms]);

  return (
    <Canvas
      dpr={1}
      frameloop="demand"
      gl={{
        alpha: true,
        antialias: false,
        powerPreference: "low-power",
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
      }}
      className={["h-full w-full", className].filter(Boolean).join(" ")}
    >
      <FrameThrottle enabled={!prefersReducedMotion && isVisible} fps={fps} />
      <ReadySignal onReady={onReady} />
      <SilkPlane uniforms={uniforms} meshRef={meshRef} />
    </Canvas>
  );
}

function ReadySignal({ onReady }: { onReady?: () => void }) {
  const hasSignaledRef = useRef(false);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useFrame(() => {
    if (hasSignaledRef.current) return;
    hasSignaledRef.current = true;
    onReady?.();
  });

  return null;
}
