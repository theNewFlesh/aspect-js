import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
import * as tools from "../core/tools";
import { Cylinder } from "./cylinder";
import { Sphere } from "./sphere";
import { Group } from "./group";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];

export interface IEdgeParams {
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
    "height"?: number;
    "radius"?: number;
}
// -----------------------------------------------------------------------------

export class Edge {
    private __id: string;
    public _container: any;
    public _primitives: object = {};

    public constructor(container: any) {
        this._container = container;
        this.__id = uuidv4();
    }
    // -------------------------------------------------------------------------

    private __get_name(params: object, suffix: string): string {
        if (params["name"]) {
            return params["name"] + "_" + suffix;
        }
        return suffix;
    }

    private __to_arrow_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "arrow"),
            "visible":                                        true,
            "translate/x":                                    0,
            "translate/y":      params["height"] * 0.5     || 0.5,
            "translate/z":                                    0,
            "rotate/x":                                       0,
            "rotate/y":                                       0,
            "rotate/z":                                       0,
            "scale/x":                                        1,
            "scale/y":                                        1,
            "scale/z":                                        1,
            "radius/top":       params["radius"] * 2.5     || 0.25,
            "radius/bottom":    params["radius"]           || 0.05,
            "height":           params["radius"] * 7       || 0.25,
            "color/hue":        params["color/hue"]        || cyan2.h,
            "color/saturation": params["color/saturation"] || cyan2.s,
            "color/value":      params["color/value"]      || cyan2.v,
            "color/alpha":      params["color/alpha"]      || cyan2.a,
        };
        return output;
    }

    private __to_body_params(params: object): object {
        const output: object = {
            "name":            this.__get_name(params, "body"),
            "visible":                                        true,
            "translate/x":                                    0,
            "translate/y":     params["height"] * 0.5      || 0.5,
            "translate/z":                                    0,
            "rotate/x":                                       0,
            "rotate/y":                                       0,
            "rotate/z":                                       0,
            "scale/x":                                        1,
            "scale/y":                                        1,
            "scale/z":                                        1,
            "radius/top":       params["radius"]           || 0.05,
            "radius/bottom":    params["radius"]           || 0.05,
            "height":           params["height"]           || 1,
            "color/hue":        params["color/hue"]        || cyan2.h,
            "color/saturation": params["color/saturation"] || cyan2.s,
            "color/value":      params["color/value"]      || cyan2.v * 0.5,
            "color/alpha":      params["color/alpha"]      || cyan2.a,
        };
        return output;
    }

    private __to_group_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "start"),
            "visible":          params["visible"]          || true,
            "translate/x":      params["translate/x"]      || 0,
            "translate/y":      params["translate/y"]      || 0,
            "translate/z":      params["translate/z"]      || 0,
            "rotate/x":         params["rotate/x"]         || 0,
            "rotate/y":         params["rotate/y"]         || 0,
            "rotate/z":         params["rotate/z"]         || 0,
            "scale/x":          params["scale/x"]          || 1,
            "scale/y":          params["scale/y"]          || 1,
            "scale/z":          params["scale/z"]          || 1,
        };
        return output;
    }

    private __to_start_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "start"),
            "visible":          params["visible"]          || true,
            "translate/x":      params["translate/x"]      || 0,
            "translate/y":      params["height"]           || 1,
            "translate/z":      params["translate/z"]      || 0,
            "rotate/x":         params["rotate/x"]         || 0,
            "rotate/y":         params["rotate/y"]         || 0,
            "rotate/z":         params["rotate/z"]         || 0,
            "scale/x":          params["scale/x"]          || 1,
            "scale/y":          params["scale/y"]          || 1,
            "scale/z":          params["scale/z"]          || 1,
            "radius":           params["radius"] * 1.5     || 0.15,
            "color/hue":        params["color/hue"]        || cyan2.h,
            "color/saturation": params["color/saturation"] || cyan2.s,
            "color/value":      params["color/value"]      || cyan2.v,
            "color/alpha":      params["color/alpha"]      || cyan2.a,
        };
        return output;
    }

    private __to_stop_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "stop"),
            "visible":          params["visible"]          || false,
            "translate/x":      params["translate/x"]      || 0,
            "translate/y":      params["hieght"]           || 0,
            "translate/z":      params["translate/z"]      || 0,
            "rotate/x":         params["rotate/x"]         || 0,
            "rotate/y":         params["rotate/y"]         || 0,
            "rotate/z":         params["rotate/z"]         || 0,
            "scale/x":          params["scale/x"]          || 1,
            "scale/y":          params["scale/y"]          || 1,
            "scale/z":          params["scale/z"]          || 1,
            "radius":           params["radius"] * 1.5     || 0.15,
            "color/hue":        params["color/hue"]        || cyan2.h,
            "color/saturation": params["color/saturation"] || cyan2.s,
            "color/value":      params["color/value"]      || cyan2.v,
            "color/alpha":      params["color/alpha"]      || cyan2.a,
        };
        return output;
    }
     // -------------------------------------------------------------------------

    public create(params: IEdgeParams = {}): void {
        const grp: Group = new Group(this._container);
        grp.create(this.__to_group_params(params));
        this._primitives["group"] = grp;

        const body: Cylinder = new Cylinder(grp._item);
        body.create(this.__to_body_params(params));
        this._primitives["body"] = body;

        const arrow: Cylinder = new Cylinder(grp._item);
        arrow.create(this.__to_arrow_params(params));
        this._primitives["arrow"] = arrow;

        const start: Sphere = new Sphere(grp._item);
        start.create(this.__to_start_params(params));
        this._primitives["start"] = start;

        const stop: Sphere = new Sphere(grp._item);
        stop.create(this.__to_stop_params(params));
        this._primitives["stop"] = stop;
    }

    public read(): IEdgeParams {
        const grp = this._primitives["group"].read();
        const body = this._primitives["body"].read();

        const params: object = {
            "name":             grp["name"],
            "visible":          grp["visible"],
            "translate/x":      grp["translate/x"],
            "translate/y":      grp["translate/y"],
            "translate/z":      grp["translate/z"],
            "rotate/x":         grp["rotate/x"],
            "rotate/y":         grp["rotate/y"],
            "rotate/z":         grp["rotate/z"],
            "scale/x":          grp["scale/x"],
            "scale/y":          grp["scale/y"],
            "scale/z":          grp["scale/z"],
            "height":           body["height"],
            "radius":           body["radius/top"],
            "color/hue":        body["color/hue"],
            "color/saturation": body["color/saturation"],
            "color/value":      body["color/value"],
            "color/alpha":      body["color/alpha"],
        };
        return params;
    }

    public update(params: IEdgeParams): void {
        this._primitives["body"].update(this.__to_body_params(params));
        this._primitives["arrow"].update(this.__to_arrow_params(params));
        this._primitives["group"].update(this.__to_group_params(params));
        this._primitives["start"].update(this.__to_start_params(params));
        this._primitives["stop"].update(this.__to_stop_params(params));
    }

    public delete(): void {
        const prims = this._primitives;
        let keys = _.keys(prims);
        const grp = this._primitives["group"];
        keys = _.filter(keys, key => key !== "group");
        keys.map(key => prims[key].delete());
        this._container.remove(grp._item);
    }
}
