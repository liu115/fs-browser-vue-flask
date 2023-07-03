class Resizer {
    constructor(container, camera, renderer) {
        // Set the camera's aspect ratio
        this.camera = camera;
        this.renderer = renderer;
        this.container = container;
        this.resize();
    }

    resize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight;

        // update the camera's frustum
        this.camera.updateProjectionMatrix();

        // update the size of the renderer AND the canvas
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

        // set the pixel ratio (for mobile devices)
        // this.renderer.setPixelRatio(window.devicePixelRatio);
    }
}

export { Resizer };
