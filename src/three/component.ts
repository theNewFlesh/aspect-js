import * as THREE from "three";
import * as three_tools from "./three_tools";
import { PrimitiveBase } from "./primitive_base";
import { Group } from "./group";
import { IComponentParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Component extends Group {
    public _to_group_params(params: object): object {
        let output: object = {
            "name":        three_tools.get_name(params, "group"),
            "visible":     params["visible"],
            "translate/x": params["translate/x"],
            "translate/y": params["translate/y"],
            "translate/z": params["translate/z"],
            "rotate/x":    params["rotate/x"],
            "rotate/y":    params["rotate/y"],
            "rotate/z":    params["rotate/z"],
            "scale/x":     params["scale/x"],
            "scale/y":     params["scale/y"],
            "scale/z":     params["scale/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    public get three_item(): any {
        return this._three_item;
    }

    public set three_item(three_item: any) {
        this._three_item = three_item;
    }

    public _clean_params(params: object): object {
        const temp: IComponentParams = three_tools.resolve_params(
            params, this._default_params
        );
        const three_item: any = this._default_params;
        Object.assign(three_item, temp);
        return three_tools.remove_empty_keys(three_item);
    }

    public _assign_three_item(params: IComponentParams): void {
        const grp: Group = new Group(this.parent);
        grp.create(this._to_group_params(params));
        this.children["group"] = grp;
        this.three_item = grp.three_item;
    }

    public create(params: IComponentParams): void {
        this._assign_three_item(this._clean_params(params));
    }
}
