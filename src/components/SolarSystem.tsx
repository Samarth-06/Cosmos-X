import { useMemo, useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Group, Mesh, AdditiveBlending, BackSide, DoubleSide } from "three";
import * as THREE from "three";
import { PLANETS, SUN, type Planet } from "@/lib/planets";

type Props = {
  scrollProgress: React.MutableRefObject<number>;
  hoveredPlanet: string | null;
  setHoveredPlanet: (id: string | null) => void;
  onPlanetClick: (id: string) => void;
};

/** Sun with additive glow shell. */
function Sun() {
  const tex = useLoader(TextureLoader, SUN.texture);
  const meshRef = useRef<Mesh>(null);
  useFrame((_, dt) => {
    if (meshRef.current) meshRef.current.rotation.y += dt * 0.05;
  });
  return (
    <group>
      <pointLight position={[0, 0, 0]} intensity={3.5} distance={200} decay={1.2} color="#fff2c8" />
      <mesh ref={meshRef}>
        <sphereGeometry args={[SUN.radius, 64, 64]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
      {/* Corona */}
      <mesh>
        <sphereGeometry args={[SUN.radius * 1.15, 32, 32]} />
        <meshBasicMaterial
          color="#ffb347"
          transparent
          opacity={0.18}
          blending={AdditiveBlending}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[SUN.radius * 1.35, 32, 32]} />
        <meshBasicMaterial
          color="#ff8a2a"
          transparent
          opacity={0.08}
          blending={AdditiveBlending}
          side={BackSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

/** Faint circular orbit line. */
function OrbitRing({ radius, highlighted }: { radius: number; highlighted: boolean }) {
  const points = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const seg = 128;
    for (let i = 0; i <= seg; i++) {
      const a = (i / seg) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return pts;
  }, [radius]);
  const geo = useMemo(() => new THREE.BufferGeometry().setFromPoints(points), [points]);
  return (
    <line>
      {/* @ts-expect-error r3f primitive */}
      <primitive attach="geometry" object={geo} />
      <lineBasicMaterial
        color={highlighted ? "#5B6CFF" : "#3a4470"}
        transparent
        opacity={highlighted ? 0.65 : 0.18}
      />
    </line>
  );
}

function PlanetBody({
  planet,
  hovered,
  onHover,
  onClick,
  time,
}: {
  planet: Planet;
  hovered: boolean;
  onHover: (h: boolean) => void;
  onClick: () => void;
  time: number;
}) {
  const groupRef = useRef<Group>(null);
  const spinRef = useRef<Mesh>(null);
  const tex = useLoader(TextureLoader, planet.texture);

  useFrame((_, dt) => {
    if (groupRef.current) {
      const angle = time * planet.speed + planet.orbit; // stagger
      groupRef.current.position.x = Math.cos(angle) * planet.orbit;
      groupRef.current.position.z = Math.sin(angle) * planet.orbit;
    }
    if (spinRef.current) spinRef.current.rotation.y += dt * 0.15;
  });

  const scale = hovered ? 1.25 : 1;

  return (
    <group ref={groupRef}>
      <group rotation={[0, 0, planet.tilt]} scale={scale}>
        <mesh
          ref={spinRef}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            onHover(false);
            document.body.style.cursor = "";
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <sphereGeometry args={[planet.radius, 48, 48]} />
          <meshStandardMaterial
            map={tex}
            roughness={0.92}
            metalness={0.05}
            emissive={hovered ? "#5B6CFF" : "#000000"}
            emissiveIntensity={hovered ? 0.25 : 0}
          />
        </mesh>
        {/* Halo */}
        <mesh>
          <sphereGeometry args={[planet.radius * 1.12, 24, 24]} />
          <meshBasicMaterial
            color={hovered ? "#00D8FF" : "#5B6CFF"}
            transparent
            opacity={hovered ? 0.22 : 0.06}
            blending={AdditiveBlending}
            side={BackSide}
            depthWrite={false}
          />
        </mesh>
        {planet.rings && (
          <mesh rotation={[Math.PI / 2.2, 0, 0]}>
            <ringGeometry args={[planet.rings.inner, planet.rings.outer, 96]} />
            <meshBasicMaterial
              color={planet.rings.color}
              side={DoubleSide}
              transparent
              opacity={0.55}
            />
          </mesh>
        )}
      </group>
    </group>
  );
}

/** Scroll-driven camera controller. */
function CameraRig({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const desired = useRef(new THREE.Vector3(0, 30, 65));
  const lookAt = useRef(new THREE.Vector3(0, 0, 0));

  useFrame(({ camera, clock, pointer }) => {
    const p = THREE.MathUtils.clamp(scrollProgress.current, 0, 1);
    const t = clock.getElapsedTime();

    // Overview at 0, then travel between planets in sequence
    // Segment 0: overview (0 - 0.08)
    // Segments 1..N: one planet each
    const overview = 0.1;
    let cx = 0, cy = 30, cz = 65, lx = 0, ly = 0, lz = 0;

    if (p < overview) {
      const k = p / overview;
      cx = 0;
      cy = THREE.MathUtils.lerp(30, 14, k);
      cz = THREE.MathUtils.lerp(65, 45, k);
    } else {
      const seg = (p - overview) / (1 - overview);
      const idx = Math.min(PLANETS.length - 1, Math.floor(seg * PLANETS.length));
      const local = seg * PLANETS.length - idx;
      const planet = PLANETS[idx];
      // planet position at current time (mirror PlanetBody math)
      const angle = t * planet.speed + planet.orbit;
      const px = Math.cos(angle) * planet.orbit;
      const pz = Math.sin(angle) * planet.orbit;

      // Approach vector: come from outside the orbit
      const outAngle = angle + Math.PI / 3;
      const dist = THREE.MathUtils.lerp(planet.radius * 8, planet.radius * 3.2, local);
      const height = THREE.MathUtils.lerp(3, planet.radius * 1.1, local);
      cx = px + Math.cos(outAngle) * dist;
      cy = height;
      cz = pz + Math.sin(outAngle) * dist;
      lx = px;
      ly = 0;
      lz = pz;
    }

    // Subtle parallax from mouse
    cx += pointer.x * 1.5;
    cy += pointer.y * 0.8;

    desired.current.set(cx, cy, cz);
    lookAt.current.set(lx, ly, lz);

    camera.position.lerp(desired.current, 0.06);
    target.current.lerp(lookAt.current, 0.08);
    camera.lookAt(target.current);
  });

  return null;
}

/** Distant star background using points. */
function Stars() {
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const N = 1200;
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 200 + Math.random() * 200;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return g;
  }, []);
  return (
    <points>
      {/* @ts-expect-error r3f primitive */}
      <primitive attach="geometry" object={geo} />
      <pointsMaterial size={0.6} color="#ffffff" sizeAttenuation transparent opacity={0.75} />
    </points>
  );
}

export default function SolarSystem({
  scrollProgress,
  hoveredPlanet,
  setHoveredPlanet,
  onPlanetClick,
}: Props) {
  const clockRef = useRef(0);
  useFrame((_, dt) => {
    clockRef.current += dt;
  });

  return (
    <>
      <color attach="background" args={["#040816"]} />
      <fog attach="fog" args={["#040816", 80, 220]} />
      <ambientLight intensity={0.12} />
      <Stars />
      <Sun />

      {PLANETS.map((p) => (
        <group key={p.id}>
          <OrbitRing radius={p.orbit} highlighted={hoveredPlanet === p.id} />
          <PlanetBody
            planet={p}
            hovered={hoveredPlanet === p.id}
            onHover={(h) => setHoveredPlanet(h ? p.id : null)}
            onClick={() => onPlanetClick(p.id)}
            time={clockRef.current}
          />
        </group>
      ))}

      <CameraRig scrollProgress={scrollProgress} />
    </>
  );
}
