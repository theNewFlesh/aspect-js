import * as THREE from "three";
import * as three_tools from "./three_tools";
import { PrimitiveBase } from "./primitive_base";
import { Group } from "./group";
import { IComponentParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Component extends PrimitiveBase {
    private __to_group_params(params: object): object {
        let output: object = {
            "name":    three_tools.get_name(params, "group"),
            "visible": params["visible"],
            "scale/x": params["scale/x"],
            "scale/y": params["scale/y"],
            "scale/z": params["scale/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    public get item(): any {
        return this._item;
    }

    public set item(item: any) {
        this._item = item;
    }

    public create(params: IComponentParams): void {
        const temp: IComponentParams = three_tools.resolve_params(
            params, this._default_params
        );
        const item: any = this._default_params;
        Object.assign(item, temp);
        params = three_tools.remove_empty_keys(item);

        const grp: Group = new Group(this._parent);
        grp.create(this.__to_group_params(item));
        this.children["group"] = grp;

        this.item = grp;
    }
}
