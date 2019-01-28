import * as THREE from "three";
import { PrimitiveBase } from "./primitive_base";
import { IComponentParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * A class that wraps THREE.Group. This primitive is used to encapsulate all
 * other primitives. Translations, rotations and scaling applied to this
 * primitive effects all its children via ThreeJS attribute inheritance.
 */
export class Group extends PrimitiveBase {
    /**
     * "group"
     */
    public _class: string = "group";

    /**
     * Creates a THREE.Group item
     * @param params Group params
     * @returns THREE.Group
     */
    public _create_three_item(params: IComponentParams): THREE.Group {
        const three_item = new THREE.Group();
        return three_item;
    }

    /**
     * @param params Group params
     * @returns false
     */
    public _is_destructive(params: IComponentParams): boolean {
        return false;
    }

    /**
     * Default params for primitive
     */
    public get _default_params(): IComponentParams {
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
