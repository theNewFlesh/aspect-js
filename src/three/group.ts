import * as THREE from "three";
import { PrimitiveBase } from "./primitive_base";
import { IComponentParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Group extends PrimitiveBase {
    public _create_item(params: IComponentParams): THREE.Group {
        const item = new THREE.Group();
        return item;
    }

    public _is_destructive(params: IComponentParams): boolean {
        return false;
    }

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
