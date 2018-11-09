import * as _ from "lodash";
import * as THREE from "three";
import { Primitive } from "./primitive";
// -----------------------------------------------------------------------------

export interface ISphereParams {
    "id"?: string;
    "name"?: string;
    "visible"?: boolean;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
    "color/alpha"?: number;
    "translate/x"?: number;
    "translate/y"?: number;
    "translate/z"?: number;
    "rotate/x"?: number;
    "rotate/y"?: number;
    "rotate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "radius"?: number;
}
// -----------------------------------------------------------------------------

export class Sphere extends Primitive {
    public _create_item(params: ISphereParams): THREE.Mesh {
        const radius: number = params["radius"] || 1;
        const geo = new THREE.SphereGeometry(radius, 24, 24);
        const material = new THREE.MeshBasicMaterial({
            color: 0x444444,
            transparent: true
        });
        const item = new THREE.Mesh(geo, material);
        return item;
    }

    public _is_destructive(params: ISphereParams): boolean {
        for (const key of _.keys(params)) {
            if (["radius"].includes(key)) {
                return true;
            }
        }
        return false;
    }

    public create(params: ISphereParams = {}): void {
        super.create(params);
    }

    public read(): ISphereParams {
        const item = this._item;
        const params: ISphereParams = super.read();
        params["radius"] = item.geometry.parameters.radius;
        return params;
    }

    public update(params: ISphereParams): void {
        super.update(params);
    }
}
