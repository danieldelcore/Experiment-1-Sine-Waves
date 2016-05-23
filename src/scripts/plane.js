const THREE = require('three');

export default class Plane {
    constructor(gui) {
        this.config = {
            size: 50.0,
            magnitude: 40,
            speed: 500,
        };

        const geometry = new THREE.PlaneGeometry(4000, 800, 300, 300);
        const material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            specular: 0xFFFFFF,
            emissive: 0x000000,
            shininess: 30,
            shading: THREE.FlatShading,
            side: THREE.DoubleSide,
            // wireframe: true,
        });

        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -0.5 * Math.PI;
        this.mesh.position.set(0, 0, 0);
        this.vStart = new THREE.Vector2(0, 0);
        this.vCount = this.mesh.geometry.vertices.length;

        this.initGui(gui);
    }

    initGui(gui) {
        const folder = gui.addFolder('Plane');
        folder.add(this.config, 'size', 10, 250);
        folder.add(this.config, 'speed', 1, 1000);
        folder.add(this.config, 'magnitude', 10, 200);
    }

    update(timeStamp) {
        const { size, magnitude, speed } = this.config;

        for (let i = 0; i < this.vCount; i++) {
            const v = this.mesh.geometry.vertices[i];
            const dist = new THREE.Vector2(v.x, v.y).sub(this.vStart);
            v.z = Math.sin(dist.length() / -size + (timeStamp / speed)) * magnitude;
        }

        this.mesh.geometry.verticesNeedUpdate = true;
    }
}
