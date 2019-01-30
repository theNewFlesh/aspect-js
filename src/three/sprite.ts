import * as THREE from "three";
import { Primitive } from "./primitive";
import { IParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * Wraps THREE.Sprite item
 */
export class Sprite extends Primitive {
    /**
     * "sprite"
     */
    public _class: string = "sprite";

    /**
     * Creates a THREE.Sprite item, assigns it a material and a mesh
     * @param params Params for sprite
     * @returns THREEE.Sprite instance
     */
    public _create_three_item(params: IParams): THREE.Sprite {
        const material = new THREE.SpriteMaterial({
            color: 0x444444,
        });
        const sprite = new THREE.Sprite(material);
        return sprite;
    }

    /**
     * Returns false
     * @param params Sprite params
     */
    public _is_destructive(params: IParams): boolean {
        return false;
    }
}
