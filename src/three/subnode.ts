import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
import * as tools from "../core/tools";
import * as three_tools from "./three_tools";
import { Group } from "./group";
import { Cube } from "./cube";
import { TextBox } from "./textbox";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

export interface ISubNodeParams {
    "id"?: string;
    "name"?: string;
    "visible"?: boolean;
    "translate/x"?: number;
    "translate/y"?: number;
    "translate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
    "color/alpha"?: number;
    "font/color/hue"?: number;
    "font/color/saturation"?: number;
    "font/color/value"?: number;
    "font/color/alpha"?: number;
    "font/text"?: string;
    "font/family"?: string;
    "font/style"?: string;
    "font/size"?: number;
}
// -----------------------------------------------------------------------------

export class SubNode {
    private __id: string;
    public _container: any;
    public _components: object = {};

    public constructor(container: any) {
        this._container = container;
        this.__id = uuidv4();
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

    private __to_cube_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "cube"),
            "visible":          params["visible"],
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"],
            "color/alpha":      params["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_textbox_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "textbox"),
            "color/hue":        params["font/color/hue"],
            "color/saturation": params["font/color/saturation"],
            "color/value":      params["font/color/value"],
            "color/alpha":      params["font/color/alpha"],
            "font/text":        params["font/text"],
            "font/family":      params["font/family"],
            "font/style":       params["font/style"],
            "font/size":        params["font/size"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }
     // -------------------------------------------------------------------------

    public get _default_params(): object {
        return {
            "name":                  "subnode",
            "visible":               true,
            "translate/x":           0,
            "translate/y":           0,
            "translate/z":           0,
            "scale/x":               4,
            "scale/y":               1,
            "scale/z":               0.1,
            "color/hue":             cyan2.h,
            "color/saturation":      cyan2.s,
            "color/value":           cyan2.v,
            "color/alpha":           cyan2.a,
            "font/color/hue":        grey2.h,
            "font/color/saturation": grey2.s,
            "font/color/value":      grey2.v,
            "font/color/alpha":      grey2.a,
            "font/text":             "subnode",
            "font/family":           "mono",
            "font/style":            "normal",
            "font/size":             300,
        };
    }

    public create(params: ISubNodeParams = {}): void {
        const temp: three_tools.IParams = three_tools.resolve_params(
            params, this._default_params
        );
        let new_params: object = this._default_params;
        Object.assign(new_params, temp);
        new_params = three_tools.remove_empty_keys(new_params);

        const grp: Group = new Group(this._container);
        grp.create(this.__to_group_params(new_params));
        this._components["group"] = grp;

        const cube: Cube = new Cube(grp._item);
        cube.create(this.__to_cube_params(new_params));
        this._components["cube"] = cube;

        const textbox: TextBox = new TextBox(grp._item);
        textbox.create(this.__to_textbox_params(new_params));
        this._components["textbox"] = textbox;
    }

    public read(): ISubNodeParams {
        const grp = this._components["group"].read();
        const cube = this._components["cube"].read();
        const textbox = this._components["textbox"].read();

        let params: ISubNodeParams = {
            "name":                  grp["name"],
            "visible":               grp["visible"],
            "translate/x":           grp["translate/x"],
            "translate/y":           grp["translate/y"],
            "translate/z":           grp["translate/z"],
            "scale/x":               grp["scale/x"],
            "scale/y":               grp["scale/y"],
            "scale/z":               grp["scale/z"],
            "color/hue":             cube["color/hue"],
            "color/saturation":      cube["color/saturation"],
            "color/value":           cube["color/value"],
            "color/alpha":           cube["color/alpha"],
            "font/color/hue":        textbox["color/hue"],
            "font/color/saturation": textbox["color/saturation"],
            "font/color/value":      textbox["color/value"],
            "font/color/alpha":      textbox["color/alpha"],
            "font/text":             textbox["font/text"],
            "font/family":           textbox["font/family"],
            "font/style":            textbox["font/style"],
            "font/size":             textbox["font/size"],
        };
        params = three_tools.remove_empty_keys(params);
        return params;
    }

    public update(params: ISubNodeParams): void {
        let new_params: ISubNodeParams = this.read();
        new_params = three_tools.resolve_params(params, new_params);

        this._components["group"].update(this.__to_group_params(new_params));
        this._components["cube"].update(this.__to_cube_params(new_params));
        this._components["textbox"].update(this.__to_textbox_params(new_params));
    }

    public delete(): void {
        const prims = this._components;
        let keys = _.keys(prims);
        const grp = this._components["group"];
        keys = _.filter(keys, key => key !== "group");
        keys.map(key => prims[key].delete());
        this._container.remove(grp._item);
    }
}
