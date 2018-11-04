import * as _ from "lodash";
import * as THREE from "three";
import { Primitive } from "./primitive";
// -----------------------------------------------------------------------------

export interface ICylinderParams {
    "id"?: string;
    "name"?: string;
    "opacity"?: number;
    "visible"?: boolean;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/luminance"?: number;
    "translate/x"?: number;
    "translate/y"?: number;
    "translate/z"?: number;
    "rotate/x"?: number;
    "rotate/y"?: number;
    "rotate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "height"?: number;
    "radius/top"?: number;
    "radius/bottom"?: number;
}
// -----------------------------------------------------------------------------

export class Cylinder extends Primitive {
    public _create_item(params: ICylinderParams): THREE.Mesh {
        const height: number = params["height"] || 1;
        const top: number = params["radius/top"] || 1;
        const bottom: number = params["radius/bottom"] || 1;
        const geo = new THREE.CylinderGeometry(top, bottom, height, 6);
        const material = new THREE.MeshBasicMaterial({
            color: 0x444444,
            transparent: true
        });
        const item = new THREE.Mesh(geo, material);
        return item;
    }

    public _is_destructive(params: ICylinderParams): boolean {
        for (const key of _.keys(params)) {
            if (["height", "radius/top", "radius/bottom"].includes(key)) {
                return true;
            }
        }
        return false;
    }

    public read(): ICylinderParams {
        const item = this._item;
        const params: ICylinderParams = super.read();
        params["height"] = item.geometry.parameters.height;
        params["radius/top"] = item.geometry.parameters.radiusTop;
        params["radius/bottom"] = item.geometry.parameters.radiusBottom;
        return params;
    }
}
