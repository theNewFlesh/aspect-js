import * as THREE from "three";
import { Primitive } from "./primitive";
import { IParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * Wraps THREE.BoxGeometry item
 */
export class Cube extends Primitive {
    public _class: string = "cube";

    /**
     * Creates a THREE.BoxGeometry item, assigns it a material and a mesh
     * @param params Params for cube
     * @returns THREE.Mesh with cube inside
     */
    public _create_three_item(params: IParams): THREE.Mesh {
        const geo: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
        const material = new THREE.MeshLambertMaterial({
            transparent: true
        });
        const three_item = new THREE.Mesh(geo, material);
        return three_item;
    }

    /**
     * This class is not destructive (returns false)
     * @param params Params for cube
     */
    public _is_destructive(params: IParams): boolean {
        return false;
    }
}
