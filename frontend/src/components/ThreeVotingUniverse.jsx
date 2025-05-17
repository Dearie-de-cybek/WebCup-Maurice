/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import * as THREE from 'three';

const ThreeVotingUniverse = ({ pages, selectedPlanet, onPlanetSelect, cameraPosition, voteEffect }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const planetsRef = useRef([]);
  const mixerRef = useRef(null);
  const clockRef = useRef(new THREE.Clock());

  // Professional shaders for sophisticated visual effects
  const planetVertexShader = `
    uniform float time;
    uniform float intensity;
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vNoise;
    
    // Improved noise function
    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
      return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r) {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float noise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute( permute( permute(
           i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
         + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
         + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
      
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
      
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                    dot(p2,x2), dot(p3,x3) ) );
    }
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      vec3 pos = position;
      
      // Subtle surface displacement
      float noiseValue = noise(pos * 2.0 + time * 0.1) * 0.02;
      vNoise = noiseValue;
      pos += normal * noiseValue * intensity;
      
      vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
      vWorldPosition = worldPosition.xyz;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `;

  const planetFragmentShader = `
    uniform float time;
    uniform vec3 color;
    uniform float intensity;
    uniform float isSelected;
    uniform float isHallOfFame;
    uniform vec3 lightPosition;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPosition;
    varying float vNoise;
    
    void main() {
      vec3 baseColor = color;
      
      // Professional lighting model
      vec3 lightDir = normalize(lightPosition - vWorldPosition);
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 reflectDir = reflect(-lightDir, vNormal);
      
      // Ambient
      float ambient = 0.3;
      
      // Diffuse
      float diffuse = max(dot(vNormal, lightDir), 0.0);
      
      // Specular with Fresnel
      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);
      vec3 fresnel = vec3(0.04) + (1.0 - 0.04) * pow(1.0 - dot(viewDir, vNormal), 5.0);
      vec3 specular = fresnel * spec;
      
      // Edge lighting for depth
      float rim = 1.0 - dot(vNormal, viewDir);
      rim = smoothstep(0.6, 1.0, rim);
      
      // Sophisticated color mixing
      vec3 finalColor = baseColor * (ambient + diffuse * 0.8);
      finalColor += specular * 0.5;
      finalColor += rim * baseColor * 0.3;
      
      // Surface detail from noise
      finalColor += vNoise * vec3(0.1);
      
      // Hall of Fame subtle gold tint
      if (isHallOfFame > 0.5) {
        vec3 gold = vec3(1.0, 0.8, 0.2);
        float blend = sin(time * 2.0) * 0.1 + 0.1;
        finalColor = mix(finalColor, finalColor * gold, blend);
      }
      
      // Selection highlight - very subtle
      if (isSelected > 0.5) {
        finalColor += rim * vec3(1.0) * 0.2;
      }
      
      // Intensity boost for votes
      finalColor *= (1.0 + intensity * 0.3);
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  // Professional cosmic background shader
  const cosmicVertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const cosmicFragmentShader = `
    uniform float time;
    uniform vec2 resolution;
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // High-quality noise for nebula effects
    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      
      return mix(mix(hash(i + vec2(0.0, 0.0)), 
                     hash(i + vec2(1.0, 0.0)), u.x),
                 mix(hash(i + vec2(0.0, 1.0)), 
                     hash(i + vec2(1.0, 1.0)), u.x), u.y);
    }
    
    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for (int i = 0; i < 6; i++) {
        value += amplitude * noise(frequency * p);
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      return value;
    }
    
    void main() {
      vec2 uv = vUv;
      vec2 p = (uv - 0.5) * 2.0;
      
      // Create sophisticated nebula
      float nebula1 = fbm(p * 2.0 + time * 0.1);
      float nebula2 = fbm(p * 3.0 - time * 0.05);
      float nebula3 = fbm(p * 1.0 + time * 0.02);
      
      // Combine nebula layers
      float combined = nebula1 * 0.5 + nebula2 * 0.3 + nebula3 * 0.2;
      
      // Subtle color palette inspired by space photography
      vec3 color1 = vec3(0.1, 0.1, 0.3);  // Deep space blue
      vec3 color2 = vec3(0.3, 0.1, 0.5);  // Purple nebula
      vec3 color3 = vec3(0.1, 0.2, 0.4);  // Cosmic blue
      
      vec3 finalColor = mix(color1, color2, combined);
      finalColor = mix(finalColor, color3, fbm(p * 0.5));
      
      // Add depth based on distance from center
      float vignette = 1.0 - length(p) * 0.5;
      finalColor *= vignette;
      
      // Very subtle brightness
      finalColor *= 0.7;
      
      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  useEffect(() => {
    initScene();
    animate();
    
    const handleResize = () => {
      if (rendererRef.current && cameraRef.current) {
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(width, height);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    updateCameraPosition();
  }, [cameraPosition]);

  useEffect(() => {
    if (voteEffect && planetsRef.current) {
      triggerVoteEffect(voteEffect);
    }
  }, [voteEffect]);

  const initScene = () => {
    // Scene setup with professional settings
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    
    mountRef.current.appendChild(renderer.domElement);

    // Professional lighting setup
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    scene.add(directionalLight);

    // Add subtle rim lighting
    const rimLight = new THREE.DirectionalLight(0x88bbff, 0.5);
    rimLight.position.set(-10, 0, -10);
    scene.add(rimLight);

    // Create sophisticated cosmic background
    createCosmicBackground(scene);

    // Create professional planets
    createPlanets(scene);

    // Create subtle star field
    createStarField(scene);

    // Store references
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // Set initial camera position
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);

    // Add interaction handlers
    setupInteractions(renderer, camera, scene);
  };

  const createCosmicBackground = (scene) => {
    const geometry = new THREE.PlaneGeometry(200, 200);
    const material = new THREE.ShaderMaterial({
      vertexShader: cosmicVertexShader,
      fragmentShader: cosmicFragmentShader,
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
      },
      side: THREE.DoubleSide
    });

    const cosmic = new THREE.Mesh(geometry, material);
    cosmic.position.z = -100;
    scene.add(cosmic);
  };

  const createPlanets = (scene) => {
    planetsRef.current = pages.map((page, index) => {
      // High-quality geometry
      const geometry = new THREE.IcosahedronGeometry(page.size || 1, 3);
      
      // Professional material with custom shaders
      const material = new THREE.ShaderMaterial({
        vertexShader: planetVertexShader,
        fragmentShader: planetFragmentShader,
        uniforms: {
          time: { value: 0 },
          color: { value: new THREE.Color(page.color) },
          intensity: { value: page.votes / 2000 },
          isSelected: { value: 0 },
          isHallOfFame: { value: page.isHallOfFame ? 1 : 0 },
          lightPosition: { value: new THREE.Vector3(10, 10, 5) }
        }
      });

      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(
        page.position?.x || (index - 2) * 6,
        page.position?.y || 0,
        page.position?.z || 0
      );
      planet.castShadow = true;
      planet.receiveShadow = true;
      planet.userData = { pageIndex: index, page };

      // Add subtle orbital ring for hall of fame
      if (page.isHallOfFame) {
        const ringGeometry = new THREE.RingGeometry(page.size * 1.8, page.size * 2.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: 0xffd700,
          transparent: true,
          opacity: 0.15,
          side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2 + (Math.random() - 0.5) * 0.5;
        ring.rotation.z = (Math.random() - 0.5) * 0.5;
        planet.add(ring);
      }

      scene.add(planet);
      return planet;
    });
  };

  const createStarField = (scene) => {
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 5000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      // Position stars in sphere around scene
      const radius = 500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      // Subtle stellar colors
      const temp = Math.random();
      const color = new THREE.Color();
      if (temp < 0.4) {
        color.setHSL(0.6, 0.2, 0.8); // Blue-white stars
      } else if (temp < 0.8) {
        color.setHSL(0.1, 0.1, 0.9); // White stars
      } else {
        color.setHSL(0.08, 0.3, 0.7); // Yellow stars
      }

      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
  };

  const setupInteractions = (renderer, camera, scene) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetsRef.current);

      if (intersects.length > 0) {
        const planet = intersects[0].object;
        const pageData = planet.userData.page;
        onPlanetSelect(pageData);
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);
    
    // Add hover effects
    const onMouseMove = (event) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(planetsRef.current);

      // Reset all planets
      planetsRef.current.forEach(planet => {
        if (planet.material.uniforms) {
          planet.material.uniforms.intensity.value = planet.userData.page.votes / 2000;
        }
      });

      // Highlight hovered planet
      if (intersects.length > 0) {
        const planet = intersects[0].object;
        if (planet.material.uniforms) {
          planet.material.uniforms.intensity.value = (planet.userData.page.votes / 2000) + 0.5;
        }
        renderer.domElement.style.cursor = 'pointer';
      } else {
        renderer.domElement.style.cursor = 'default';
      }
    };

    renderer.domElement.addEventListener('mousemove', onMouseMove);
  };

  const updateCameraPosition = () => {
    if (cameraRef.current && cameraPosition) {
      const camera = cameraRef.current;
      const targetPosition = new THREE.Vector3(
        cameraPosition.x || 0,
        cameraPosition.y || 5,
        cameraPosition.z || 20
      );

      // Smooth camera transition
      const animateCamera = () => {
        camera.position.lerp(targetPosition, 0.02);
        camera.lookAt(0, 0, 0);

        if (camera.position.distanceTo(targetPosition) > 0.1) {
          requestAnimationFrame(animateCamera);
        }
      };
      animateCamera();
    }
  };

  const triggerVoteEffect = (pageId) => {
    const planet = planetsRef.current.find(p => p.userData.page.id === pageId);
    if (planet && planet.material.uniforms) {
      // Subtle vote effect
      planet.material.uniforms.intensity.value += 1;
      
      // Animate back to normal
      const animate = () => {
        planet.material.uniforms.intensity.value *= 0.98;
        if (planet.material.uniforms.intensity.value > planet.userData.page.votes / 2000 + 0.1) {
          requestAnimationFrame(animate);
        }
      };
      setTimeout(animate, 100);
    }
  };

  const animate = () => {
    const clock = clockRef.current;
    const elapsedTime = clock.getElapsedTime();

    // Update shader uniforms
    if (sceneRef.current) {
      sceneRef.current.traverse((child) => {
        if (child.material && child.material.uniforms) {
          if (child.material.uniforms.time) {
            child.material.uniforms.time.value = elapsedTime;
          }
        }
      });
    }

    // Subtle planetary rotations
    planetsRef.current.forEach((planet, index) => {
      if (planet) {
        planet.rotation.y += 0.002 + (index * 0.0005);
        
        // Update selection state
        if (planet.material.uniforms) {
          const isSelected = selectedPlanet && selectedPlanet.id === planet.userData.page.id;
          planet.material.uniforms.isSelected.value = isSelected ? 1 : 0;
        }
      }
    });

    // Render
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }

    requestAnimationFrame(animate);
  };

  return (
    <div className="absolute inset-0">
      <div ref={mountRef} className="w-full h-full" />
      
      {/* Professional loading indicator */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <div className="text-white/20 text-lg font-light">
          Rendering Universe...
        </div>
      </motion.div>
    </div>
  );
};

export default ThreeVotingUniverse;