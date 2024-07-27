const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(400, 400);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setClearColor(0x000000, 0);
document.body.appendChild(renderer.domElement);

const rgbeLoader = new THREE.RGBELoader();
rgbeLoader.setDataType(THREE.UnsignedByteType);
rgbeLoader.load('https://tarowo.lol/assets/venice_sunset_1k.hdr', function (texture) {
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envMap = pmremGenerator.fromEquirectangular(texture).texture;
    pmremGenerator.dispose();

    const outerRadius = 1;
    const innerRadius = 0.15;
    const cdThickness = 0.001;
    const segments = 64;

    const cdShape = new THREE.Shape();
    cdShape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false);
    const holeShape = new THREE.Path();
    holeShape.absarc(0, 0, innerRadius, 0, Math.PI * 2, true);
    cdShape.holes.push(holeShape);

    const cdGeometry = new THREE.ExtrudeGeometry(cdShape, {
        depth: cdThickness,
        bevelEnabled: false,
        curveSegments: segments
    });

    cdGeometry.scale(2, 2, 2);

    const cdMaterial = new THREE.MeshStandardMaterial({
        metalness: 1.0,
        roughness: 0.2,
        envMap: envMap,
        envMapIntensity: 1.0,
        side: THREE.DoubleSide,
        transparent: false
    });

    const cdMesh = new THREE.Mesh(cdGeometry, cdMaterial);
    cdMesh.rotation.x = Math.PI / 2;
    scene.add(cdMesh);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.set(0, 4, 0);
    camera.lookAt(0, 0, 0);
    camera.aspect = 1;
    camera.updateProjectionMatrix();

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableRotate = true;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.rotateSpeed = 0.2;
    controls.maxPolarAngle = Math.PI / 2;

    function animate() {
        requestAnimationFrame(animate);
        cdMesh.rotation.y += 0.02;
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        renderer.setSize(400, 400);
        renderer.setPixelRatio(window.devicePixelRatio);
        camera.aspect = 1;
        camera.updateProjectionMatrix();
    });
});
