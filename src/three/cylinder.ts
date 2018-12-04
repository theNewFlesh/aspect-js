import * as _ from "lodash";
import * as THREE from "three";
import { Primitive } from "./primitive";
import { ICylinderParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Cylinder extends Primitive {
    public _create_three_item(params: ICylinderParams): THREE.Mesh {
        const height: number = params["height"] || 1;
        const top: number = params["radius/top"] || 1;
        const bottom: number = params["radius/bottom"] || 1;
        const geo = new THREE.CylinderGeometry(top, bottom, height, 24);
        const material = new THREE.MeshLambertMaterial({
            color: 0x444444,
            transparent: true
        });
        const three_item = new THREE.Mesh(geo, material);
        return three_item;
    }

    public _is_destructive(params: ICylinderParams): boolean {
        for (const key of _.keys(params)) {
            if (["height", "radius/top", "radius/bottom"].includes(key)) {
                return true;
            }
        }
        return false;
    }

    // public create(params: ICylinderParams, parent: any): void {
    //     super.create(params);
    // }

    public read(): ICylinderParams {
        const params: ICylinderParams = super.read();
        params["height"]        = this.three_item.geometry.parameters.height;
        params["radius/top"]    = this.three_item.geometry.parameters.radiusTop;
        params["radius/bottom"] = this.three_item.geometry.parameters.radiusBottom;
        return params;
    }

    public update(params: ICylinderParams): void {
        super.update(params);
    }
}
