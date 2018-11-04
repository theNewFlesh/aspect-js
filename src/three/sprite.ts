import * as THREE from "three";
import { Primitive, IParams } from "./primitive";
// -----------------------------------------------------------------------------

export class Sprite extends Primitive {
    public _create_item(params: IParams): THREE.Sprite {
        const material = new THREE.SpriteMaterial({
            color: 0x444444,
        });
        const sprite = new THREE.Sprite(material);
        return sprite;
    }

    public _is_destructive(params: IParams): boolean {
        return false;
    }
}
