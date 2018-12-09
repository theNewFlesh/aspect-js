import * as three_tools from "./three_tools";
import { Group } from "./group";
import { IComponentParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Component extends Group {
    public _children: object = {};
    public _item: Group;

    public has_child(id: string): boolean {
        return this._children.hasOwnProperty(id);
    }

    public get_child(key: string): any {
        return this._children[key];
    }

    public set_child(key: string, value: any): void {
        this._children[key] = value;
    }

    public get children(): object {
        return this._children;
    }

    public get item(): Group {
        return this._item;
    }

    public set item(item: Group) {
        this._item = item;
    }
    // -------------------------------------------------------------------------

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
        const output: any = this._default_params;
        Object.assign(output, temp);
        return three_tools.remove_empty_keys(output);
    }

    public _assign_three_item(params: IComponentParams): void {
        const grp: Group = new Group(this._scene);
        grp.create(this._to_group_params(params), this);
        this._item = grp;
        this.three_item = grp.three_item;
    }

    public create(params: IComponentParams, parent: any): void {
        const temp: IComponentParams = this._clean_params(params);
        this._id = params["id"];
        this.three_item = this._create_three_item(temp);
        if (parent !== null) {
            this.parent = parent;
            this.parent.set_child(this._id, this);
        }
        this._assign_three_item(this._clean_params(params));
        this._non_destructive_update(temp);
    }
}
