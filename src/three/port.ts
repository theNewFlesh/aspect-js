import * as _ from "lodash";
import * as tools from "../core/tools";
import * as three_tools from "./three_tools";
import { Group } from "./group";
import { Sphere } from "./sphere";
import { IPortParams } from "../core/iparams";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

export class Port {
    private __id: string;
    public _parent: any;
    public _item: any;
    public _children: object = {};

    public constructor(parent: any) {
        this._parent = parent;
    }
    // -------------------------------------------------------------------------

    private __to_group_params(params: object): object {
        let output: object = {
            "name":        three_tools.get_name(params, "group"),
            "visible":     params["visible"],
            "translate/x": params["translate/x"],
            "translate/y": params["translate/y"],
            "translate/z": params["translate/z"],
            "scale/x":     params["scale/x"],
            "scale/y":     params["scale/y"],
            "scale/z":     params["scale/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_sphere_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "sphere"),
            "visible":          params["visible"],
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"],
            "color/alpha":      params["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }
    // -------------------------------------------------------------------------

    public get _default_params(): object {
        return {
            "name":                  "port",
            "visible":               true,
            "translate/x":           0,
            "translate/y":           0,
            "translate/z":           0,
            "scale/x":               0.15,
            "scale/y":               0.15,
            "scale/z":               0.15,
            "color/hue":             cyan2.h,
            "color/saturation":      cyan2.s,
            "color/value":           cyan2.v,
            "color/alpha":           cyan2.a,
        };
    }

    public create(params: IPortParams = {}): void {
        const temp: IPortParams = three_tools.resolve_params(
            params, this._default_params
        );
        let new_params: object = this._default_params;
        Object.assign(new_params, temp);
        new_params = three_tools.remove_empty_keys(new_params);

        const grp: Group = new Group(this._parent);
        grp.create(this.__to_group_params(new_params));
        this._children["group"] = grp;
        this._item = grp;

        const sphere: Sphere = new Sphere(grp);
        sphere.create(this.__to_sphere_params(new_params));
        this._children["sphere"] = sphere;
    }

    public read(): IPortParams {
        const grp = this._children["group"].read();
        const sphere = this._children["sphere"].read();

        let params: IPortParams = {
            "name":                  grp["name"],
            "visible":               grp["visible"],
            "translate/x":           grp["translate/x"],
            "translate/y":           grp["translate/y"],
            "translate/z":           grp["translate/z"],
            "scale/x":               grp["scale/x"],
            "scale/y":               grp["scale/y"],
            "scale/z":               grp["scale/z"],
            "color/hue":             sphere["color/hue"],
            "color/saturation":      sphere["color/saturation"],
            "color/value":           sphere["color/value"],
            "color/alpha":           sphere["color/alpha"],
        };
        params = three_tools.remove_empty_keys(params);
        return params;
    }

    public update(params: IPortParams): void {
        let new_params: IPortParams = this.read();
        new_params = three_tools.resolve_params(params, new_params);

        this._children["group"].update(this.__to_group_params(new_params));
        this._children["sphere"].update(this.__to_sphere_params(new_params));
    }

    public delete(): void {
        const prims = this._children;
        let keys = _.keys(prims);
        const grp = this._children["group"];
        keys = _.filter(keys, key => key !== "group");
        keys.map(key => prims[key].delete());
        this._parent._item.remove(grp._item);
    }
}
