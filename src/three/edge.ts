import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
import * as tools from "../core/tools";
import * as three_tools from "../three/three_tools";
import { Cylinder } from "./cylinder";
import { Sphere } from "./sphere";
import { Group } from "./group";
import { Params } from '@/core/params';
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
        this.__id = null;
    }
    // -------------------------------------------------------------------------

    private __to_vector(params: object): three_tools.IVector3 {
        return {
            x: params["display/translate/x"],
            y: params["display/translate/y"],
            z: params["display/translate/z"],
        };
    }

    private __get_center(src: object, dst: object): three_tools.IVector3 {
        const a: three_tools.IVector3 = this.__to_vector(src);
        const b: three_tools.IVector3 = this.__to_vector(dst);
        return three_tools.get_center(a, b);
    }

    private __get_l2_distance(src: object, dst: object): number {
        const a: three_tools.IVector3 = this.__to_vector(src);
        const b: three_tools.IVector3 = this.__to_vector(dst);
        return three_tools.to_l2_distance(a, b);
    }

    private __get_rotate(src: object, dst: object): three_tools.IVector3 {
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

    private __to_arrow_params(edge: object, src: object, dst: object): object {
        let output: object = {
            "name":             three_tools.get_name(edge, "arrow"),
            "translate/x":      this.__get_center(src, dst).x,
            "translate/y":      this.__get_center(src, dst).y,
            "translate/z":      this.__get_center(src, dst).z,
            "rotate/x":         this.__get_rotate(src, dst).x,
            "rotate/y":         this.__get_rotate(src, dst).y,
            "rotate/z":         this.__get_rotate(src, dst).z,
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

    private __to_body_params(edge: object, src: object, dst: object): object {
        let output: object = {
            "name":             three_tools.get_name(edge, "body"),
            "translate/x":      this.__get_center(src, dst).x,
            "translate/y":      this.__get_center(src, dst).y,
            "translate/z":      this.__get_center(src, dst).z,
            "rotate/x":         this.__get_rotate(src, dst).x,
            "rotate/y":         this.__get_rotate(src, dst).y,
            "rotate/z":         this.__get_rotate(src, dst).z,
            "radius/top":       edge["radius"],
            "radius/bottom":    edge["radius"],
            "height":           this.__get_l2_distance(src, dst),
            "color/hue":        edge["color/hue"],
            "color/saturation": edge["color/saturation"],
            "color/value":      edge["color/value"] * 0.5,
            "color/alpha":      edge["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }
     // -------------------------------------------------------------------------

    public create(params: Params, id: string): void {
        this.__id = id;

        const edge: object = params.to_edge(id);
        const src: object = params.to_component(edge["source"]);
        const dst: object = params.to_component(edge["destination"]);

        const grp: Group = new Group(this._container);
        grp.create(this.__to_group_params(edge));
        this._components["group"] = grp;

        const body: Cylinder = new Cylinder(grp._item);
        body.create(this.__to_body_params(edge, src, dst));
        this._components["body"] = body;

        const arrow: Cylinder = new Cylinder(grp._item);
        arrow.create(this.__to_arrow_params(edge, src, dst));
        this._components["arrow"] = arrow;
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
            "source/visible":          src["visible"],
            "destination/translate/x": dst["translate/x"],
            "destination/translate/y": dst["translate/y"],
            "destination/translate/z": dst["translate/z"],
            "destination/visible":     dst["visible"],
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

    public update(params: Params): void {
        const edge: object = params.to_edge(this.__id);
        const src: object = params.to_component(edge["source"]);
        const dst: object = params.to_component(edge["destination"]);

        this._components["group"].update(this.__to_group_params(edge));
        this._components["body"].update(this.__to_body_params(edge, src, dst));
        this._components["arrow"].update(this.__to_arrow_params(edge, src, dst));
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
