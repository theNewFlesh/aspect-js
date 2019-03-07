import * as _ from "lodash";
import * as tools from "../core/tools";
import * as three_tools from "../three/three_tools";
import { Cylinder } from "./cylinder";
import { Sphere } from "./sphere";
import { Component } from "./component";
import { IEdgeParams } from "../core/iparams";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];

/**
 * Class representing connections between components.
 * An Edge is made up of a source Sphere, a destination Sphere,
 * a Cylinder connecting them together and a Cylinder (shaped like a truncated
 * cone) indicating the direction of the Edge.
 */
export class Edge extends Component {
    /**
     * "edge"
     */
    public _class: string = "edge";

    /**
     * ID of source components
     */
    private __source_id: string = null;

    /**
     * ID of source components
     */
    private __destination_id: string = null;

    /**
     * Converts translate params to IVector3 object
     * @param params Params with translate/[x, y, z] fields
     */
    private __to_vector(params: object): three_tools.IVector3 {
        return {
            x: params["translate/x"],
            y: params["translate/y"],
            z: params["translate/z"],
        };
    }

    /**
     * Resolves the mid-point between source and destination coordinates
     * @param edge Edge params with "source/id" and "destination/id" fields
     * @returns Object with x, y, z fields
     */
    private __get_center(edge: object): three_tools.IVector3 {
        const src: object = this.__to_source_params(edge);
        const dst: object = this.__to_destination_params(edge);
        const a: three_tools.IVector3 = this.__to_vector(src);
        const b: three_tools.IVector3 = this.__to_vector(dst);
        return three_tools.get_center(a, b);
    }

    /**
     * Calculates L2 Euclidean distance between source and destination coordinates
     * @param edge Edge params with "source/id" and "destination/id" fields
     * @returns Distance between source and destination
     */
    private __get_l2_distance(edge: object): number {
        const src: object = this.__to_source_params(edge);
        const dst: object = this.__to_destination_params(edge);
        const a: three_tools.IVector3 = this.__to_vector(src);
        const b: three_tools.IVector3 = this.__to_vector(dst);
        return three_tools.to_l2_distance(a, b);
    }

    /**
     * Calculates the rotation of the edges body and arrow primitives given the
     * source and destination coordinates
     * @param edge Edge params with "source/id" and "destination/id" fields
     * @returns Object with x, y, z fields in degrees
     */
    public __get_rotate(edge?: object): three_tools.IVector3 {
        // TODO: find a way to remove this nonsense
        if (edge === undefined) {
            throw new Error("edge not defined");
        }
        const src: object = this.__to_source_params(edge);
        const dst: object = this.__to_destination_params(edge);
        const a: three_tools.IVector3 = this.__to_vector(src);
        const b: three_tools.IVector3 = this.__to_vector(dst);
        return three_tools.get_rotation(a, b);
    }
    // -------------------------------------------------------------------------

