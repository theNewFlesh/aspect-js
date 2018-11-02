import * as THREE from "three";
import { Primitive } from "./primitive";
// -----------------------------------------------------------------------------

export class Cube extends Primitive {
    public _create_item(): THREE.Mesh {
        const geo: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x7ec4cf,
            transparent: true
        });
        const item = new THREE.Mesh(geo, material);
        return item;
    }
}
