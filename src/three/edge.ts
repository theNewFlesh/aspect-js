import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
import * as THREE from "three";
import * as tools from "../core/tools";
import * as three_tools from "../three/three_tools";
import { Cylinder } from "./cylinder";
import { Sphere } from "./sphere";
import { Group } from "./group";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];

export interface IEdgeParams {
    "id"?: string;
    "name"?: string;
    "visible"?: boolean;
    "start/translate/x"?: number;
    "start/translate/y"?: number;
    "start/translate/z"?: number;
    "stop/translate/x"?: number;
    "stop/translate/y"?: number;
    "stop/translate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "radius"?: number;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
    "color/alpha"?: number;
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

    private __get_center(params: IEdgeParams): three_tools.IVector3 {
        const x0: number = params["start/translate/x"] || 0;
        const y0: number = params["start/translate/y"] || 0;
        const z0: number = params["start/translate/z"] || 0;

        const x1: number = params["stop/translate/x"] || 0;
        const y1: number = params["stop/translate/y"] || 0;
        const z1: number = params["stop/translate/z"] || 0;

        return {
            x: (x0 + x1) / 2,
            y: (y0 + y1) / 2,
            z: (z0 + z1) / 2,
        };
    }

    private __get_l2_distance(params: IEdgeParams): number {
        const v0: three_tools.IVector3 = {
            x: params["start/translate/x"] || 0,
            y: params["start/translate/y"] || 0,
            z: params["start/translate/z"] || 0,
        };

        const v1: three_tools.IVector3 = {
            x: params["stop/translate/x"] || 0,
            y: params["stop/translate/y"] || 0,
            z: params["stop/translate/z"] || 0,
        };

        return three_tools.to_l2_distance(v0, v1);
    }

    private __get_rotate(params: IEdgeParams): three_tools.IVector3 {
        const v0: any = {
            x: params["start/translate/x"] || 0,
            y: params["start/translate/y"] || 0,
            z: params["start/translate/z"] || 0,
        };

        const v1: any = {
            x: params["stop/translate/x"] || 0,
            y: params["stop/translate/y"] || 0,
            z: params["stop/translate/z"] || 0,
        };

        const adj: number = Math.sqrt(Math.pow(v1.x - v0.x, 2));
        const hyp: number = three_tools.to_l2_distance(v0, v1);
        let angle: number = Math.acos(adj / hyp);
        angle = three_tools.to_angle(angle);

        const q1: boolean = v0.x < v1.x && v0.y < v1.y;
        const q2: boolean = v0.x < v1.x && v0.y > v1.y;
        const q3: boolean = v0.x > v1.x && v0.y > v1.y;
        const q4: boolean = v0.x > v1.x && v0.y < v1.y;
        const horizontal: boolean = v0.x === v1.x;
        const vertical: boolean = v0.y === v1.y;

        if (horizontal) {
            angle = 90;
        }
        else if (vertical) {
            angle = 0;
        }
        else if (q1) {
            angle = 90 + angle;
        }
        else if (q2) {
            angle = 90 - angle;
        }
        else if (q3) {
            angle = 270 + angle;
        }
        else if (q4) {
            angle = 270 - angle;
        }

        return {
            x: 0,
            y: 0,
            z: angle,
        };
    }

