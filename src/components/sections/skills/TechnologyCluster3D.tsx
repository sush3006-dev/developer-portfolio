import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SkillCategory, SkillItem } from '../../../data/skillsData';
import { getOrCreateSkillTexture } from './SphereTextureFactory';
import { ClusterFallback } from './ClusterFallback';

interface TechnologyCluster3DProps {
  category: SkillCategory;
}

interface PhysicalSphere {
  id: string;
  skill: SkillItem;
  group: THREE.Group;
  sphereMesh: THREE.Mesh;
  capMesh: THREE.Mesh;
  radius: number;
  position: THREE.Vector3;
  velocity: THREE.Vector3;
  targetPosition: THREE.Vector3;
  scale: number;
  targetScale: number;
  opacity: number;
  targetOpacity: number;
  phase: number;
  isExiting: boolean;
  isHovered: boolean;
}

/**
 * Pre-defined bespoke 3D organic cluster targets for all categories
 */
const CLUSTER_TARGETS: Record<string, { x: number; y: number; z: number; r: number }[]> = {
  'programming-languages': [
    { x: -1.35, y: 0.1, z: 0.2, r: 1.15 }, // Python
    { x: 1.35, y: -0.1, z: -0.2, r: 1.15 }, // Java
  ],
  'frontend-development': [
    { x: 0.0, y: 0.18, z: 0.35, r: 1.12 }, // React (centerpiece)
    { x: -1.75, y: 0.95, z: -0.15, r: 0.98 }, // Next.js
    { x: 1.75, y: 0.95, z: -0.12, r: 0.95 }, // Tailwind CSS
    { x: -1.6, y: -1.05, z: 0.15, r: 0.96 }, // JavaScript
    { x: 1.55, y: -1.05, z: 0.1, r: 0.85 }, // HTML5
    { x: 0.0, y: -1.6, z: -0.2, r: 0.85 }, // CSS3
  ],
  'backend-development': [
    { x: -1.3, y: 0.65, z: 0.2, r: 1.05 }, // FastAPI
    { x: 1.3, y: 0.65, z: 0.1, r: 1.05 }, // Node.js
    { x: -1.1, y: -0.85, z: -0.15, r: 0.92 }, // Express.js
    { x: 1.1, y: -0.85, z: 0.15, r: 0.90 }, // REST APIs
  ],
  'ai-ml': [
    { x: -1.25, y: 0.7, z: 0.25, r: 1.05 }, // AI API
    { x: 1.25, y: 0.7, z: 0.15, r: 0.95 }, // Neural Networks
    { x: -1.15, y: -0.8, z: -0.15, r: 0.92 }, // OCR
    { x: 1.15, y: -0.8, z: 0.1, r: 0.95 }, // ML Fundamentals
  ],
  'database-storage': [
    { x: 0.0, y: 0.85, z: 0.2, r: 1.10 }, // PostgreSQL
    { x: -1.35, y: -0.65, z: -0.15, r: 0.98 }, // MongoDB
    { x: 1.35, y: -0.65, z: 0.15, r: 0.98 }, // Supabase
  ],
  'developer-tools': [
    { x: -1.4, y: 0.25, z: 0.2, r: 1.08 }, // Git
    { x: 1.4, y: 0.25, z: -0.15, r: 1.08 }, // GitHub
    { x: 0.0, y: -0.95, z: 0.15, r: 1.02 }, // VS Code
  ],
  'financial-markets': [
    { x: 0.0, y: 0.25, z: 0.4, r: 1.05 }, // Indian Stock Market (center prominent)
    { x: -1.8, y: 1.1, z: -0.2, r: 0.88 }, // Equity Derivatives
    { x: 1.8, y: 1.1, z: -0.15, r: 0.88 }, // Futures & Options
    { x: -2.0, y: -0.65, z: 0.15, r: 0.88 }, // Technical Analysis
    { x: 2.0, y: -0.65, z: 0.2, r: 0.86 }, // Price Action
    { x: 0.0, y: -1.65, z: -0.15, r: 0.86 }, // Risk Management
    { x: -0.75, y: 1.85, z: -0.3, r: 0.80 }, // Sector Rotation
    { x: 0.75, y: 1.85, z: -0.3, r: 0.80 }, // Market Research
  ],
};

