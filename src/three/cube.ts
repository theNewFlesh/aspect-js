import * as THREE from "three";
import { Primitive } from "./primitive";
import { IParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Cube extends Primitive {
    public _create_item(params: IParams): THREE.Mesh {
        const geo: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
        const material = new THREE.MeshLambertMaterial({
            transparent: true
        });
        const item = new THREE.Mesh(geo, material);
        return item;
    }

    public _is_destructive(params: IParams): boolean {
        return false;
    }
}
