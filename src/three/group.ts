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

    public get _default_params(): object {
        return {
            "name": "group",
            "visible": true,
            "translate/x": 0,
            "translate/y": 0,
            "translate/z": 0,
            "rotate/x": 0,
            "rotate/y": 0,
            "rotate/z": 0,
            "scale/x": 1,
            "scale/y": 1,
            "scale/z": 1,
        };
    }
}
