const THREE = require('three');

export default class Plane {
    constructor() {
        const geometry = new THREE.PlaneGeometry(4000, 800, 300, 300);
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            specular: 0xffffff,
            shininess: 30,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
            // wireframe: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -0.5 * Math.PI;
        this.mesh.position.set(0, 0, 0);
    }

    update(timeStamp) {
        const center = new THREE.Vector2(0, 0);
        const vCount = this.mesh.geometry.vertices.length;

        for (let i = 0; i < vCount; i++) {
            const v = this.mesh.geometry.vertices[i];
            const dist = new THREE.Vector2(v.x, v.y).sub(center);
            const size = 50.0;
            const magnitude = 40;
            v.z = Math.sin(dist.length() / -size + (timeStamp / 500)) * magnitude;
        }

        this.mesh.geometry.verticesNeedUpdate = true;
    }
}
