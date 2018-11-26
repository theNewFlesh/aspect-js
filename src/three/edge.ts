import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
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
    "source/translate/x"?: number;
    "source/translate/y"?: number;
    "source/translate/z"?: number;
    "source/visible"?: number;
    "destination/translate/x"?: number;
    "destination/translate/y"?: number;
    "destination/translate/z"?: number;
    "destination/visible"?: number;
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
    public _components: object = {};

    public constructor(container: any) {
        this._container = container;
        this.__id = uuidv4();
    }
    // -------------------------------------------------------------------------

    private __get_source(params: IEdgeParams): three_tools.IVector3[] {
        const new_params: object = {};
        if (this._components.hasOwnProperty("source")) {
            const src = this._components["source"].read();
            new_params["source/translate/x"] = src["translate/x"];
            new_params["source/translate/y"] = src["translate/y"];
            new_params["source/translate/z"] = src["translate/z"];
        }

        if (this._components.hasOwnProperty("destination")) {
            const dst = this._components["destination"].read();
            new_params["destination/translate/x"] = dst["translate/x"];
            new_params["destination/translate/y"] = dst["translate/y"];
            new_params["destination/translate/z"] = dst["translate/z"];
        }

        const temp: object = three_tools.remove_empty_keys(params);
        Object.assign(new_params, temp);

        const v0: three_tools.IVector3 = {
            x: new_params["source/translate/x"],
            y: new_params["source/translate/y"],
            z: new_params["source/translate/z"],
        };

        const v1: three_tools.IVector3 = {
            x: new_params["destination/translate/x"],
            y: new_params["destination/translate/y"],
            z: new_params["destination/translate/z"],
        };

        return [v0, v1];
    }

    private __get_center(params: IEdgeParams): three_tools.IVector3 {
        const v: three_tools.IVector3[] = this.__get_source(params);
        return three_tools.get_center(v[0], v[1]);
    }

    private __get_l2_distance(params: IEdgeParams): number {
        const v: three_tools.IVector3[] = this.__get_source(params);
        return three_tools.to_l2_distance(v[0], v[1]);
    }

    private __get_rotate(params: IEdgeParams): three_tools.IVector3 {
        const v: three_tools.IVector3[] = this.__get_source(params);
        return three_tools.get_rotation(v[0], v[1]);
    }

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

    private __to_arrow_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "arrow"),
            "translate/x":      this.__get_center(params).x,
            "translate/y":      this.__get_center(params).y,
            "translate/z":      this.__get_center(params).z,
            "rotate/x":         this.__get_rotate(params).x,
            "rotate/y":         this.__get_rotate(params).y,
            "rotate/z":         this.__get_rotate(params).z,
            "radius/top":       params["radius"] * 2.5,
            "radius/bottom":    params["radius"],
            "height":           params["radius"] * 3.5,
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"],
            "color/alpha":      params["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_body_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "body"),
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
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_source_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "source"),
            "visible":          params["source/visible"],
            "translate/x":      params["source/translate/x"],
            "translate/y":      params["source/translate/y"],
            "translate/z":      params["source/translate/z"],
            "radius":           params["radius"] * 2,
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"],
            "color/alpha":      params["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_destination_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "destination"),
            "visible":          params["destination/visible"],
            "translate/x":      params["destination/translate/x"],
            "translate/y":      params["destination/translate/y"],
            "translate/z":      params["destination/translate/z"],
            "radius":           params["radius"] * 2,
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
            "name":              "edge",
            "visible":           true,
            "source/translate/x": 0,
            "source/translate/y": 1,
            "source/translate/z": 0,
            "source/visible":     true,
            "destination/translate/x":  0,
            "destination/translate/y":  0,
            "destination/translate/z":  0,
            "destination/visible":      false,
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
        let new_params: object = this._default_params;
        Object.assign(new_params, temp);
        new_params = three_tools.remove_empty_keys(new_params);

        const grp: Group = new Group(this._container);
        grp.create(this.__to_group_params(new_params));
        this._components["group"] = grp;

        const body: Cylinder = new Cylinder(grp._item);
        body.create(this.__to_body_params(new_params));
        this._components["body"] = body;

        const arrow: Cylinder = new Cylinder(grp._item);
        arrow.create(this.__to_arrow_params(new_params));
        this._components["arrow"] = arrow;

        const src: Sphere = new Sphere(grp._item);
        src.create(this.__to_source_params(new_params));
        this._components["source"] = src;

        const dst: Sphere = new Sphere(grp._item);
        dst.create(this.__to_destination_params(new_params));
        this._components["destination"] = dst;
    }

    public read(): IEdgeParams {
        const src = this._components["source"].read();
        const dst = this._components["destination"].read();
        const body = this._components["body"].read();
        const grp = this._components["group"].read();

        let params: IEdgeParams = {
            "name":              grp["name"],
            "visible":           grp["visible"],
            "source/translate/x":  src["translate/x"],
            "source/translate/y":  src["translate/y"],
            "source/translate/z":  src["translate/z"],
            "source/visible":      src["visible"],
            "destination/translate/x":    dst["translate/x"],
            "destination/translate/y":    dst["translate/y"],
            "destination/translate/z":    dst["translate/z"],
            "destination/visible":        dst["visible"],
            "scale/x":           grp["scale/x"],
            "scale/y":           grp["scale/y"],
            "scale/z":           grp["scale/z"],
            "radius":            body["radius/top"],
            "color/hue":         dst["color/hue"],
            "color/saturation":  dst["color/saturation"],
            "color/value":       dst["color/value"],
            "color/alpha":       dst["color/alpha"],
        };
        params = three_tools.remove_empty_keys(params);
        return params;
    }

    public update(params: IEdgeParams): void {
        let new_params: IEdgeParams = this.read();
        new_params = three_tools.resolve_params(params, new_params);

        this._components["group"].update(this.__to_group_params(new_params));
        this._components["source"].update(this.__to_source_params(new_params));
        this._components["destination"].update(this.__to_destination_params(new_params));
        this._components["body"].update(this.__to_body_params(new_params));
        this._components["arrow"].update(this.__to_arrow_params(new_params));
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
