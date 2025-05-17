/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const ThreeVotingUniverse = ({ pages, selectedPlanet, onPlanetSelect, cameraPosition, voteEffect }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const planetsRef = useRef([]);
  const particleSystemsRef = useRef([]);
  const composerRef = useRef(null);

  // Custom shaders for mind-bending effects
  const planetVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;
    uniform float voteIntensity;
    
    void main() {
      vUv = uv;
      vNormal = normal;
      vPosition = position;
      
      vec3 pos = position;
      
      // Pulsating effect based on votes
      float pulse = sin(time * 2.0 + voteIntensity * 5.0) * 0.1 * voteIntensity;
      pos += normal * pulse;
      
      // Morphing effect
      float morph = sin(time + position.x * 2.0) * 0.05;
      pos.y += morph;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const planetFragmentShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform float time;
    uniform vec3 color;
    uniform float voteIntensity;
    uniform float isSelected;
    uniform float isHallOfFame;
    
    // Noise function
    float noise(vec3 p) {
      return sin(p.x * 10.0) * cos(p.y * 10.0) * sin(p.z * 10.0);
    }
    
    void main() {
      vec3 baseColor = color;
      
      // Animated surface patterns
      float pattern = noise(vPosition + time * 0.5) * 0.3;
      baseColor += pattern;
      
      // Hall of fame golden glow
      if (isHallOfFame > 0.5) {
        vec3 goldGlow = vec3(1.0, 0.8, 0.2);
        float intensity = sin(time * 3.0) * 0.5 + 0.5;
        baseColor = mix(baseColor, goldGlow, intensity * 0.4);
      }
      
      // Selection highlight
      if (isSelected > 0.5) {
        vec3 highlight = vec3(1.0, 1.0, 1.0);
        float rim = 1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0));
        baseColor = mix(baseColor, highlight, rim * 0.8);
      }
      
      // Vote intensity glow
      baseColor += voteIntensity * vec3(1.0, 0.5, 0.2) * 0.5;
      
      // Fresnel effect
      float fresnel = pow(1.0 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
      baseColor += fresnel * vec3(0.3, 0.5, 1.0) * 0.3;
      
      gl_FragColor = vec4(baseColor, 1.0);
    }
  `;

  // Particle shader for cosmic dust
  const particleVertexShader = `
    attribute float size;
    attribute vec3 color;
    attribute float opacity;
    varying vec3 vColor;
    varying float vOpacity;
    uniform float time;
    
    void main() {
      vColor = color;
      vOpacity = opacity;
      
      vec3 pos = position;
      pos.x += sin(time + position.y * 2.0) * 0.5;
      pos.y += cos(time + position.x * 2.0) * 0.5;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size;
    }
  `;

  const particleFragmentShader = `
    varying vec3 vColor;
    varying float vOpacity;
    
    void main() {
      float dist = distance(gl_PointCoord, vec2(0.5));
      if (dist > 0.5) discard;
      
      float alpha = (1.0 - dist * 2.0) * vOpacity;
      gl_FragColor = vec4(vColor, alpha);
    }
  `;

  useEffect(() => {
    initThreeScene();
    animate();
    
    return () => {
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    // Update camera position smoothly
    if (cameraRef.current) {
      const camera = cameraRef.current;
      const targetPos = new THREE.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z);
      
      const animateCamera = () => {
        camera.position.lerp(targetPos, 0.05);
        camera.lookAt(0, 0, 0);
        
        if (camera.position.distanceTo(targetPos) > 0.1) {
          requestAnimationFrame(animateCamera);
        }
      };
      animateCamera();
    }
  }, [cameraPosition]);

  useEffect(() => {
    // Trigger vote effect animations
    if (voteEffect && planetsRef.current[voteEffect - 1]) {
      const planet = planetsRef.current[voteEffect - 1];
      if (planet.material.uniforms) {
        planet.material.uniforms.voteIntensity.value = 2.0;
        
        // Animate back to normal
        const animate = () => {
          planet.material.uniforms.voteIntensity.value *= 0.95;
          if (planet.material.uniforms.voteIntensity.value > 0.1) {
            requestAnimationFrame(animate);
          }
        };
        setTimeout(animate, 100);
      }
    }
  }, [voteEffect]);

  const initThreeScene = () => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    mountRef.current.appendChild(renderer.domElement);

    // Camera position
    camera.position.set(0, 5, 15);
    camera.lookAt(0, 0, 0);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Create cosmic background
    createCosmicBackground(scene);

    // Create planets for each page
    pages.forEach((page, index) => {
      const planet = createPlanet(page, scene);
      planetsRef.current[index] = planet;
      scene.add(planet);
    });

    // Create particle systems
    createParticleSystems(scene);

    // Add space nebula
    createSpaceNebula(scene);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Add click handlers
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetsRef.current);

      if (intersects.length > 0) {
        const clickedPlanet = intersects[0].object;
        const pageIndex = planetsRef.current.indexOf(clickedPlanet);
        if (pageIndex !== -1) {
          onPlanetSelect(pages[pageIndex]);
        }
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Handle resize
    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', onResize);
  };

  const createPlanet = (page, scene) => {
    // Create complex geometry with subdivisions
    const geometry = new THREE.IcosahedronGeometry(page.size, 2);
    
    // Create custom material with shaders
    const material = new THREE.ShaderMaterial({
      vertexShader: planetVertexShader,
      fragmentShader: planetFragmentShader,
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(page.color) },
        voteIntensity: { value: page.votes / 1000 },
        isSelected: { value: 0 },
        isHallOfFame: { value: page.isHallOfFame ? 1 : 0 }
      },
      transparent: true
    });

    const planet = new THREE.Mesh(geometry, material);
    planet.position.set(page.position.x, page.position.y, page.position.z);
    planet.castShadow = true;
    planet.receiveShadow = true;

    // Add planetary rings for hall of fame
    if (page.isHallOfFame) {
      const ringGeometry = new THREE.RingGeometry(page.size * 1.5, page.size * 2, 32);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: 0xffd700,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.rotation.x = Math.PI / 2;
      planet.add(ring);
    }

    // Add orbital particles
    createOrbitParticles(planet, page);

    return planet;
  };

  const createOrbitParticles = (planet, page) => {
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const radius = page.size + 0.5 + Math.random() * 1;
      
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      const color = new THREE.Color(page.color);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 1;
    }

    const orbitalGeometry = new THREE.BufferGeometry();
    orbitalGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    orbitalGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    orbitalGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const orbitalMaterial = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      depthWrite: false
    });

    const orbitalParticles = new THREE.Points(orbitalGeometry, orbitalMaterial);
    planet.add(orbitalParticles);
  };

  const createCosmicBackground = (scene) => {
    // Create starfield
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 10000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 2000;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2000;

      const color = new THREE.Color();
      color.setHSL(Math.random() * 0.2 + 0.5, 0.55, Math.random() * 0.25 + 0.55);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 2,
      vertexColors: true,
      transparent: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
  };

  const createParticleSystems = (scene) => {
    // Create cosmic dust clouds
    for (let i = 0; i < 5; i++) {
      const dustGeometry = new THREE.BufferGeometry();
      const dustCount = 1000;
      const positions = new Float32Array(dustCount * 3);
      const colors = new Float32Array(dustCount * 3);
      const sizes = new Float32Array(dustCount);
      const opacities = new Float32Array(dustCount);

      for (let j = 0; j < dustCount; j++) {
        positions[j * 3] = (Math.random() - 0.5) * 100;
        positions[j * 3 + 1] = (Math.random() - 0.5) * 100;
        positions[j * 3 + 2] = (Math.random() - 0.5) * 100;

        const color = new THREE.Color();
        color.setHSL(0.15 + Math.random() * 0.1, 0.8, 0.5);
        colors[j * 3] = color.r;
        colors[j * 3 + 1] = color.g;
        colors[j * 3 + 2] = color.b;

        sizes[j] = Math.random() * 5 + 1;
        opacities[j] = Math.random() * 0.5 + 0.2;
      }

      dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      dustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      dustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      dustGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacities, 1));

      const dustMaterial = new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        uniforms: {
          time: { value: 0 }
        },
        transparent: true,
        depthWrite: false
      });

      const dust = new THREE.Points(dustGeometry, dustMaterial);
      scene.add(dust);
      particleSystemsRef.current.push(dust);
    }
  };

  const createSpaceNebula = (scene) => {
    // Create volumetric nebula effect
    const nebulaGeometry = new THREE.PlaneGeometry(200, 200, 32, 32);
    
    const nebulaMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform float time;
        
        float noise(vec2 p) {
          return sin(p.x * 6.0) * cos(p.y * 6.0) * sin(time * 0.1);
        }
        
        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);
          
          float nebula = noise(vUv * 5.0 + time * 0.1) * 0.5 + 0.5;
          nebula *= (1.0 - smoothstep(0.0, 0.5, dist));
          
          vec3 color1 = vec3(0.8, 0.2, 1.0);
          vec3 color2 = vec3(0.2, 0.8, 1.0);
          vec3 color = mix(color1, color2, nebula);
          
          gl_FragColor = vec4(color, nebula * 0.3);
        }
      `,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      side: THREE.DoubleSide
    });

    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.z = -50;
    scene.add(nebula);
  };

  const animate = () => {
    const time = Date.now() * 0.001;

    // Update planet rotations and shader uniforms
    planetsRef.current.forEach((planet, index) => {
      if (planet && planet.material.uniforms) {
        planet.rotation.y += 0.01;
        planet.material.uniforms.time.value = time;
        
        // Update selection state
        const isSelected = selectedPlanet && selectedPlanet.id === pages[index].id;
        planet.material.uniforms.isSelected.value = isSelected ? 1 : 0;
      }
    });

    // Update particle systems
    particleSystemsRef.current.forEach(system => {
      if (system.material.uniforms) {
        system.material.uniforms.time.value = time;
      }
      system.rotation.y += 0.002;
    });

    // Render the scene
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    requestAnimationFrame(animate);
  };

  return <div ref={mountRef} className="absolute inset-0" />;
};

export default ThreeVotingUniverse;