export const TechnologyCluster3D: React.FC<TechnologyCluster3DProps> = ({ category }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Fallback state if WebGL cannot be initialized
  const [hasWebGLInitError, setHasWebGLInitError] = useState(false);

  // Floating hover feedback state
  const [hoveredSkill, setHoveredSkill] = useState<{ name: string; tag?: string } | null>(null);

  // Active Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const spheresRef = useRef<PhysicalSphere[]>([]);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Parallax tracking
  const parallaxRef = useRef({ currentX: 0, currentY: 0, targetX: 0, targetY: 0 });
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseNdcRef = useRef(new THREE.Vector2(-999, -999));

  // Shared Pearl Material
  const pearlMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  // Keep track of current category to avoid re-triggering on duplicate click
  const activeCategoryIdRef = useRef<string>(category.id);

  // Initialize Three.js scene once with dedicated renderer and isolated canvas
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // 1. Create WebGLRenderer safely
    // Notice: We let Three.js create its own dedicated <canvas> (renderer.domElement)
    // rather than calling getContext() on a shared React canvas, completely preventing
    // "Canvas has an existing context of a different type" error!
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL initialization failed in TechnologyCluster3D:', err);
      setHasWebGLInitError(true);
      return;
    }

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    rendererRef.current = renderer;

    const canvas = renderer.domElement;
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    canvas.style.touchAction = 'pan-y';
    container.appendChild(canvas);

    // 2. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 3. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    const initialZ = width < 640 ? 11.2 : width < 1024 ? 9.8 : 9.2;
    camera.position.set(0, 0, initialZ);
    cameraRef.current = camera;

    // 4. Studio Lighting for Pearl Sheen & Specular Highlights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffbf0, 2.2);
    keyLight.position.set(5, 7, 6);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xe0f2fe, 1.0);
    fillLight.position.set(-6, -3, 4);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xfef3c7, 1.6, 25);
    rimLight.position.set(0, 5, -4);
    scene.add(rimLight);

    // 5. Shared Pearl-White Material (refined soft ivory luster)
    const pearlMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xfefefe,
      roughness: 0.20,
      metalness: 0.04,
      clearcoat: 0.65,
      clearcoatRoughness: 0.16,
      reflectivity: 0.55,
    });
    pearlMaterialRef.current = pearlMaterial;

    // 6. Spawn initial category spheres
    spawnCategorySpheres(category, true);

    // 7. Pointer Event Handlers
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      mouseNdcRef.current.set(x, y);
      parallaxRef.current.targetX = x * 0.42;
      parallaxRef.current.targetY = y * 0.32;
    };

    const onPointerLeave = () => {
      mouseNdcRef.current.set(-999, -999);
      parallaxRef.current.targetX = 0;
      parallaxRef.current.targetY = 0;
      setHoveredSkill(null);
    };

    const onPointerDown = () => {
      const activeSpheres = spheresRef.current;
      const meshesToTest = activeSpheres.filter((s) => !s.isExiting).map((s) => s.sphereMesh);
      raycasterRef.current.setFromCamera(mouseNdcRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(meshesToTest, false);

      if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const sphere = activeSpheres.find((s) => s.sphereMesh === clickedMesh);
        if (sphere) {
          sphere.velocity.z -= 0.08;
          sphere.velocity.x += (Math.random() - 0.5) * 0.06;
          sphere.velocity.y += (Math.random() - 0.5) * 0.06;
        }
      }
    };

    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerleave', onPointerLeave);
    canvas.addEventListener('pointerdown', onPointerDown);

    // 8. Animation Loop with soft physics & floating motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = (currentTime: number) => {
      animFrameIdRef.current = requestAnimationFrame(animate);
      const t = currentTime * 0.001;

      // Smooth Camera Parallax Lerp
      const parallax = parallaxRef.current;
      parallax.currentX += (parallax.targetX - parallax.currentX) * 0.05;
      parallax.currentY += (parallax.targetY - parallax.currentY) * 0.05;

      camera.position.x = parallax.currentX;
      camera.position.y = parallax.currentY;
      camera.lookAt(0, 0, 0);

      // Raycasting for Hover Detection
      const activeSpheres = spheresRef.current;
      const meshesToTest = activeSpheres.filter((s) => !s.isExiting).map((s) => s.sphereMesh);
      raycasterRef.current.setFromCamera(mouseNdcRef.current, camera);
      const intersects = raycasterRef.current.intersectObjects(meshesToTest, false);

      let currentHoveredMesh: THREE.Object3D | null = null;
      if (intersects.length > 0) {
        currentHoveredMesh = intersects[0].object;
      }

      let foundHoveredSkill: { name: string; tag?: string } | null = null;

      // Update Individual Spheres
      for (let i = activeSpheres.length - 1; i >= 0; i--) {
        const s = activeSpheres[i];

        // Hover state
        const isHovered = s.sphereMesh === currentHoveredMesh && !s.isExiting;
        s.isHovered = isHovered;
        if (isHovered) {
          foundHoveredSkill = { name: s.skill.name, tag: s.skill.tag };
          s.targetScale = 1.14;
        } else if (!s.isExiting) {
          s.targetScale = 1.0;
        }

        // Scale & Opacity Transitions
        s.scale += (s.targetScale - s.scale) * (s.isExiting ? 0.12 : 0.09);
        s.opacity += (s.targetOpacity - s.opacity) * 0.1;

        // Clean up fully exited spheres
        if (s.isExiting && s.scale < 0.06) {
          scene.remove(s.group);
          s.sphereMesh.geometry.dispose();
          s.capMesh.geometry.dispose();
          if (Array.isArray(s.capMesh.material)) {
            s.capMesh.material.forEach((m) => m.dispose());
          } else {
            s.capMesh.material.dispose();
          }
          activeSpheres.splice(i, 1);
          continue;
        }

        s.group.scale.setScalar(Math.max(s.scale, 0.001));

        // Physics: Spring Attraction toward assigned cluster anchor
        if (!s.isExiting) {
          const fx = (s.targetPosition.x - s.position.x) * 0.055;
          const fy = (s.targetPosition.y - s.position.y) * 0.055;
          const fz = (s.targetPosition.z - s.position.z) * 0.055;
          s.velocity.x += fx;
          s.velocity.y += fy;
          s.velocity.z += fz;
        } else {
          s.velocity.x += s.position.x * 0.04;
          s.velocity.y += s.position.y * 0.04;
          s.velocity.z -= 0.06;
        }

        // Damping
        s.velocity.multiplyScalar(0.91);
        s.position.add(s.velocity);

        // Bounding volume safety constraint
        const distFromCenter = s.position.length();
        if (distFromCenter > 3.8) {
          s.position.multiplyScalar(3.8 / distFromCenter);
          s.velocity.multiplyScalar(-0.4);
        }

        // Harmonic Floating Drift (Buoyancy)
        let floatX = 0;
        let floatY = 0;
        let floatZ = 0;
        if (!prefersReducedMotion && !s.isExiting) {
          floatX = Math.sin(t * 0.95 + s.phase) * 0.045;
          floatY = Math.cos(t * 1.25 + s.phase * 1.3) * 0.06;
          floatZ = Math.sin(t * 0.85 + s.phase * 2.1) * 0.035;
        }

        const hoverZOffset = isHovered ? 0.42 : 0;

        s.group.position.set(
          s.position.x + floatX,
          s.position.y + floatY,
          s.position.z + floatZ + hoverZOffset
        );

        // Gentle Controlled 3D Tilting (keeps logos facing forward)
        if (!prefersReducedMotion && !s.isExiting) {
          const tiltX = Math.sin(t * 0.7 + s.phase) * 0.12;
          const tiltY = Math.cos(t * 0.8 + s.phase) * 0.16;
          const tiltZ = Math.sin(t * 0.5 + s.phase) * 0.04;
          s.group.rotation.set(tiltX, tiltY, tiltZ);
        }
      }

      // Physics: Soft Sphere-to-Sphere Collision Resolution
      const len = activeSpheres.length;
      for (let i = 0; i < len; i++) {
        for (let j = i + 1; j < len; j++) {
          const a = activeSpheres[i];
          const b = activeSpheres[j];
          if (a.isExiting || b.isExiting) continue;

          const dx = a.position.x - b.position.x;
          const dy = a.position.y - b.position.y;
          const dz = a.position.z - b.position.z;
          const distSq = dx * dx + dy * dy + dz * dz;
          const minDist = a.radius + b.radius;

          if (distSq < minDist * minDist && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const nx = dx / dist;
            const ny = dy / dist;
            const nz = dz / dist;
            const overlap = minDist - dist;

            const separationFactor = overlap * 0.45;
            a.position.x += nx * separationFactor;
            a.position.y += ny * separationFactor;
            a.position.z += nz * separationFactor;
            b.position.x -= nx * separationFactor;
            b.position.y -= ny * separationFactor;
            b.position.z -= nz * separationFactor;

            const relVx = a.velocity.x - b.velocity.x;
            const relVy = a.velocity.y - b.velocity.y;
            const relVz = a.velocity.z - b.velocity.z;
            const vRelNorm = relVx * nx + relVy * ny + relVz * nz;

            if (vRelNorm < 0) {
              const restitution = 0.35;
              const impulse = -(1 + restitution) * vRelNorm * 0.5;
              a.velocity.x += nx * impulse;
              a.velocity.y += ny * impulse;
              a.velocity.z += nz * impulse;
              b.velocity.x -= nx * impulse;
              b.velocity.y -= ny * impulse;
              b.velocity.z -= nz * impulse;
            }
          }
        }
      }

      setHoveredSkill(foundHoveredSkill);
      canvas.style.cursor = foundHoveredSkill ? 'pointer' : 'default';

      renderer.render(scene, camera);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // 9. Responsive Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 560;

      camera.aspect = w / h;
      camera.position.z = w < 640 ? 11.2 : w < 1024 ? 9.8 : 9.2;
      camera.updateProjectionMatrix();

      renderer.setSize(w, h, false);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // 10. Clean Unmount & Disposal
    return () => {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('resize', handleResize);

      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      timeoutsRef.current.forEach(clearTimeout);

      if (container.contains(canvas)) {
        container.removeChild(canvas);
      }

      renderer.dispose();
      renderer.forceContextLoss();
      scene.clear();
      if (pearlMaterialRef.current) pearlMaterialRef.current.dispose();
    };
  }, []);

  /**
   * Spawns physical spheres for the target category
   */
  const spawnCategorySpheres = (targetCategory: SkillCategory, isInitial = false) => {
    const scene = sceneRef.current;
    const pearlMaterial = pearlMaterialRef.current;
    if (!scene || !pearlMaterial) return;

    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    spheresRef.current.forEach((s) => {
      s.isExiting = true;
      s.targetScale = 0;
      s.targetOpacity = 0;
      s.velocity.x += (Math.random() - 0.5) * 0.15;
      s.velocity.y += (Math.random() - 0.5) * 0.15;
      s.velocity.z -= 0.1;
    });

    const targets =
      CLUSTER_TARGETS[targetCategory.id] ||
      targetCategory.skills.map((_, idx) => ({
        x: Math.cos((idx / targetCategory.skills.length) * Math.PI * 2) * 1.5,
        y: Math.sin((idx / targetCategory.skills.length) * Math.PI * 2) * 1.5,
        z: 0,
        r: 0.95,
      }));

    targetCategory.skills.forEach((skill, idx) => {
      const targetConfig = targets[idx] || { x: 0, y: 0, z: 0, r: 0.95 };
      const radius = targetConfig.r;
      const delay = isInitial ? idx * 25 : idx * 40;

      const timeout = setTimeout(() => {
        const group = new THREE.Group();

        // 1. Pearl-white 3D Sphere Mesh
        const sphereGeometry = new THREE.SphereGeometry(radius, 40, 40);
        const sphereMesh = new THREE.Mesh(sphereGeometry, pearlMaterial);
        group.add(sphereMesh);

        // 2. Surface-Conforming Cap Geometry with Planar UV Mapping
        const capTheta = 0.72;
        const capGeometry = new THREE.SphereGeometry(
          radius * 1.002,
          32,
          16,
          0,
          Math.PI * 2,
          0,
          capTheta
        );
        capGeometry.rotateX(Math.PI / 2);

        const posAttr = capGeometry.attributes.position;
        const uvAttr = capGeometry.attributes.uv;
        const maxR = radius * 1.002 * Math.sin(capTheta);

        for (let vIdx = 0; vIdx < posAttr.count; vIdx++) {
          const x = posAttr.getX(vIdx);
          const y = posAttr.getY(vIdx);
          const u = (x / maxR) * 0.5 + 0.5;
          const v = (y / maxR) * 0.5 + 0.5;
          uvAttr.setXY(vIdx, u, v);
        }
        uvAttr.needsUpdate = true;

        const texture = getOrCreateSkillTexture(skill);

        const capMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          roughness: 0.22,
          metalness: 0.05,
          polygonOffset: true,
          polygonOffsetFactor: -1,
          polygonOffsetUnits: -1,
          depthWrite: false,
        });

        const capMesh = new THREE.Mesh(capGeometry, capMaterial);
        group.add(capMesh);

        const spawnAngle = (idx / targetCategory.skills.length) * Math.PI * 2 + 0.35;
        const spawnDist = isInitial ? 0.3 : 4.2;
        const startX = targetConfig.x + Math.cos(spawnAngle) * spawnDist;
        const startY = targetConfig.y + Math.sin(spawnAngle) * spawnDist;
        const startZ = (Math.random() - 0.5) * 0.8;

        group.position.set(startX, startY, startZ);
        group.scale.setScalar(0.01);
        scene.add(group);

        const newSphere: PhysicalSphere = {
          id: skill.id,
          skill,
          group,
          sphereMesh,
          capMesh,
          radius,
          position: new THREE.Vector3(startX, startY, startZ),
          velocity: isInitial
            ? new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, 0)
            : new THREE.Vector3(
                (targetConfig.x - startX) * 0.04,
                (targetConfig.y - startY) * 0.04,
                (targetConfig.z - startZ) * 0.04
              ),
          targetPosition: new THREE.Vector3(targetConfig.x, targetConfig.y, targetConfig.z),
          scale: 0.01,
          targetScale: 1.0,
          opacity: 0,
          targetOpacity: 1.0,
          phase: Math.random() * Math.PI * 2,
          isExiting: false,
          isHovered: false,
        };

        spheresRef.current.push(newSphere);
      }, delay);

      timeoutsRef.current.push(timeout);
    });
  };

  // Trigger category change when category prop updates
  useEffect(() => {
    if (activeCategoryIdRef.current === category.id) return;
    activeCategoryIdRef.current = category.id;
    spawnCategorySpheres(category, false);
  }, [category]);

  if (hasWebGLInitError) {
    return <ClusterFallback category={category} />;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-[460px] sm:h-[520px] lg:h-[580px] relative flex items-center justify-center select-none overflow-hidden"
    >
      {/* Floating Interactive Skill Hover Pill */}
      <div
        className={`absolute bottom-4 sm:bottom-6 pointer-events-none transition-all duration-300 transform z-20 ${
          hoveredSkill
            ? 'opacity-100 translate-y-0 scale-100'
            : 'opacity-0 translate-y-2 scale-95'
        }`}
      >
        {hoveredSkill && (
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md border border-[#D4A500] shadow-[0_8px_20px_-4px_rgba(212,165,0,0.15)]">
            <span className="w-2 h-2 rounded-full bg-[#D4A500] animate-pulse" />
            <span className="text-sm font-bold text-[#07163F] font-heading">{hoveredSkill.name}</span>
            {hoveredSkill.tag && (
              <>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-xs font-mono font-semibold text-amber-800">
                  {hoveredSkill.tag}
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
