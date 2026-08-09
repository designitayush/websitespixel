"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useReducedMotion } from "@/lib/hooks";

interface DiscSpec {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  kind: "disc" | "ring" | "dark";
  tint: string;
  speed: number;
  phase: number;
  /** Kept in the reduced set rendered on narrow viewports. */
  mobile?: boolean;
  /** Position override for narrow viewports (framing the stacked headline). */
  mobilePosition?: [number, number, number];
}

// Two arcs of glass sweeping in from the sides, like stacked lenses; the
// centre stays clear so the type never loses contrast. One dark disc anchors.
const DISCS: DiscSpec[] = [
  // Left arc, top to bottom
  { position: [-6.1, 2.5, -2.4], rotation: [1.0, -0.3, 0.4], scale: 1.0, kind: "disc", tint: "#c9b4ff", speed: 0.5, phase: 0 },
  { position: [-5.3, 1.4, -1.8], rotation: [1.15, 0.4, 0.3], scale: 1.35, kind: "disc", tint: "#8b74ff", speed: 0.45, phase: 0.8, mobile: true, mobilePosition: [-1.9, 4.2, -1.5] },
  { position: [-4.4, 0.1, -1.1], rotation: [1.3, 0.1, 0.45], scale: 1.2, kind: "ring", tint: "#ffffff", speed: 0.65, phase: 1.3 },
  { position: [-3.6, -1.2, -0.6], rotation: [1.35, -0.2, 0.5], scale: 1.05, kind: "disc", tint: "#c86bff", speed: 0.55, phase: 1.9, mobile: true, mobilePosition: [2.0, 3.8, -1.2] },
  { position: [-2.4, -2.2, 0.1], rotation: [1.5, 0.2, -0.4], scale: 0.85, kind: "ring", tint: "#ffb8dd", speed: 0.7, phase: 2.6 },
  { position: [-1.1, -2.7, 0.5], rotation: [1.45, 0.3, 0.2], scale: 0.7, kind: "disc", tint: "#ffffff", speed: 0.6, phase: 3.0, mobile: true, mobilePosition: [-2.5, -2.6, 0.2] },
  // Dark anchor just right of centre-bottom
  { position: [1.6, -2.3, -0.3], rotation: [1.2, -0.35, 0.25], scale: 0.9, kind: "dark", tint: "#221c26", speed: 0.4, phase: 3.5, mobile: true, mobilePosition: [2.6, -2.9, -0.3] },
  // Right arc, bottom to top
  { position: [2.9, -1.8, -0.5], rotation: [1.4, 0.25, -0.3], scale: 0.95, kind: "disc", tint: "#ff9a55", speed: 0.6, phase: 4.0 },
  { position: [4.0, -0.9, -0.9], rotation: [1.1, 0.3, -0.25], scale: 1.2, kind: "ring", tint: "#e3b8ff", speed: 0.5, phase: 4.5 },
  { position: [4.9, 0.3, -1.4], rotation: [1.05, 0.3, -0.2], scale: 1.45, kind: "disc", tint: "#6c54e8", speed: 0.5, phase: 5.0 },
  { position: [5.7, 1.6, -2.0], rotation: [0.9, -0.2, 0.35], scale: 1.15, kind: "disc", tint: "#4638d8", speed: 0.55, phase: 5.6 },
  { position: [6.3, 2.6, -2.6], rotation: [0.95, 0.15, 0.3], scale: 0.85, kind: "ring", tint: "#ffffff", speed: 0.7, phase: 6.1 },
];

function GlassMaterial({ tint, reduced }: { tint: string; reduced: boolean }) {
  return (
    <MeshTransmissionMaterial
      color={tint}
      thickness={1.4}
      roughness={0.05}
      ior={1.5}
      chromaticAberration={1.2}
      anisotropicBlur={0.4}
      distortion={0.25}
      distortionScale={0.6}
      temporalDistortion={reduced ? 0 : 0.12}
      iridescence={1}
      iridescenceIOR={1.9}
      iridescenceThicknessRange={[200, 1400]}
      clearcoat={0.8}
      clearcoatRoughness={0.15}
      envMapIntensity={1.1}
      resolution={256}
      samples={4}
    />
  );
}

function DarkMaterial({ tint }: { tint: string }) {
  return (
    <meshPhysicalMaterial
      color={tint}
      roughness={0.18}
      metalness={0.25}
      clearcoat={1}
      clearcoatRoughness={0.15}
      envMapIntensity={1.1}
    />
  );
}

