import * as THREE from "three";
import { Primitive } from "./primitive";
// -----------------------------------------------------------------------------

export class Cylinder extends Primitive {
    public _create_item(): THREE.Mesh {
        const geo = new THREE.CylinderGeometry(1, 1, 1, 6);
        const material = new THREE.MeshBasicMaterial({
            color: 0x444444,
            transparent: true
        });
        const item = new THREE.Mesh(geo, material);
        return item;
    }
}
