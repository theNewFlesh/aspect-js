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
    "start/visible"?: number;
    "stop/translate/x"?: number;
    "stop/translate/y"?: number;
    "stop/translate/z"?: number;
    "stop/visible"?: number;
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

        return three_tools.get_center(v0, v1);
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

        return three_tools.get_rotation(v0, v1);
    }

    private __to_group_params(params: object): object {
        const output: object = {
            "name":    this.__get_name(params, "group"),
            "visible": params["visible"],
        };
        return output;
    }

    private __to_arrow_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "arrow"),
            "translate/x":      this.__get_center(params).x || 0,
            "translate/y":      this.__get_center(params).y || 0,
            "translate/z":      this.__get_center(params).z || 0,
            "rotate/x":         this.__get_rotate(params).x || 0,
            "rotate/y":         this.__get_rotate(params).y || 0,
            "rotate/z":         this.__get_rotate(params).z || 0,
            "radius/top":       params["radius"] * 2.5,
            "radius/bottom":    params["radius"],
            "height":           params["radius"] * 3.5,
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"],
            "color/alpha":      params["color/alpha"],
        };
        return output;
    }

    private __to_body_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "body"),
            "translate/x":      this.__get_center(params).x,
            "translate/y":      this.__get_center(params).y,
            "translate/z":      this.__get_center(params).z,
            "rotate/x":         this.__get_rotate(params).x,
            "rotate/y":         this.__get_rotate(params).y,
            "rotate/z":         this.__get_rotate(params).z,
            "radius/top":       params["radius"],
            "radius/bottom":    params["radius"],
            "height":           this.__get_l2_distance(params),
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"] * 0.5,
            "color/alpha":      params["color/alpha"],
        };
        return output;
    }

    private __to_start_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "start"),
            "visible":          params["start/visible"],
            "translate/x":      params["start/translate/x"],
            "translate/y":      params["start/translate/y"],
            "translate/z":      params["start/translate/z"],
            "radius":           params["radius"] * 2,
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"],
            "color/alpha":      params["color/alpha"],
        };
        return output;
    }

    private __to_stop_params(params: object): object {
        const output: object = {
            "name":             this.__get_name(params, "stop"),
            "visible":          params["stop/visible"],
            "translate/x":      params["stop/translate/x"],
            "translate/y":      params["stop/translate/y"],
            "translate/z":      params["stop/translate/z"],
            "radius":           params["radius"] * 2,
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"],
            "color/alpha":      params["color/alpha"],
        };
        return output;
    }
     // -------------------------------------------------------------------------

    public get _default_params(): object {
        return {
            "name":              "edge",
            "visible":           true,
            "start/translate/x": 0,
            "start/translate/y": 1,
            "start/translate/z": 0,
            "start/visible":     true,
            "stop/translate/x":  0,
            "stop/translate/y":  0,
            "stop/translate/z":  0,
            "stop/visible":      false,
            "scale/x":           1,
            "scale/y":           1,
            "scale/z":           1,
            "radius":            0.05,
            "color/hue":         cyan2.h,
            "color/saturation":  cyan2.s,
            "color/value":       cyan2.v,
            "color/alpha":       cyan2.a,
        };
    }

    public create(params: IEdgeParams = {}): void {
        const temp: three_tools.IParams = three_tools.resolve_params(
            params, this._default_params
        );
        const new_params: object = this._default_params;
        Object.assign(new_params, temp);

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
            "start/visible":     start["visible"],
            "stop/translate/x":  stop["translate/x"],
            "stop/translate/y":  stop["translate/y"],
            "stop/translate/z":  stop["translate/z"],
            "stop/visible":      stop["visible"],
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
