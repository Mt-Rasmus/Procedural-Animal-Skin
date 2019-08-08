
var renderer,uniforms,vShader,fShader, elephantFile, camera,scene,controls;
var delta, vertexDisplacement, vD2_x, vD2_y, vD2_z, sphereMesh, elephantMesh, planeMesh, elephantMaterial;

var loader = new THREE.FileLoader();
var loader_gltf = new THREE.GLTFLoader();

// create renderer
renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('myCanvas'), 
    antialias: true});
renderer.setClearColor(0x348a3b);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

// create scene
scene = new THREE.Scene();

// create camera
camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 30, 10000);
camera.position.z = 500;

// add light to scene
var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
// scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set( 5, 15, 5 );
scene.add(pointLight);

// controls to rotate/zoom with mouse input
controls = new THREE.TrackballControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);

var numFilesLeft = 2;
  
// method to keep track of number of external files loaded
function runMoreIfDone() {
   --numFilesLeft;
}

function handle_load(gltf) {
    elephantMesh = gltf.scene.children[0];
//    elephantMesh.material = new THREE.MeshLambertMaterial();
//    elephantMesh.material = material;
    console.log(elephantMesh);
    // scene.add(elephantMesh);
    elephantMesh.position.z = 0;
    elephantMesh.needsUpdate = true;
    elephantMesh.traverse( function(child) {
        if(child instanceof THREE.Mesh) {

        }
    
    });
    console.log('numFilesLeft = ' + numFilesLeft)
    if (numFilesLeft < 1 && elephantMesh) { // all files loaded
        startMain();
        console.log('elephantMeshsssssss');
      }
}

// load shaders
loader.load('fragmentShader.frag',function ( data ) {fShader =  data; runMoreIfDone(); },);
loader.load('vertexShader.vert',function ( data ) {vShader =  data; runMoreIfDone(); },);
loader_gltf.load('lib/elephant.glb', handle_load);
// loader_gltf.load('lib/elephant.glb', handle_load, function ( data ) {elephantFile = data; runMoreIfDone(); }, );

function startMain() {

    uniforms = {
        "color" : {
            type : "c",
            value :new THREE.Color(0x00ff00)
        },
        lightPosition: {type: 'v3', value: new THREE.Vector3(200, 200, 200)},
        "lightPositionn" : {
            type : "c",
            value : pointLight.position
        },
    };

    var sphereMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vShader,
        fragmentShader: fShader,
    });

    elephantMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vShader,
        fragmentShader: fShader,
    });

    // loader = new THREE.GLTFLoader();
    // loader.load('lib/elephant.glb', handle_load);

    elephantMesh.material = elephantMaterial;
    console.log(elephantMesh.material);

    elephantMesh.scale.x *= 100;
    elephantMesh.scale.y *= 100;
    elephantMesh.scale.z *= 100;

    var childGeometry1, childGeometry2, childGeometry3;
    var childIdx = 0;

    elephantMesh.traverse( function(child) {
        if(child instanceof THREE.Mesh) {
            childIdx++;
            if(childIdx == 1)
                childGeometry1 = child.geometry;
            if(childIdx == 2)
                childGeometry2 = child.geometry;
            if(childIdx == 3)
                childGeometry3 = child.geometry;
        }                   
    });

    sphereMaterial.needsUpdate = true;
    elephantMaterial.needsUpdate = true;

    var sphereGeometry = new THREE.SphereBufferGeometry(100, 100, 100);
    sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

    sphereMesh.position.y = 10;
    sphereMesh.position.x = 0;
    sphereMesh.position.z = 0;
    
    pointLight.position.z = sphereMesh.position.z;
    
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;

    scene.add(sphereMesh);
    sphereMesh.castShadow = true;
    sphereMesh.receiveShadow = true;

    var elephantChildMesh1 = new THREE.Mesh(childGeometry1, elephantMaterial);
    var elephantChildMesh2 = new THREE.Mesh(childGeometry2, elephantMaterial);
    var elephantChildMesh3 = new THREE.Mesh(childGeometry3, elephantMaterial);
    var elephantParentMesh = new THREE.Group();
    elephantParentMesh.add(elephantChildMesh1); 
    elephantParentMesh.add(elephantChildMesh2);
    elephantParentMesh.add(elephantChildMesh3);
    // scene.add(elephantParentMesh);
    elephantParentMesh.castShadow = true;
    elephantParentMesh.receiveShadow = true;
  
    elephantParentMesh.scale.x *= 10; elephantParentMesh.scale.y *= 10; elephantParentMesh.scale.z *= 10;
    elephantParentMesh.rotation.x = 90 * Math.PI / 180;
    elephantParentMesh.rotation.z = 90 * Math.PI / 180;
    
    //  elephantMesh1.quaternion.x *= 2; elephantMesh1.scale.y *= 2; elephantMesh1.scale.z *= 2;
    
    // 2. Plane
    var planeGeometry = new THREE.PlaneGeometry(1000,1000,100,100);
    var planeMaterial = new THREE.MeshLambertMaterial();
    planeMesh = new THREE.Mesh(planeGeometry,planeMaterial);
    planeMesh.rotation.x = -90 * Math.PI / 180;
    planeMesh.position.y = -100;
    planeMesh.position.z = 0;
    scene.add(planeMesh);
    
    //attribute
    vertexDisplacement = new Float32Array(sphereGeometry.attributes.position.count);
    vD2_x = new Float32Array(sphereGeometry.attributes.position.count);
    vD2_y = new Float32Array(sphereGeometry.attributes.position.count);
    vD2_z = new Float32Array(sphereGeometry.attributes.position.count);

    sphereGeometry.addAttribute('vertexDisplacement', new THREE.BufferAttribute(vertexDisplacement, 1));
    sphereGeometry.addAttribute('vD2_x', new THREE.BufferAttribute(vD2_x, 1));
    sphereGeometry.addAttribute('vD2_y', new THREE.BufferAttribute(vD2_y, 1));
    sphereGeometry.addAttribute('vD2_z', new THREE.BufferAttribute(vD2_z, 1));
    
    controls.update();
    render();    

}

function render() {

    renderer.render(scene, camera);
    requestAnimationFrame(render);
    controls.update();
}

