import * as THREE from "three";
import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { EffectComposer, N8AO } from "@react-three/postprocessing";
import {
  BallCollider,
  Physics,
  RigidBody,
  CylinderCollider,
  RapierRigidBody,
} from "@react-three/rapier";

function createBadgeTexture(
  name: string,
  accentColor: string
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  // Base background
  ctx.fillStyle = "#120e18";
  ctx.fillRect(0, 0, 512, 512);

  // Gradient radial glow
  const grad = ctx.createRadialGradient(256, 256, 60, 256, 256, 250);
  grad.addColorStop(0, accentColor);
  grad.addColorStop(0.35, "rgba(20, 14, 28, 0.9)");
  grad.addColorStop(1, "#0d0912");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  // Glowing Outer Ring
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(256, 256, 210, 0, Math.PI * 2);
  ctx.stroke();

  // Subtle inner accent ring
  ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(256, 256, 185, 0, Math.PI * 2);
  ctx.stroke();

  // Text Label
  ctx.fillStyle = "#ffffff";
  ctx.font = "700 52px Geist, Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.shadowColor = accentColor;
  ctx.shadowBlur = 18;
  ctx.fillText(name, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

const toolBadges = [
  { name: "FIGMA", color: "#c481ff" },
  { name: "PREMIERE", color: "#9a66ff" },
  { name: "AFTER FX", color: "#7048e8" },
  { name: "PHOTOSHOP", color: "#38bdf8" },
  { name: "ILLUSTRATOR", color: "#fb923c" },
  { name: "HTML5", color: "#f97316" },
  { name: "CSS3", color: "#38bdf8" },
  { name: "JAVASCRIPT", color: "#facc15" },
  { name: "UI / UX", color: "#c084fc" },
  { name: "MOTION", color: "#e879f9" },
];

const sphereGeometry = new THREE.SphereGeometry(1, 18, 18);

const spheres = [...Array(30)].map(() => ({
  scale: [0.7, 1, 0.8, 1, 1][Math.floor(Math.random() * 5)],
}));

type SphereProps = {
  vec?: THREE.Vector3;
  scale: number;
  r?: typeof THREE.MathUtils.randFloatSpread;
  material: THREE.MeshPhysicalMaterial;
  isActive: boolean;
};

function SphereGeo({
  vec = new THREE.Vector3(),
  scale,
  material,
  isActive,
}: SphereProps) {
  const api = useRef<RapierRigidBody | null>(null);

  useFrame((_state, delta) => {
    if (!isActive) return;
    delta = Math.min(0.1, delta);
    const impulse = vec
      .copy(api.current!.translation())
      .normalize()
      .multiply(
        new THREE.Vector3(
          -50 * delta * scale,
          -150 * delta * scale,
          -50 * delta * scale
        )
      );

    api.current?.applyImpulse(impulse, true);
  });

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.15}
      friction={0.2}
      position={[
        THREE.MathUtils.randFloatSpread(20),
        THREE.MathUtils.randFloatSpread(20) - 25,
        THREE.MathUtils.randFloatSpread(20) - 10,
      ]}
      ref={api}
      colliders={false}
      dispose={null}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, 1.2 * scale]}
        args={[0.15 * scale, 0.275 * scale]}
      />
      <mesh
        castShadow={false}
        receiveShadow={false}
        scale={scale}
        geometry={sphereGeometry}
        material={material}
        dispose={null}
      />
    </RigidBody>
  );
}

function Pointer({
  vec = new THREE.Vector3(),
  isActive,
}: {
  vec?: THREE.Vector3;
  isActive: boolean;
}) {
  const ref = useRef<RapierRigidBody | null>(null);
  useFrame(({ pointer, viewport }) => {
    if (!isActive) return;
    const targetVec = vec.lerp(
      new THREE.Vector3(
        (pointer.x * viewport.width) / 2,
        (pointer.y * viewport.height) / 2,
        0
      ),
      0.2
    );
    ref.current?.setNextKinematicTranslation(targetVec);
  });

  return (
    <RigidBody
      position={[100, 100, 100]}
      type="kinematicPosition"
      colliders={false}
      ref={ref}
    >
      <BallCollider args={[2]} />
    </RigidBody>
  );
}

const TechStack = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(sectionRef.current);
    return () => {
      observer.disconnect();
    };
  }, []);

  const materials = useMemo(() => {
    return toolBadges.map((badge) => {
      const texture = createBadgeTexture(badge.name, badge.color);
      return new THREE.MeshPhysicalMaterial({
        map: texture,
        emissive: "#ffffff",
        emissiveMap: texture,
        emissiveIntensity: 0.35,
        metalness: 0.4,
        roughness: 0.8,
        clearcoat: 0.15,
      });
    });
  }, []);

  return (
    <div className="techstack" ref={sectionRef}>
      <h2>Creative Toolkit</h2>

      <Canvas
        shadows
        frameloop={isInView ? "always" : "never"}
        dpr={[1, 1.5]}
        gl={{
          alpha: true,
          stencil: false,
          depth: false,
          antialias: false,
          powerPreference: "high-performance",
        }}
        camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
        onCreated={(state) => (state.gl.toneMappingExposure = 1.5)}
        className="tech-canvas"
      >
        <ambientLight intensity={1} />
        <spotLight
          position={[20, 20, 25]}
          penumbra={1}
          angle={0.2}
          color="white"
          castShadow
          shadow-mapSize={[512, 512]}
        />
        <directionalLight position={[0, 5, -4]} intensity={2} />
        {isInView && (
          <Physics gravity={[0, 0, 0]}>
            <Pointer isActive={isInView} />
            {spheres.map((props, i) => (
              <SphereGeo
                key={i}
                {...props}
                material={materials[Math.floor(Math.random() * materials.length)]}
                isActive={isInView}
              />
            ))}
          </Physics>
        )}
        <Environment
          files="/models/char_enviorment.hdr"
          environmentIntensity={0.5}
          environmentRotation={[0, 4, 2]}
        />
      </Canvas>
    </div>
  );
};

export default TechStack;
