"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

export function SolarSystem() {
    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | undefined>(undefined);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000,
        );
        camera.position.z = 25;
        camera.position.y = 10;

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.maxDistance = 60;
        controls.minDistance = 15;

        // Lights
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xffffff, 2, 50);
        pointLight.position.set(0, 0, 0);
        scene.add(pointLight);

        // Add a subtle directional light for better shadows
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 3, 5);
        scene.add(directionalLight);

        // Sun with glow
        const sunGeometry = new THREE.SphereGeometry(3, 32, 32);
        const sunTexture = new THREE.TextureLoader().load("/placeholder.svg?height=512&width=512");
        const sunMaterial = new THREE.MeshStandardMaterial({
            map: sunTexture,
            color: 0xffcc33,
            emissive: new THREE.Color(0xffcc33),
            emissiveIntensity: 1,
        });
        const sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        // Sun glow effect
        const sunGlowGeometry = new THREE.SphereGeometry(3.2, 32, 32);
        const sunGlowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                c: { value: 0.5 },
                p: { value: 4.0 },
                glowColor: { value: new THREE.Color(0xffcc33) },
                viewVector: { value: new THREE.Vector3() },
            },
            vertexShader: `
                uniform vec3 viewVector;
                uniform float c;
                uniform float p;
                varying float intensity;
                void main() {
                    vec3 vNormal = normalize(normal);
                    vec3 vNormel = normalize(viewVector);
                    intensity = pow(c - dot(vNormal, vNormel), p);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying float intensity;
                void main() {
                    vec3 glow = glowColor * intensity;
                    gl_FragColor = vec4(glow, 1.0);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true,
        });

        const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
        scene.add(sunGlow);

        // Create planets
        const planets: THREE.Mesh[] = [];
        const orbits: THREE.Line[] = [];
        const moons: { planet: THREE.Mesh; moon: THREE.Mesh }[] = [];

        // Planet textures and properties
        interface PlanetData {
            name: string;
            size: number;
            distance: number;
            speed: number;
            color: number;
            hasRings: boolean;
            hasMoon: boolean;
            tilt: number;
        }

        const planetData: PlanetData[] = [
            {
                name: "mercury",
                size: 0.4,
                distance: 5,
                speed: 0.01,
                color: 0xa9a9a9,
                hasRings: false,
                hasMoon: false,
                tilt: 0.03,
            },
            {
                name: "venus",
                size: 0.6,
                distance: 7,
                speed: 0.007,
                color: 0xe6c073,
                hasRings: false,
                hasMoon: false,
                tilt: 0.05,
            },
            {
                name: "earth",
                size: 0.65,
                distance: 9,
                speed: 0.005,
                color: 0x6b93d6,
                hasRings: false,
                hasMoon: true,
                tilt: 0.2,
            },
            {
                name: "mars",
                size: 0.5,
                distance: 11,
                speed: 0.004,
                color: 0xc1440e,
                hasRings: false,
                hasMoon: true,
                tilt: 0.1,
            },
            {
                name: "jupiter",
                size: 1.2,
                distance: 14,
                speed: 0.002,
                color: 0xd8ca9d,
                hasRings: false,
                hasMoon: true,
                tilt: 0.07,
            },
            {
                name: "saturn",
                size: 1.0,
                distance: 17,
                speed: 0.0015,
                color: 0xead6b8,
                hasRings: true,
                hasMoon: true,
                tilt: 0.3,
            },
            {
                name: "uranus",
                size: 0.8,
                distance: 20,
                speed: 0.001,
                color: 0xc1d4e7,
                hasRings: true,
                hasMoon: true,
                tilt: 0.8,
            },
            {
                name: "neptune",
                size: 0.8,
                distance: 23,
                speed: 0.0008,
                color: 0x5b5ddf,
                hasRings: false,
                hasMoon: true,
                tilt: 0.1,
            },
        ];

        // Create planets
        planetData.forEach((data) => {
            // Create orbit
            const orbitRadius = data.distance;
            const orbitGeometry = new THREE.BufferGeometry();
            const orbitMaterial = new THREE.LineBasicMaterial({
                color: 0x444444,
                transparent: true,
                opacity: 0.3,
            });

            const orbitPoints: THREE.Vector3[] = [];
            for (let j = 0; j <= 128; j++) {
                const angle = (j / 128) * Math.PI * 2;
                orbitPoints.push(new THREE.Vector3(Math.cos(angle) * orbitRadius, 0, Math.sin(angle) * orbitRadius));
            }

            orbitGeometry.setFromPoints(orbitPoints);
            const orbit = new THREE.Line(orbitGeometry, orbitMaterial);
            scene.add(orbit);
            orbits.push(orbit);

            // Create planet
            const planetGeometry = new THREE.SphereGeometry(data.size, 16, 16);
            const planetMaterial = new THREE.MeshStandardMaterial({
                color: data.color,
                metalness: 0.2,
                roughness: 0.8,
            });

            const planet = new THREE.Mesh(planetGeometry, planetMaterial);
            const angle = Math.random() * Math.PI * 2;
            planet.position.x = Math.cos(angle) * orbitRadius;
            planet.position.z = Math.sin(angle) * orbitRadius;
            planet.rotation.x = data.tilt;
            planet.userData = {
                name: data.name,
                orbitRadius,
                orbitSpeed: data.speed,
                angle,
                rotationSpeed: 0.01 + Math.random() * 0.01,
            };

            scene.add(planet);
            planets.push(planet);

            // Add rings to Saturn and Uranus
            if (data.hasRings) {
                const ringGeometry = new THREE.RingGeometry(data.size * 1.4, data.size * 2.2, 64);

                const ringMaterial = new THREE.MeshStandardMaterial({
                    color: data.color,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.7,
                    metalness: 0.5,
                    roughness: 0.7,
                });

                const ring = new THREE.Mesh(ringGeometry, ringMaterial);
                ring.rotation.x = Math.PI / 2;
                planet.add(ring);
            }

            // Add moons to some planets
            if (data.hasMoon) {
                const moonSize = data.size * 0.3;
                const moonDistance = data.size * 2.5;
                const moonGeometry = new THREE.SphereGeometry(moonSize, 8, 8);
                const moonMaterial = new THREE.MeshStandardMaterial({
                    color: 0xcccccc,
                    metalness: 0.2,
                    roughness: 0.8,
                });

                const moon = new THREE.Mesh(moonGeometry, moonMaterial);
                const moonAngle = Math.random() * Math.PI * 2;
                moon.position.x = Math.cos(moonAngle) * moonDistance;
                moon.position.z = Math.sin(moonAngle) * moonDistance;
                moon.userData = {
                    orbitSpeed: 0.02 + Math.random() * 0.02,
                    angle: moonAngle,
                    distance: moonDistance,
                };

                scene.add(moon);
                moons.push({ planet, moon });
            }
        });

        // Asteroid belt
        const asteroidBelt = new THREE.Group();
        scene.add(asteroidBelt);

        for (let i = 0; i < 300; i++) {
            const asteroidSize = 0.05 + Math.random() * 0.1;
            const asteroidGeometry = new THREE.SphereGeometry(asteroidSize, 8, 8);
            const asteroidMaterial = new THREE.MeshStandardMaterial({
                color: 0x888888,
                metalness: 0.3,
                roughness: 0.8,
            });

            const asteroid = new THREE.Mesh(asteroidGeometry, asteroidMaterial);

            // Position in a belt between Mars and Jupiter
            const distance = 12 + Math.random() * 1.5;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 0.5;

            asteroid.position.x = Math.cos(angle) * distance;
            asteroid.position.y = height;
            asteroid.position.z = Math.sin(angle) * distance;

            asteroid.userData = {
                orbitSpeed: 0.002 + Math.random() * 0.001,
                angle,
            };

            asteroidBelt.add(asteroid);
        }

        // Stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.1 + Math.random() * 0.1,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true,
        });

        const starsVertices: number[] = [];
        for (let i = 0; i < 3000; i++) {
            const x = (Math.random() - 0.5) * 150;
            const y = (Math.random() - 0.5) * 150;
            const z = (Math.random() - 0.5) * 150;
            starsVertices.push(x, y, z);
        }

        starsGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starsVertices, 3));
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(stars);

        // Distant galaxies
        const galaxyGeometry = new THREE.PlaneGeometry(20, 20);
        const galaxyMaterials = [
            new THREE.MeshBasicMaterial({
                color: 0x8866ff,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshBasicMaterial({
                color: 0xff6688,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide,
            }),
            new THREE.MeshBasicMaterial({
                color: 0x66ffaa,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide,
            }),
        ];

        for (let i = 0; i < 5; i++) {
            const galaxy = new THREE.Mesh(galaxyGeometry, galaxyMaterials[Math.floor(Math.random() * galaxyMaterials.length)]);

            const distance = 70 + Math.random() * 30;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 50;

            galaxy.position.x = Math.cos(angle) * distance;
            galaxy.position.y = height;
            galaxy.position.z = Math.sin(angle) * distance;

            galaxy.rotation.x = Math.random() * Math.PI;
            galaxy.rotation.y = Math.random() * Math.PI;
            galaxy.rotation.z = Math.random() * Math.PI;

            scene.add(galaxy);
        }

        // Shooting stars
        const shootingStars: THREE.Mesh[] = [];

        for (let i = 0; i < 5; i++) {
            const shootingStarGeometry = new THREE.CylinderGeometry(0, 0.1, 1, 8);
            const shootingStarMaterial = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0,
            });

            const shootingStar = new THREE.Mesh(shootingStarGeometry, shootingStarMaterial);
            shootingStar.rotation.x = Math.PI / 2;

            shootingStar.userData = {
                active: false,
                speed: 0.5 + Math.random() * 0.5,
                timeToNext: Math.random() * 10,
            };

            scene.add(shootingStar);
            shootingStars.push(shootingStar);
        }

        // Nebula particles
        const nebulaParticles = new THREE.Group();
        scene.add(nebulaParticles);

        const nebulaColors = [
            0x3677ac, // Blue
            0x5d3fac, // Purple
            0xac3f69, // Pink
            0x3fac9a, // Teal
            0x7a3fac, // Violet
        ];

        for (let i = 0; i < 200; i++) {
            const particleSize = 0.2 + Math.random() * 0.8;
            const particleGeometry = new THREE.SphereGeometry(particleSize, 8, 8);
            const particleMaterial = new THREE.MeshBasicMaterial({
                color: nebulaColors[Math.floor(Math.random() * nebulaColors.length)],
                transparent: true,
                opacity: 0.1 + Math.random() * 0.2,
            });

            const particle = new THREE.Mesh(particleGeometry, particleMaterial);

            // Position in a cloud-like formation
            const distance = 30 + Math.random() * 20;
            const angle = Math.random() * Math.PI * 2;
            const height = (Math.random() - 0.5) * 15;

            particle.position.x = Math.cos(angle) * distance;
            particle.position.y = height;
            particle.position.z = Math.sin(angle) * distance;

            particle.userData = {
                originalPosition: particle.position.clone(),
                movementSpeed: 0.001 + Math.random() * 0.002,
                movementDistance: 0.5 + Math.random() * 0.5,
                movementOffset: Math.random() * Math.PI * 2,
            };

            nebulaParticles.add(particle);
        }

        // Animation
        const clock = new THREE.Clock();
        // const targetPlanet: THREE.Object3D | null = null;

        const animate = () => {
            animationFrameId.current = requestAnimationFrame(animate);

            const elapsedTime = clock.getElapsedTime();

            // Update sun glow
            sunGlowMaterial.uniforms.viewVector.value = new THREE.Vector3().subVectors(camera.position, sunGlow.position);

            // Rotate sun
            sun.rotation.y += 0.002;

            // Move planets in orbit
            planets.forEach((planet) => {
                const { orbitRadius, orbitSpeed, rotationSpeed } = planet.userData;
                planet.userData.angle += orbitSpeed;
                planet.position.x = Math.cos(planet.userData.angle) * orbitRadius;
                planet.position.z = Math.sin(planet.userData.angle) * orbitRadius;
                planet.rotation.y += rotationSpeed;
            });

            // Move moons around planets
            moons.forEach(({ planet, moon }) => {
                const { orbitSpeed, distance } = moon.userData;
                moon.userData.angle += orbitSpeed;

                // Position moon relative to its planet
                moon.position.x = planet.position.x + Math.cos(moon.userData.angle) * distance;
                moon.position.z = planet.position.z + Math.sin(moon.userData.angle) * distance;
                moon.position.y = planet.position.y;
            });

            // Rotate asteroid belt
            asteroidBelt.children.forEach((asteroid) => {
                if (asteroid instanceof THREE.Mesh) {
                    const { orbitSpeed } = asteroid.userData;
                    asteroid.userData.angle += orbitSpeed;

                    const distance = asteroid.position.length();
                    asteroid.position.x = Math.cos(asteroid.userData.angle) * distance;
                    asteroid.position.z = Math.sin(asteroid.userData.angle) * distance;
                }
            });

            // Animate nebula particles
            nebulaParticles.children.forEach((particle) => {
                if (particle instanceof THREE.Mesh) {
                    const { originalPosition, movementSpeed, movementDistance, movementOffset } = particle.userData;

                    // Create a subtle floating motion
                    particle.position.x = originalPosition.x + Math.sin(elapsedTime * movementSpeed + movementOffset) * movementDistance;
                    particle.position.y = originalPosition.y + Math.cos(elapsedTime * movementSpeed + movementOffset) * movementDistance;
                    particle.position.z = originalPosition.z + Math.sin(elapsedTime * movementSpeed * 0.5 + movementOffset) * movementDistance;
                }
            });

            // Animate shooting stars
            shootingStars.forEach((star) => {
                if (star.userData.active) {
                    star.position.addScaledVector(star.userData.direction, star.userData.speed);
                    star.userData.lifetime -= 0.02;

                    if (star.userData.lifetime <= 0) {
                        star.userData.active = false;
                        (star.material as THREE.Material).opacity = 0;
                    }
                } else {
                    star.userData.timeToNext -= 0.01;

                    if (star.userData.timeToNext <= 0) {
                        // Activate shooting star
                        star.userData.active = true;
                        star.userData.lifetime = 1;

                        // Random position far from center
                        const angle = Math.random() * Math.PI * 2;
                        const distance = 40 + Math.random() * 20;
                        const height = (Math.random() - 0.5) * 30;

                        star.position.x = Math.cos(angle) * distance;
                        star.position.y = height;
                        star.position.z = Math.sin(angle) * distance;

                        // Direction toward center but randomized
                        star.userData.direction = new THREE.Vector3(
                            -star.position.x + (Math.random() - 0.5) * 10,
                            -star.position.y + (Math.random() - 0.5) * 10,
                            -star.position.z + (Math.random() - 0.5) * 10,
                        ).normalize();

                        // Align with direction
                        star.lookAt(
                            star.position.x + star.userData.direction.x,
                            star.position.y + star.userData.direction.y,
                            star.position.z + star.userData.direction.z,
                        );

                        (star.material as THREE.MeshBasicMaterial).opacity = 1;
                        star.userData.timeToNext = 5 + Math.random() * 15;
                    }
                }
            });

            controls.update();
            renderer.render(scene, camera);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;

            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };

        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className="w-full h-full absolute inset-0"
            style={{
                background: "radial-gradient(circle at center, #1a0b2e 0%, #090218 50%, #000000 100%)",
            }}
        >
            <div id="planet-info" style={{ position: "absolute", top: "10px", left: "10px", color: "white", zIndex: 100 }}></div>
        </div>
    );
}