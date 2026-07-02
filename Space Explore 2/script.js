const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.3,   // 👈 smaller = realistic
  sizeAttenuation: true
});
const nebulaGeometry = new THREE.SphereGeometry(80, 64, 64);

const nebulaMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 0.0 }
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    varying vec2 vUv;

    void main() {
      float noise = sin(vUv.x * 6.0 + time) * 0.5 +
                    cos(vUv.y * 6.0 + time) * 0.5;

      vec3 color = vec3(0.2, 0.0, 0.6) + noise * 0.4;

      gl_FragColor = vec4(color, 0.15);
    }
  `,
  side: THREE.BackSide,
  transparent: true
});

const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
scene.add(nebula);
const atmosphereMaterial = new THREE.ShaderMaterial({
  vertexShader: `
    varying vec3 vNormal;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    void main() {
      float intensity = pow(0.7 - dot(vNormal, vec3(0,0,1.0)), 2.0);
      gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
    }
  `,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide,
  transparent: true
});

const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(2.3, 64, 64),
  atmosphereMaterial
);

planet.add(atmosphere);
nebulaMaterial.uniforms.time.value += 0.01;
renderer.setPixelRatio(window.devicePixelRatio);
loader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg")
const texture = loader.load(
  "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
  () => console.log("Loaded"),
  undefined,
  () => console.error("Texture failed")
);
renderer.setPixelRatio(window.devicePixelRatio);