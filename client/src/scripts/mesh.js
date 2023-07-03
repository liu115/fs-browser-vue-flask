import { MeshBasicMaterial, Mesh, FrontSide } from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader.js';


async function loadPLYMesh(url) {
    const loader = new PLYLoader()
    const geometry = await loader.loadAsync(
        url,
        (xhr) => {
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
        }
    )
    geometry.computeVertexNormals()
    const material = new MeshBasicMaterial({ vertexColors:true, side: FrontSide });
    const plyMesh = new Mesh(geometry, material)
    return plyMesh;
}

export { loadPLYMesh };