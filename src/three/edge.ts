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
    "from/translate/x"?: number;
    "from/translate/y"?: number;
    "from/translate/z"?: number;
    "from/visible"?: number;
    "to/translate/x"?: number;
    "to/translate/y"?: number;
    "to/translate/z"?: number;
    "to/visible"?: number;
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

    private __get_from_to(params: IEdgeParams): three_tools.IVector3[] {
        const new_params: object = {};
        if (this._primitives.hasOwnProperty("from")) {
            const from = this._primitives["from"].read();
            new_params["from/translate/x"] = from["translate/x"];
            new_params["from/translate/y"] = from["translate/y"];
            new_params["from/translate/z"] = from["translate/z"];
        }

        if (this._primitives.hasOwnProperty("to")) {
            const to = this._primitives["to"].read();
            new_params["to/translate/x"] = to["translate/x"];
            new_params["to/translate/y"] = to["translate/y"];
            new_params["to/translate/z"] = to["translate/z"];
        }

        const temp: object = three_tools.remove_empty_keys(params);
        Object.assign(new_params, temp);

        const v0: three_tools.IVector3 = {
            x: new_params["from/translate/x"],
            y: new_params["from/translate/y"],
            z: new_params["from/translate/z"],
        };

        const v1: three_tools.IVector3 = {
            x: new_params["to/translate/x"],
            y: new_params["to/translate/y"],
            z: new_params["to/translate/z"],
        };

        return [v0, v1];
    }

    private __get_center(params: IEdgeParams): three_tools.IVector3 {
        const v: three_tools.IVector3[] = this.__get_from_to(params);
        return three_tools.get_center(v[0], v[1]);
    }

    private __get_l2_distance(params: IEdgeParams): number {
        const v: three_tools.IVector3[] = this.__get_from_to(params);
        return three_tools.to_l2_distance(v[0], v[1]);
    }

    private __get_rotate(params: IEdgeParams): three_tools.IVector3 {
        const v: three_tools.IVector3[] = this.__get_from_to(params);
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

    private __to_from_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "from"),
            "visible":          params["from/visible"],
            "translate/x":      params["from/translate/x"],
            "translate/y":      params["from/translate/y"],
            "translate/z":      params["from/translate/z"],
            "radius":           params["radius"] * 2,
            "color/hue":        params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value":      params["color/value"],
            "color/alpha":      params["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    private __to_to_params(params: object): object {
        let output: object = {
            "name":             three_tools.get_name(params, "to"),
            "visible":          params["to/visible"],
            "translate/x":      params["to/translate/x"],
            "translate/y":      params["to/translate/y"],
            "translate/z":      params["to/translate/z"],
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
            "from/translate/x": 0,
            "from/translate/y": 1,
            "from/translate/z": 0,
            "from/visible":     true,
            "to/translate/x":  0,
            "to/translate/y":  0,
            "to/translate/z":  0,
            "to/visible":      false,
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
        this._primitives["group"] = grp;

        const body: Cylinder = new Cylinder(grp._item);
        body.create(this.__to_body_params(new_params));
        this._primitives["body"] = body;

        const arrow: Cylinder = new Cylinder(grp._item);
        arrow.create(this.__to_arrow_params(new_params));
        this._primitives["arrow"] = arrow;

        const from: Sphere = new Sphere(grp._item);
        from.create(this.__to_from_params(new_params));
        this._primitives["from"] = from;

        const to: Sphere = new Sphere(grp._item);
        to.create(this.__to_to_params(new_params));
        this._primitives["to"] = to;
    }

    public read(): IEdgeParams {
        const from = this._primitives["from"].read();
        const to = this._primitives["to"].read();
        const body = this._primitives["body"].read();
        const grp = this._primitives["group"].read();

        let params: IEdgeParams = {
            "name":              grp["name"],
            "visible":           grp["visible"],
            "from/translate/x":  from["translate/x"],
            "from/translate/y":  from["translate/y"],
            "from/translate/z":  from["translate/z"],
            "from/visible":      from["visible"],
            "to/translate/x":    to["translate/x"],
            "to/translate/y":    to["translate/y"],
            "to/translate/z":    to["translate/z"],
            "to/visible":        to["visible"],
            "scale/x":           grp["scale/x"],
            "scale/y":           grp["scale/y"],
            "scale/z":           grp["scale/z"],
            "radius":            body["radius/top"],
            "color/hue":         to["color/hue"],
            "color/saturation":  to["color/saturation"],
            "color/value":       to["color/value"],
            "color/alpha":       to["color/alpha"],
        };
        params = three_tools.remove_empty_keys(params);
        return params;
    }

    public update(params: IEdgeParams): void {
        let new_params: IEdgeParams = this.read();
        new_params = three_tools.resolve_params(params, new_params);

        this._primitives["group"].update(this.__to_group_params(new_params));
        this._primitives["from"].update(this.__to_from_params(new_params));
        this._primitives["to"].update(this.__to_to_params(new_params));
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