function Disc({
  spec,
  reduced,
  narrow,
}: {
  spec: DiscSpec;
  reduced: boolean;
  narrow: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const basePosition = narrow && spec.mobilePosition ? spec.mobilePosition : spec.position;
  const scale = spec.scale * (narrow ? 1.15 : 1);

  useFrame((state, delta) => {
    if (reduced || !mesh.current) return;
    mesh.current.rotation.z += delta * spec.speed * 0.35;
    mesh.current.rotation.x += delta * spec.speed * 0.12;
    mesh.current.position.y =
      basePosition[1] + Math.sin(state.clock.elapsedTime * 0.5 + spec.phase) * 0.14;
  });

  return (
    <mesh ref={mesh} position={basePosition} rotation={spec.rotation} scale={scale}>
      {spec.kind === "ring" ? (
        <torusGeometry args={[0.82, 0.2, 48, 96]} />
      ) : (
        <cylinderGeometry args={[1, 1, 0.16, 72]} />
      )}
      {spec.kind === "dark" ? (
        <DarkMaterial tint={spec.tint} />
      ) : (
        <GlassMaterial tint={spec.tint} reduced={reduced} />
      )}
    </mesh>
  );
}

/** Pastel wash rendered inside the scene so glass transmission samples it.
 *  Drifts and breathes very slowly for an organic, fluid background. */
function Backdrop({ reduced }: { reduced: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (reduced || !mesh.current) return;
    const t = state.clock.elapsedTime;
    mesh.current.rotation.z = Math.sin(t * 0.05) * 0.06;
    const breathe = 1 + Math.sin(t * 0.15) * 0.02;
    mesh.current.scale.set(34 * breathe, 20 * breathe, 1);
  });
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const base = ctx.createLinearGradient(0, 0, 0, 512);
    base.addColorStop(0, "#F6F3EF");
    base.addColorStop(0.5, "#F1EDF6");
    base.addColorStop(1, "#EFEFF3");
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, 512, 512);
    const blob = (x: number, y: number, r: number, color: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 512, 512);
    };
    blob(430, 110, 260, "rgba(255,214,196,0.55)");
    blob(80, 300, 240, "rgba(201,232,255,0.5)");
    blob(300, 470, 260, "rgba(224,217,255,0.5)");
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);

  return (
    <mesh ref={mesh} position={[0, 0, -7]} scale={[34, 20, 1]}>
      <planeGeometry />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();

  // Fit the composition to the card width on any screen.
  const fit = Math.min(1, Math.max(0.5, viewport.width / 12.5));
  const narrow = viewport.width < 6.5;
  const discs = narrow ? DISCS.filter((d) => d.mobile) : DISCS;

  useFrame((state) => {
    if (!group.current) return;
    group.current.scale.setScalar(fit);
    if (reduced) return;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.12,
      0.045
    );
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.07,
      0.045
    );
  });

  return (
    <>
      <Backdrop reduced={reduced} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[4, 6, 6]} intensity={0.8} />
      <group ref={group} scale={fit}>
        {discs.map((spec) => (
          <Disc key={spec.phase} spec={spec} reduced={reduced} narrow={narrow} />
        ))}
      </group>
      <Environment resolution={256} frames={1}>
        <Lightformer intensity={4} color="#FF7AB8" position={[-6, 2, 2]} rotation={[0, Math.PI / 2, 0]} scale={[8, 3, 1]} />
        <Lightformer intensity={3.5} color="#8A6BFF" position={[0, 6, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[10, 4, 1]} />
        <Lightformer intensity={4} color="#5AC8FF" position={[6, -1, 2]} rotation={[0, -Math.PI / 2, 0]} scale={[8, 3, 1]} />
        <Lightformer intensity={2.5} color="#FFB86B" position={[0, -6, 1]} rotation={[-Math.PI / 2, 0, 0]} scale={[10, 4, 1]} />
        <Lightformer intensity={0.9} color="#ffffff" position={[0, 1, 8]} scale={[12, 6, 1]} />
      </Environment>
    </>
  );
}

export default function HeroScene3D() {
  const reduced = useReducedMotion();

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ fov: 30, position: [0, 0, 11] }}
      frameloop={reduced ? "demand" : "always"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Scene reduced={reduced} />
    </Canvas>
  );
}
