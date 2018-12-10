import * as _ from "lodash";
import * as THREE from "three";
import { Primitive } from "./primitive";
import { ISphereParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Sphere extends Primitive {
    public _class: string = "sphere";

    public _create_three_item(params: ISphereParams): THREE.Mesh {
        const radius: number = params["radius"] || 1;
        const geo = new THREE.SphereGeometry(radius, 24, 24);
        const material = new THREE.MeshLambertMaterial({
            color: 0x444444,
            transparent: true
        });
        const three_item = new THREE.Mesh(geo, material);
        return three_item;
    }

    public _is_destructive(params: ISphereParams): boolean {
        for (const key of _.keys(params)) {
            if (["radius"].includes(key)) {
                return true;
            }
        }
        return false;
    }

    // public create(params: ISphereParams, parent: any): void {
    //     super.create(params);
    // }

    public read(): ISphereParams {
        const params: ISphereParams = super.read();
        params["radius"] = this.three_item.geometry.parameters.radius;
        return params;
    }

    public update(params: ISphereParams): void {
        super.update(params);
    }
}