    /**
     * Converts Edge params into params that a Group primitive can accept
     * @param params Edge params
     * @returns Group params
     */
    public _to_group_params(params: object): object {
        let output: object = {
            "name": this._get_name(params),
            "visible": params["visible"],
            "scale/x": params["scale/x"],
            "scale/y": params["scale/y"],
            "scale/z": params["scale/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    /**
     * Converts Edge params into params that a Cylinder primitive can accept.
     * Set's height to 6X the radius and the top radius to 4X of the given radius.
     * @param params Edge params
     * @returns Cylinder params
     */
    private __to_arrow_params(edge: object): object {
        let output: object = {
            "name": this._get_name(edge),
            "translate/x": this.__get_center(edge).x,
            "translate/y": this.__get_center(edge).y,
            "translate/z": this.__get_center(edge).z,
            "rotate/x": this.__get_rotate(edge).x,
            "rotate/y": this.__get_rotate(edge).y,
            "rotate/z": this.__get_rotate(edge).z,
            "radius/top": edge["radius"] * 4,
            "radius/bottom": edge["radius"],
            "height": edge["radius"] * 6,
            "color/hue": edge["color/hue"],
            "color/saturation": edge["color/saturation"],
            "color/value": edge["color/value"],
            "color/alpha": edge["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    /**
     * Converts Edge params into params that a Cylinder primitive can accept.
     * Set's "color/value" to half its given input.
     * @param params Edge params
     * @returns Cylinder params
     */
    private __to_body_params(edge: object): object {
        let output: object = {
            "name": this._get_name(edge),
            "translate/x": this.__get_center(edge).x,
            "translate/y": this.__get_center(edge).y,
            "translate/z": this.__get_center(edge).z,
            "rotate/x": this.__get_rotate(edge).x,
            "rotate/y": this.__get_rotate(edge).y,
            "rotate/z": this.__get_rotate(edge).z,
            "radius/top": edge["radius"],
            "radius/bottom": edge["radius"],
            "height": this.__get_l2_distance(edge),
            "color/hue": edge["color/hue"],
            "color/saturation": edge["color/saturation"],
            "color/value": edge["color/value"] * 0.5,
            "color/alpha": edge["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    /**
     * Converts Edge params into params that a Sphere primitive can accept.
     * Component is not visible and has a radius of 0.1.
     * @param params Edge params
     * @returns Sphere params
     */
    private __to_source_params(edge: object): object {
        let output: object = {
            "name": this._get_name(edge),
            "visible": false,
            "radius": 0.1,
            "translate/x": edge["source/translate/x"],
            "translate/y": edge["source/translate/y"],
            "translate/z": edge["source/translate/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    /**
     * Converts Edge params into params that a Sphere primitive can accept.
     * Component is not visible and has a radius of 0.1.
     * @param params Edge params
     * @returns Sphere params
     */
    private __to_destination_params(edge: object): object {
        let output: object = {
            "name": this._get_name(edge),
            "visible": false,
            "radius": 0.1,
            "translate/x": edge["destination/translate/x"],
            "translate/y": edge["destination/translate/y"],
            "translate/z": edge["destination/translate/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }
    // -------------------------------------------------------------------------

    /**
     * Default params for Edge component
     */
    public get _default_params(): object {
        return {
            "name": "edge",
            "visible": true,
            "source/translate/x": 0,
            "source/translate/y": 1,
            "source/translate/z": 0,
            "destination/translate/x": 0,
            "destination/translate/y": 0,
            "destination/translate/z": 0,
            "scale/x": 1,
            "scale/y": 1,
            "scale/z": 1,
            "radius": 0.05,
            "color/hue": cyan2.h,
            "color/saturation": cyan2.s,
            "color/value": cyan2.v,
            "color/alpha": cyan2.a,
        };
    }

    /**
     * Creates group, body, arrow, source and destination primitives and assigns
     * them to children
     * @param params Edge params
     * @param parent Parent component
     */
    public create(params: IEdgeParams, parent: any): void {
        super.create(params, parent);
        const temp: IEdgeParams = this._clean_params(params);

        const body: Cylinder = new Cylinder(this._scene);
        body.create(this.__to_body_params(temp), this.item);
        this.add_component_id(body);
        this.set_primitive("body", body);

        const arrow: Cylinder = new Cylinder(this._scene);
        arrow.create(this.__to_arrow_params(temp), this.item);
        this.add_component_id(arrow);
        this.set_primitive("arrow", arrow);

        const source: Sphere = new Sphere(this._scene);
        source.create(this.__to_source_params(temp), this.item);
        this.add_component_id(source);
        this.set_primitive("source", source);

        const destination: Sphere = new Sphere(this._scene);
        destination.create(this.__to_destination_params(temp), this.item);
        this.add_component_id(destination);
        this.set_primitive("destination", destination);

        this.__source_id = params["source/id"];
        this.__destination_id = params["destination/id"];
    }

    /**
     * Read params from each child and combine into edge params object
     * @returns Edge params garnered from primitives
     */
    public read(): IEdgeParams {
        const src = this.get_primitive("source").read();
        const dst = this.get_primitive("destination").read();
        const body = this.get_primitive("body").read();
        const grp = this.item.read();

        let params: IEdgeParams = {
            "name": grp["name"],
            "type": "edge",
            "visible": grp["visible"],
            "source/id": this.__source_id,
            "source/translate/x": src["translate/x"],
            "source/translate/y": src["translate/y"],
            "source/translate/z": src["translate/z"],
            "destination/id": this.__destination_id,
            "destination/translate/x": dst["translate/x"],
            "destination/translate/y": dst["translate/y"],
            "destination/translate/z": dst["translate/z"],
            "scale/x": grp["scale/x"],
            "scale/y": grp["scale/y"],
            "scale/z": grp["scale/z"],
            "radius": body["radius/top"],
            "color/hue": dst["color/hue"],
            "color/saturation": dst["color/saturation"],
            "color/value": dst["color/value"],
            "color/alpha": dst["color/alpha"],
        };
        params = three_tools.remove_empty_keys(params);
        return params;
    }

    /**
     * Determines whether params require a destructive update
     * @param params Edge params
     * @returns True if id or translate/[x, y, z] fields are included
     */
    public _is_destructive(params: IEdgeParams): boolean {
        const items: string[] = [
            "source/id",
            "source/translate/x",
            "source/translate/y",
            "source/translate/z",
            "destination/id",
            "destination/translate/x",
            "destination/translate/y",
            "destination/translate/z",
        ];
        for (const key of _.keys(params)) {
            if (items.includes(key)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Updates primitives according to params. Currently fully destructive.
     * @param params Edge params
     */
    public update(params: IEdgeParams): void {
        const parent: any = this.parent;
        const new_params: IEdgeParams = this.read();
        Object.assign(new_params, params);
        this.delete();
        this.create(new_params, parent);

        // TODO: determine if this component can be nondestructuve
        // let edge: object = this.read();
        // edge = three_tools.resolve_params(params, edge);

        // this.item.update(this._to_group_params(edge));
        // this.get_primitive("body").update(this.__to_body_params(edge));
        // this.get_primitive("arrow").update(this.__to_arrow_params(edge));
        // this.get_primitive("source").update(this.__to_source_params(edge));
        // this.get_primitive("destination").update(this.__to_destination_params(edge));

        // this.__source_id = params["source/id"];
        // this.__destination_id = params["destination/id"];
    }
}
