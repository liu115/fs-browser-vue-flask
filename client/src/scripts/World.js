import { AxesHelper, Matrix4, Group } from 'three';
import Stats from 'three/examples/jsm/libs/stats.module'
import { GUI } from 'three/examples/jsm/libs/dat.gui.module'

import { createCamera } from './camera';
import { createScene } from './scene';
import { createRenderer } from './renderer';
import { Resizer } from './Resizer';
import { loadPLYMesh } from './mesh';
import { createControls } from './controls';
import { createFrustum } from './frustum';

let camera;
let renderer;
let scene;
let controls;
// let gui;

class World {
    constructor(container) {
        camera = createCamera();
        scene = createScene();
        renderer = createRenderer();
        container.append(renderer.domElement);

        controls = createControls(camera, renderer.domElement);
        controls.addEventListener('change', () => {
            this.render()
        });

        const axesHelper = new AxesHelper(2);
        scene.add(axesHelper);

        this.resizer = new Resizer(container, camera, renderer);
        // function onWindowResize() {
        //     resizer.resize();
        //     this.render()
        // }
        // window.addEventListener('resize', onWindowResize, false)

        this.stats = new Stats()
        container.appendChild(this.stats.dom)

        // this.gui = new GUI()
        // const cameraFolder = this.gui.addFolder('Camera')
        // cameraFolder.add(camera.position, 'z', 0, 10)
        // cameraFolder.open()

        this.train_poses = new Group();
        this.test_poses = new Group();
        scene.add(this.train_poses);
        scene.add(this.test_poses);
    }

    async init(scene_id) {
        const mesh = await loadPLYMesh(`/api/get/mesh/${scene_id}_001.ply`)
        scene.add(mesh);
        controls.target.copy(mesh.position);
    }

    render() {
        renderer.render(scene, camera);
        this.stats.update()
        // this.gui.updateDisplay()
    }

    start() {
        renderer.setAnimationLoop(() => {
            // render a frame
            // renderer.render(scene, camera);
            this.render()
        });
    }

    stop() {
        renderer.setAnimationLoop(null);
    }

    creataFrustum(mat, color) {
        const frustum = createFrustum(null, 150, 100, 0.2, 0.1, color)
        const m = new Matrix4()
        m.set(...mat)
        frustum.applyMatrix4(m.invert())
        frustum.updateMatrix()
        // scene.add(frustum);
        return frustum
    }

    addTrainPose(mat) {
        const frustum = this.creataFrustum(mat, 0x0000ff)
        this.train_poses.add(frustum);
    }

    addTestPose(mat) {
        const frustum = this.creataFrustum(mat, 0xff0000)
        this.test_poses.add(frustum);
    }

    removeTrainPose() {
        this.train_poses.clear()
    }

    removeTestPose() {
        this.test_poses.clear()
    }

    // animate() {
    //     requestAnimationFrame(animate)
    // //     this.render()
    //     this.stats.update()
    // }
}

export { World };