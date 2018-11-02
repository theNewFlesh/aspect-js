import * as THREE from "three";
import { Primitive, IParams } from "./primitive";
import MENLO_REGULAR from "../static/fonts/menlo_regular.json";
const FONTS: object = {
    menlo_regular: MENLO_REGULAR,
}
// -----------------------------------------------------------------------------

export class Text extends Primitive {
    public _destructive: boolean = true;

    public _create_item(params: IParams): THREE.Mesh {
        const family: string = params["font/family"] || "menlo";
        const style: string = params["font/style"] || "regular";
        const text: string = params["text"] || "DEFAULT TEXT";

        const key: string = family + "_" + style;
        const font = new THREE.Font(FONTS[key]);
        const geo = new THREE.TextGeometry(text, {
            font: font,
            size: 1,
            height: 0.001,
        });

        const material = new THREE.MeshBasicMaterial({
            color: 0xa4a4a4,
            transparent: true
        });
        const item = new THREE.Mesh(geo, material);
        return item;
    }
}
