import * as _ from "lodash";
import * as tools from "../core/tools";
import * as three_tools from "../three/three_tools";
import { Cylinder } from "./cylinder";
import { Sphere } from "./sphere";
import { Group } from "./group";
import { Params } from "../core/params";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];

export interface IEdgeParams {
    "id"?: string;
    "name"?: string;
    "visible"?: boolean;
    "source/translate/x"?: number;
    "source/translate/y"?: number;
    "source/translate/z"?: number;
    "destination/translate/x"?: number;
    "destination/translate/y"?: number;
    "destination/translate/z"?: number;
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
    private __id: string = null;
    public _parent: any;
    public _components: object = {};

    public constructor(container: any) {
        this._parent = container;
    }
    // -------------------------------------------------------------------------

    private __to_vector(params: object): three_tools.IVector3 {
        return {
            x: params["translate/x"],
            y: params["translate/y"],
            z: params["translate/z"],
        };
    }

    private __get_center(edge: object): three_tools.IVector3 {
        const src: object = this.__to_source_params(edge);
        const dst: object = this.__to_destination_params(edge);
        const a: three_tools.IVector3 = this.__to_vector(src);
        const b: three_tools.IVector3 = this.__to_vector(dst);
        return three_tools.get_center(a, b);
    }

    private __get_l2_distance(edge: object): number {
        const src: object = this.__to_source_params(edge);
        const dst: object = this.__to_destination_params(edge);
        const a: three_tools.IVector3 = this.__to_vector(src);
        const b: three_tools.IVector3 = this.__to_vector(dst);
        return three_tools.to_l2_distance(a, b);
    }

    private __get_rotate(edge: object): three_tools.IVector3 {
        const src: object = this.__to_source_params(edge);
        const dst: object = this.__to_destination_params(edge);
        const a: three_tools.IVector3 = this.__to_vector(src);
        const b: three_tools.IVector3 = this.__to_vector(dst);
        return three_tools.get_rotation(a, b);
    }
    // -------------------------------------------------------------------------

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

    private __to_arrow_params(edge: object): object {
        let output: object = {
            "name":             three_tools.get_name(edge, "arrow"),
            "translate/x":      this.__get_center(edge).x,
            "translate/y":      this.__get_center(edge).y,
            "translate/z":      this.__get_center(edge).z,
            "rotate/x":         this.__get_rotate(edge).x,
            "rotate/y":         this.__get_rotate(edge).y,
            "rotate/z":         this.__get_rotate(edge).z,
            "radius/top":       edge["radius"] * 4,
            "radius/bottom":    edge["radius"],
            "height":           edge["radius"] * 6,
            "color/hue":        edge["color/hue"],
            "color/saturation": edge["color/saturation"],
            "color/value":      edge["color/value"],
            "color/alpha":      edge["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_body_params(edge: object): object {
        let output: object = {
            "name":             three_tools.get_name(edge, "body"),
            "translate/x":      this.__get_center(edge).x,
            "translate/y":      this.__get_center(edge).y,
            "translate/z":      this.__get_center(edge).z,
            "rotate/x":         this.__get_rotate(edge).x,
            "rotate/y":         this.__get_rotate(edge).y,
            "rotate/z":         this.__get_rotate(edge).z,
            "radius/top":       edge["radius"],
            "radius/bottom":    edge["radius"],
            "height":           this.__get_l2_distance(edge),
            "color/hue":        edge["color/hue"],
            "color/saturation": edge["color/saturation"],
            "color/value":      edge["color/value"] * 0.5,
            "color/alpha":      edge["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_source_params(edge: object): object {
        let output: object = {
            "name":             three_tools.get_name(edge, "source"),
            "visible":          false,
            "radius":           0.1,
            "translate/x":      edge["source/translate/x"],
            "translate/y":      edge["source/translate/y"],
            "translate/z":      edge["source/translate/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_destination_params(edge: object): object {
        let output: object = {
            "name":             three_tools.get_name(edge, "source"),
            "visible":          false,
            "radius":           0.1,
            "translate/x":      edge["destination/translate/x"],
            "translate/y":      edge["destination/translate/y"],
            "translate/z":      edge["destination/translate/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }
     // -------------------------------------------------------------------------

    public get _default_params(): object {
        return {
            "name":                    "edge",
            "visible":                 true,
            "source/translate/x":      0,
            "source/translate/y":      1,
            "source/translate/z":      0,
            "destination/translate/x": 0,
            "destination/translate/y": 0,
            "destination/translate/z": 0,
            "scale/x":                 1,
            "scale/y":                 1,
            "scale/z":                 1,
            "radius":                  0.05,
            "color/hue":               cyan2.h,
            "color/saturation":        cyan2.s,
            "color/value":             cyan2.v,
            "color/alpha":             cyan2.a,
        };
    }

    public create(params: IEdgeParams = {}): void {
        const temp: three_tools.IParams = three_tools.resolve_params(
            params, this._default_params
        );
        let edge: any = this._default_params;
        Object.assign(edge, temp);
        edge = three_tools.remove_empty_keys(edge);

        const grp: Group = new Group(this._parent);
        grp.create(this.__to_group_params(edge));
        this._components["group"] = grp;

        const body: Cylinder = new Cylinder(grp._item);
        body.create(this.__to_body_params(edge));
        this._components["body"] = body;

        const arrow: Cylinder = new Cylinder(grp._item);
        arrow.create(this.__to_arrow_params(edge));
        this._components["arrow"] = arrow;

        const source: Sphere = new Sphere(grp._item);
        source.create(this.__to_source_params(edge));
        this._components["source"] = source;

        const destination: Sphere = new Sphere(grp._item);
        destination.create(this.__to_destination_params(edge));
        this._components["destination"] = destination;
    }

    public read(): IEdgeParams {
        const src = this._components["source"].read();
        const dst = this._components["destination"].read();
        const body = this._components["body"].read();
        const grp = this._components["group"].read();

        let params: IEdgeParams = {
            "name":                    grp["name"],
            "visible":                 grp["visible"],
            "source/translate/x":      src["translate/x"],
            "source/translate/y":      src["translate/y"],
            "source/translate/z":      src["translate/z"],
            "destination/translate/x": dst["translate/x"],
            "destination/translate/y": dst["translate/y"],
            "destination/translate/z": dst["translate/z"],
            "scale/x":                 grp["scale/x"],
            "scale/y":                 grp["scale/y"],
            "scale/z":                 grp["scale/z"],
            "radius":                  body["radius/top"],
            "color/hue":               dst["color/hue"],
            "color/saturation":        dst["color/saturation"],
            "color/value":             dst["color/value"],
            "color/alpha":             dst["color/alpha"],
        };
        params = three_tools.remove_empty_keys(params);
        return params;
    }

    public update(params: IEdgeParams): void {
        let edge: object = this.read();
        edge = three_tools.resolve_params(params, edge);

        this._components["group"].update(this.__to_group_params(edge));
        this._components["body"].update(this.__to_body_params(edge));
        this._components["arrow"].update(this.__to_arrow_params(edge));
        this._components["source"].update(this.__to_source_params(edge));
        this._components["destination"].update(this.__to_destination_params(edge));
    }

    public delete(): void {
        const prims = this._components;
        let keys = _.keys(prims);
        const grp = this._components["group"];
        keys = _.filter(keys, key => key !== "group");
        keys.map(key => prims[key].delete());
        this._parent.remove(grp._item);
    }
}
