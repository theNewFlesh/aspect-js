import * as _ from "lodash";
import * as tools from "../core/tools";
import * as three_tools from "./three_tools";
import { Component } from "./component";
import { Group } from "./group";
import { Cube } from "./cube";
import { TextBox } from "./textbox";
import { INodeParams } from "../core/iparams";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

export class Node extends Component {
    public _scaling: boolean = false;
    private __scale_factor: number = 2;

    private __to_width(params: object): number {
        let length: number;
        if (params["font/text"] === undefined) {
            length = this.read()["font/text"].length;
        }
        else {
            length = params["font/text"].length;
        }
        return length / this.__scale_factor;
    }

    public _to_group_params(params: object): object {
        let output: object = {
            "name":        three_tools.get_name(params, "group"),
            "visible":     params["visible"],
            "translate/x": params["translate/x"],
            "translate/y": params["translate/y"],
            "translate/z": params["translate/z"],
            "scale/x":     1,
            "scale/y":     1,
            "scale/z":     1,
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_cube_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "cube"),
            "visible":          params["visible"],
            "scale/x":          this.__to_width(params),
            "scale/y":          params["scale/y"],
            "scale/z":          params["scale/z"],
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
            "scale/x":          this.__to_width(params),
            "scale/y":          params["scale/y"],
            "scale/z":          params["scale/z"],
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

    public get _default_params(): INodeParams {
        return {
            "name":                  "node",
            "visible":               true,
            "translate/x":           0,
            "translate/y":           0,
            "translate/z":           0,
            "scale/x":               1,
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
            "font/text":             "node",
            "font/family":           "courier",
            "font/style":            "normal",
            "font/size":             300,
        };
    }

    public create(params: INodeParams, parent: any): void {
        super.create(params, parent);

        const temp: INodeParams = this._clean_params(params);
        const grp: Group = this.get_child("group");

        const cube: Cube = new Cube();
        cube.create(this.__to_cube_params(temp), grp);
        this.set_child("cube", cube);

        const textbox: TextBox = new TextBox();
        textbox.create(this.__to_textbox_params(temp), grp);
        this.set_child("textbox", textbox);
    }

    public read(): INodeParams {
        const grp = this.get_child("group").read();
        const cube = this.get_child("cube").read();
        const textbox = this.get_child("textbox").read();

        let params: INodeParams = {
            "name":                  grp["name"],
            "type":                  "node",
            "visible":               grp["visible"],
            "translate/x":           grp["translate/x"],
            "translate/y":           grp["translate/y"],
            "translate/z":           grp["translate/z"],
            "scale/x":               textbox["scale/x"],
            "scale/y":               textbox["scale/y"],
            "scale/z":               textbox["scale/z"],
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

    public update(params: INodeParams): void {
        let new_params: INodeParams = this.read();
        new_params = three_tools.resolve_params(params, new_params);

        this.get_child("group").update(this._to_group_params(new_params));
        this.get_child("cube").update(this.__to_cube_params(new_params));
        this.get_child("textbox").update(this.__to_textbox_params(new_params));
    }
}
