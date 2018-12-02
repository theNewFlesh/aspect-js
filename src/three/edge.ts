import * as _ from "lodash";
import * as tools from "../core/tools";
import * as three_tools from "../three/three_tools";
import { Cylinder } from "./cylinder";
import { Sphere } from "./sphere";
import { Group } from "./group";
import { Component } from "./component";
import { IEdgeParams } from "../core/iparams";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];

export class Edge extends Component {
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

    public _to_group_params(params: object): object {
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
        super.create(params);
        const temp: IEdgeParams = this._clean_params(params);
        const grp: Group = this.children["group"];

        const body: Cylinder = new Cylinder(grp);
        body.create(this.__to_body_params(temp));
        this._children["body"] = body;

        const arrow: Cylinder = new Cylinder(grp);
        arrow.create(this.__to_arrow_params(temp));
        this._children["arrow"] = arrow;

        const source: Sphere = new Sphere(grp);
        source.create(this.__to_source_params(temp));
        this._children["source"] = source;

        const destination: Sphere = new Sphere(grp);
        destination.create(this.__to_destination_params(temp));
        this._children["destination"] = destination;
    }

    public read(): IEdgeParams {
        const src = this._children["source"].read();
        const dst = this._children["destination"].read();
        const body = this._children["body"].read();
        const grp = this._children["group"].read();

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

        this._children["group"].update(this._to_group_params(edge));
        this._children["body"].update(this.__to_body_params(edge));
        this._children["arrow"].update(this.__to_arrow_params(edge));
        this._children["source"].update(this.__to_source_params(edge));
        this._children["destination"].update(this.__to_destination_params(edge));
    }
}
