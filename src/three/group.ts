import * as THREE from "three";
import { PrimitiveBase } from "./primitive_base";
import { IGroupParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Group extends PrimitiveBase {
    public _create_item(params: IGroupParams): THREE.Group {
        const item = new THREE.Group();
        return item;
    }

    public _is_destructive(params: IGroupParams): boolean {
        return false;
    }

    public get _default_params(): IGroupParams {
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
