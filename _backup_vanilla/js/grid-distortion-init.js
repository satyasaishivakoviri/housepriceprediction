/**
 * Grid Distortion Effect - Initializer
 * Loads Three.js via npm/Vite and applies the effect to #grid-distortion-hero.
 */
import * as THREE from 'three';

console.log('[GridDistortion] Module loaded. THREE version:', THREE.REVISION);

const container = document.getElementById('grid-distortion-hero');
const fallbackImg = document.getElementById('grid-distortion-fallback');

if (!container) {
    console.warn('[GridDistortion] #grid-distortion-hero not found.');
} else {
    initEffect();
}

function initEffect() {
    const gridSize = 15;
    const mouseRadius = 0.15;
    const strength = 0.2;
    const relaxation = 0.9;

    const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

    const fragmentShader = `
    uniform sampler2D uDataTexture;
    uniform sampler2D uTexture;
    varying vec2 vUv;
    void main() {
      vec2 uv = vUv;
      vec4 offset = texture2D(uDataTexture, vUv);
      gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
    }
  `;

    // Scene
    const scene = new THREE.Scene();
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
        console.error('[GridDistortion] WebGL not available:', e);
        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1000, 1000);
    camera.position.z = 2;

    // Uniforms
    const uniforms = {
        uTexture: { value: null },
        uDataTexture: { value: null }
    };

    // Create texture from fallback <img> (avoids CORS)
    function createTextureFromImg() {
        if (!fallbackImg) {
            console.warn('[GridDistortion] No fallback img found, loading from URL...');
            const loader = new THREE.TextureLoader();
            loader.load(
                'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2600&auto=format&fit=crop',
                (tex) => {
                    tex.minFilter = THREE.LinearFilter;
                    tex.magFilter = THREE.LinearFilter;
                    uniforms.uTexture.value = tex;
                    handleResize();
                    console.log('[GridDistortion] ✅ Texture loaded from URL.');
                },
                undefined,
                (err) => console.error('[GridDistortion] Texture load error:', err)
            );
            return;
        }

        function apply() {
            const texture = new THREE.Texture(fallbackImg);
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.needsUpdate = true;
            uniforms.uTexture.value = texture;
            handleResize();
            console.log('[GridDistortion] ✅ Texture created from <img> element.');
        }

        if (fallbackImg.complete && fallbackImg.naturalWidth > 0) {
            apply();
        } else {
            fallbackImg.onload = apply;
        }
    }

    // NOTE: createTextureFromImg() is called AFTER plane is created (below)

    // Data texture (distortion map)
    const size = gridSize;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
        data[i * 4] = Math.random() * 255 - 125;
        data[i * 4 + 1] = Math.random() * 255 - 125;
    }
    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    // Shader material
    const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true
    });

    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // Now that plane exists, we can safely call handleResize inside texture init
    createTextureFromImg();

    // Resize handler
    function handleResize() {
        const rect = container.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;
        const aspect = rect.width / rect.height;
        renderer.setSize(rect.width, rect.height);
        plane.scale.set(aspect, 1, 1);
        camera.left = -aspect / 2;
        camera.right = aspect / 2;
        camera.top = 0.5;
        camera.bottom = -0.5;
        camera.updateProjectionMatrix();
    }

    if (window.ResizeObserver) {
        new ResizeObserver(handleResize).observe(container);
    } else {
        window.addEventListener('resize', handleResize);
    }

    // Mouse state
    const mouse = { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 };

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        mouse.vX = x - mouse.prevX;
        mouse.vY = y - mouse.prevY;
        mouse.x = x; mouse.y = y;
        mouse.prevX = x; mouse.prevY = y;
    });

    container.addEventListener('mouseleave', () => {
        Object.assign(mouse, { x: 0, y: 0, prevX: 0, prevY: 0, vX: 0, vY: 0 });
    });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length > 0) {
            const t = e.touches[0];
            const rect = container.getBoundingClientRect();
            const x = (t.clientX - rect.left) / rect.width;
            const y = 1 - (t.clientY - rect.top) / rect.height;
            mouse.vX = x - mouse.prevX;
            mouse.vY = y - mouse.prevY;
            mouse.x = x; mouse.y = y;
            mouse.prevX = x; mouse.prevY = y;
        }
    }, { passive: true });

    handleResize();

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        const texData = dataTexture.image.data;
        for (let i = 0; i < size * size; i++) {
            texData[i * 4] *= relaxation;
            texData[i * 4 + 1] *= relaxation;
        }

        const gx = size * mouse.x;
        const gy = size * mouse.y;
        const maxDist = size * mouseRadius;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const distSq = (gx - i) ** 2 + (gy - j) ** 2;
                if (distSq < maxDist * maxDist) {
                    const idx = 4 * (i + size * j);
                    const power = Math.min(maxDist / Math.sqrt(distSq), 10);
                    texData[idx] += strength * 100 * mouse.vX * power;
                    texData[idx + 1] -= strength * 100 * mouse.vY * power;
                }
            }
        }

        dataTexture.needsUpdate = true;
        renderer.render(scene, camera);
    }

    animate();
    console.log('[GridDistortion] ✅ Animation loop started.');
}
