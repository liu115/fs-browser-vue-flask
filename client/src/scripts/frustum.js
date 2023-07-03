import {
    BufferGeometry,
    LineBasicMaterial,
    LineSegments,
    Float32BufferAttribute,
} from 'three';

function createFrustum(pose, width, height, scale, depth, color) {
    let w = scale * width / height / 2;
    let h = scale / 2;
    const points_origin = [
        [0, 0, 0],
        [-w, -h, depth],
        [w, -h, depth],
        [-w, h, depth],
        [w, h, depth],
    ]

    const points = []
    for (let i = 0; i < points_origin.length; i++) {
        points.push(points_origin[i][0], points_origin[i][1], points_origin[i][2])
    }
    let indices = [
        [0, 1],
        [0, 2],
        [0, 3],
        [0, 4],
        [1, 2],
        [2, 4],
        [3, 4],
        [1, 3]
    ]
    indices = [].concat.apply([], indices)
    const geometry = new BufferGeometry();
    const material = new LineBasicMaterial({
        color: color,
        linewidth: 1,
    });
    geometry.setIndex(indices);
    geometry.setAttribute('position', new Float32BufferAttribute(points, 3));
    const lineSegments = new LineSegments(geometry, material);
    return lineSegments;
}

export { createFrustum };