    private __to_group_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "group"),
            "visible":          params["visible"]     || true,
            "translate/x":      params["translate/x"] || 0,
            "translate/y":      params["translate/y"] || 0,
            "translate/z":      params["translate/z"] || 0,
            "rotate/x":         params["rotate/x"]    || 0,
            "rotate/y":         params["rotate/y"]    || 0,
            "rotate/z":         params["rotate/z"]    || 0,
            "scale/x":          params["scale/x"]     || 1,
            "scale/y":          params["scale/y"]     || 1,
            "scale/z":          params["scale/z"]     || 1,
        };
        return output;
    }

    private __to_arrow_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "arrow"),
            "visible":                                        true,
            "translate/x":     this.__get_center(params).x || 0,
            "translate/y":     this.__get_center(params).y || 0,
            "translate/z":     this.__get_center(params).z || 0,
            "rotate/x":        this.__get_rotate(params).x || 0,
            "rotate/y":        this.__get_rotate(params).y || 0,
            "rotate/z":        this.__get_rotate(params).z || 0,
            "scale/x":                                        1,
            "scale/y":                                        1,
            "scale/z":                                        1,
            "radius/top":       params["radius"] * 2       || 0.2,
            "radius/bottom":    params["radius"]           || 0.05,
            "height":           params["radius"] * 3.5     || 0.35,
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
            "visible":                                            true,
            "translate/x":     this.__get_center(params).x     || 0,
            "translate/y":     this.__get_center(params).y     || 0,
            "translate/z":     this.__get_center(params).z     || 0,
            "rotate/x":        this.__get_rotate(params).x     || 0,
            "rotate/y":        this.__get_rotate(params).y     || 0,
            "rotate/z":        this.__get_rotate(params).z     || 0,
            "scale/x":                                            1,
            "scale/y":                                            1,
            "scale/z":                                            1,
            "radius/top":       params["radius"]               || 0.05,
            "radius/bottom":    params["radius"]               || 0.05,
            "height":           this.__get_l2_distance(params) || 1,
            "color/hue":        params["color/hue"]            || cyan2.h,
            "color/saturation": params["color/saturation"]     || cyan2.s,
            "color/value":      params["color/value"]          || cyan2.v * 0.5,
            "color/alpha":      params["color/alpha"]          || cyan2.a,
        };
        console.log(output);
        return output;
    }

    private __to_start_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "start"),
            "visible":          params["visible"]           || true,
            "translate/x":      params["start/translate/x"] || 0,
            "translate/y":      params["start/translate/y"] || 0,
            "translate/z":      params["start/translate/z"] || 0,
            "rotate/x":         params["rotate/x"]          || 0,
            "rotate/y":         params["rotate/y"]          || 0,
            "rotate/z":         params["rotate/z"]          || 0,
            "scale/x":          params["scale/x"]           || 1,
            "scale/y":          params["scale/y"]           || 1,
            "scale/z":          params["scale/z"]           || 1,
            "radius":           params["radius"] * 1.5      || 0.15,
            "color/hue":        params["color/hue"]         || cyan2.h,
            "color/saturation": params["color/saturation"]  || cyan2.s,
            "color/value":      params["color/value"]       || cyan2.v,
            "color/alpha":      params["color/alpha"]       || cyan2.a,
        };
        return output;
    }

    private __to_stop_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "stop"),
            "visible":          params["visible"]          || false,
            "translate/x":      params["stop/translate/x"] || 0,
            "translate/y":      params["stop/translate/y"] || 0,
            "translate/z":      params["stop/translate/z"] || 0,
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

    public _default_params = {
        "name":              "edge",
        "visible":             true,
        "start/translate/x":      0,
        "start/translate/y":      1,
        "start/translate/z":      0,
        "stop/translate/x":       0,
        "stop/translate/y":       0,
        "stop/translate/z":       0,
        "rotate/x":               0,
        "rotate/y":               0,
        "rotate/z":               0,
        "scale/x":                1,
        "scale/y":                1,
        "scale/z":                1,
        "radius":              0.05,
        "color/hue":        cyan2.h,
        "color/saturation": cyan2.s,
        "color/value":      cyan2.v,
        "color/alpha":      cyan2.a,
    };

    public create(params: IEdgeParams = {}): void {
        const new_params: three_tools.IParams = three_tools.resolve_params(
            params, this._default_params
        );

        const grp: Group = new Group(this._container);
        grp.create(this.__to_group_params(new_params));
        this._primitives["group"] = grp;

        const body: Cylinder = new Cylinder(grp._item);
        body.create(this.__to_body_params(new_params));
        this._primitives["body"] = body;

        const arrow: Cylinder = new Cylinder(grp._item);
        arrow.create(this.__to_arrow_params(new_params));
        this._primitives["arrow"] = arrow;

        const start: Sphere = new Sphere(grp._item);
        start.create(this.__to_start_params(new_params));
        this._primitives["start"] = start;

        const stop: Sphere = new Sphere(grp._item);
        stop.create(this.__to_stop_params(new_params));
        this._primitives["stop"] = stop;
    }

    public read(): IEdgeParams {
        const start = this._primitives["start"].read();
        const stop = this._primitives["stop"].read();
        const body = this._primitives["body"].read();
        const grp = this._primitives["group"].read();

        const params: object = {
            "name":              grp["name"],
            "visible":           grp["visible"],
            "start/translate/x": start["translate/x"],
            "start/translate/y": start["translate/y"],
            "start/translate/z": start["translate/z"],
            "stop/translate/x":  stop["translate/x"],
            "stop/translate/y":  stop["translate/y"],
            "stop/translate/z":  stop["translate/z"],
            "scale/x":           grp["scale/x"],
            "scale/y":           grp["scale/y"],
            "scale/z":           grp["scale/z"],
            "radius":            body["radius/top"],
            "color/hue":         body["color/hue"],
            "color/saturation":  body["color/saturation"],
            "color/value":       body["color/value"],
            "color/alpha":       body["color/alpha"],
        };
        return params;
    }

    public update(params: IEdgeParams): void {
        const old_params: three_tools.IParams = this.read();
        const new_params: three_tools.IParams = three_tools.resolve_params(params, old_params);

        this._primitives["group"].update(this.__to_group_params(new_params));
        this._primitives["start"].update(this.__to_start_params(new_params));
        this._primitives["stop"].update(this.__to_stop_params(new_params));
        this._primitives["body"].update(this.__to_body_params(new_params));
        this._primitives["arrow"].update(this.__to_arrow_params(new_params));
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
