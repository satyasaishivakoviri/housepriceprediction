/**
 * Grid Distortion Effect
 * Adapted from ReactBits GridDistortion component for vanilla JS.
 * Uses Three.js WebGL shaders to create an interactive image distortion on mouse movement.
 *
 * Usage:
 *   initGridDistortion(containerElement, {
 *     imageSrc: 'https://example.com/image.jpg',
 *     grid: 15,
 *     mouse: 0.1,
 *     strength: 0.15,
 *     relaxation: 0.9
 *   });
 */

import * as THREE from 'three';

const vertexShader = `
uniform float time;
varying vec2 vUv;
varying vec3 vPosition;

void main() {
  vUv = uv;
  vPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D uDataTexture;
uniform sampler2D uTexture;
uniform vec4 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec4 offset = texture2D(uDataTexture, vUv);
  gl_FragColor = texture2D(uTexture, uv - 0.02 * offset.rg);
}
`;

/**
 * Initialize Grid Distortion on a container element.
 * @param {HTMLElement} container - The DOM element to render into.
 * @param {Object} options - Configuration options.
 * @param {string} options.imageSrc - URL of the image to distort.
 * @param {number} [options.grid=15] - Grid resolution (higher = finer distortion).
 * @param {number} [options.mouse=0.1] - Mouse influence radius.
 * @param {number} [options.strength=0.15] - Distortion strength.
 * @param {number} [options.relaxation=0.9] - How quickly distortion relaxes (0-1).
 * @returns {Function} cleanup - Call this to destroy the effect and free resources.
 */
export function initGridDistortion(container, options = {}) {
    const {
        imageSrc,
        grid = 15,
        mouse = 0.1,
        strength = 0.15,
        relaxation = 0.9
    } = options;

    if (!container || !imageSrc) {
        console.error('GridDistortion: container and imageSrc are required.');
        return () => { };
    }

    // --- Three.js Setup ---
    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Style the canvas to fill the container
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';

    const camera = new THREE.OrthographicCamera(0, 0, 0, 0, -1000, 1000);
    camera.position.z = 2;

    // --- Uniforms ---
    const uniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector4() },
        uTexture: { value: null },
        uDataTexture: { value: null }
    };

    // --- Load Image Texture ---
    const textureLoader = new THREE.TextureLoader();
    textureLoader.crossOrigin = 'anonymous';
    textureLoader.load(imageSrc, (texture) => {
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        uniforms.uTexture.value = texture;
        handleResize();
    });

    // --- Data Texture (distortion map) ---
    const size = grid;
    const data = new Float32Array(4 * size * size);
    for (let i = 0; i < size * size; i++) {
        data[i * 4] = Math.random() * 255 - 125;
        data[i * 4 + 1] = Math.random() * 255 - 125;
    }

    const dataTexture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat, THREE.FloatType);
    dataTexture.needsUpdate = true;
    uniforms.uDataTexture.value = dataTexture;

    // --- Shader Material ---
    const material = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true
    });

    // --- Plane Geometry ---
    const geometry = new THREE.PlaneGeometry(1, 1, size - 1, size - 1);
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    // --- Resize Handler ---
    function handleResize() {
        const rect = container.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        if (width === 0 || height === 0) return;

        const containerAspect = width / height;

        renderer.setSize(width, height);
        plane.scale.set(containerAspect, 1, 1);

        const frustumHeight = 1;
        const frustumWidth = frustumHeight * containerAspect;
        camera.left = -frustumWidth / 2;
        camera.right = frustumWidth / 2;
        camera.top = frustumHeight / 2;
        camera.bottom = -frustumHeight / 2;
        camera.updateProjectionMatrix();

        uniforms.resolution.value.set(width, height, 1, 1);
    }

    let resizeObserver = null;
    if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(container);
    } else {
        window.addEventListener('resize', handleResize);
    }

    // --- Mouse Tracking ---
    const mouseState = {
        x: 0, y: 0,
        prevX: 0, prevY: 0,
        vX: 0, vY: 0
    };

    function handleMouseMove(e) {
        const rect = container.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;
        mouseState.vX = x - mouseState.prevX;
        mouseState.vY = y - mouseState.prevY;
        Object.assign(mouseState, { x, y, prevX: x, prevY: y });
    }

    function handleTouchMove(e) {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            const rect = container.getBoundingClientRect();
            const x = (touch.clientX - rect.left) / rect.width;
            const y = 1 - (touch.clientY - rect.top) / rect.height;
            mouseState.vX = x - mouseState.prevX;
            mouseState.vY = y - mouseState.prevY;
            Object.assign(mouseState, { x, y, prevX: x, prevY: y });
        }
    }

    function handleMouseLeave() {
        dataTexture.needsUpdate = true;
        Object.assign(mouseState, {
            x: 0, y: 0,
            prevX: 0, prevY: 0,
            vX: 0, vY: 0
        });
    }

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);

    handleResize();

    // --- Animation Loop ---
    let animationId = null;

    function animate() {
        animationId = requestAnimationFrame(animate);

        uniforms.time.value += 0.05;

        const texData = dataTexture.image.data;
        for (let i = 0; i < size * size; i++) {
            texData[i * 4] *= relaxation;
            texData[i * 4 + 1] *= relaxation;
        }

        const gridMouseX = size * mouseState.x;
        const gridMouseY = size * mouseState.y;
        const maxDist = size * mouse;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const distSq = Math.pow(gridMouseX - i, 2) + Math.pow(gridMouseY - j, 2);
                if (distSq < maxDist * maxDist) {
                    const index = 4 * (i + size * j);
                    const power = Math.min(maxDist / Math.sqrt(distSq), 10);
                    texData[index] += strength * 100 * mouseState.vX * power;
                    texData[index + 1] -= strength * 100 * mouseState.vY * power;
                }
            }
        }

        dataTexture.needsUpdate = true;
        renderer.render(scene, camera);
    }

    animate();

    // --- Cleanup Function ---
    return function cleanup() {
        if (animationId) cancelAnimationFrame(animationId);

        if (resizeObserver) {
            resizeObserver.disconnect();
        } else {
            window.removeEventListener('resize', handleResize);
        }

        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('mouseleave', handleMouseLeave);

        renderer.dispose();
        if (container.contains(renderer.domElement)) {
            container.removeChild(renderer.domElement);
        }

        geometry.dispose();
        material.dispose();
        dataTexture.dispose();
        if (uniforms.uTexture.value) uniforms.uTexture.value.dispose();
    };
}
