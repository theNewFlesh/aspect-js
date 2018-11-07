import * as THREE from "three";
import * as three_tools from "./three_tools";
import { PrimitiveBase } from "./primitive_base";
// -----------------------------------------------------------------------------

export class Group extends PrimitiveBase {
    public _create_item(params: three_tools.IParams): THREE.Group {
        const item = new THREE.Group();
        return item;
    }

    public _is_destructive(params: three_tools.IParams): boolean {
        return false;
    }
}
