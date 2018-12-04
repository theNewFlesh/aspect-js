import * as THREE from "three";
import { Primitive } from "./primitive";
import { IParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Sprite extends Primitive {
    public _create_three_item(params: IParams): THREE.Sprite {
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
