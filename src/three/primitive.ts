import * as _ from "lodash";
import * as tools from "../core/tools";
import * as three_tools from "./three_tools";
import { PrimitiveBase } from "./primitive_base";
import { IParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * CRUD wrapper for all ThreeJS items used by Aspect.
 * Primitives are instantiated with a THREE.Scene item.
 * They can be parented to other primitives.
 * All CRUD methods receive a params object specific to the primitive class,
 * resolve, validate, diff and apply this data to appropriate ThreeJS items.
 */
export class Primitive extends PrimitiveBase {
    /**
     * Name of class in lowercase. Overwritten in subclass.
     */
    public _class: string = "primitive";

    /**
     * Reads material color of ThreeJS item and convert it into RGB object
     * @returns Object with r, g, b keys
     */
    private __get_color(): any {
        let rgb;
        if (tools.is_array(this.three_item.material)) {
            rgb = this.three_item.material[5].color.toArray();
        }
        else {
            rgb = this.three_item.material.color.toArray();
        }
        rgb = {
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
        };
        return tools.rgba_to_hsva(rgb);
    }

    /**
     * Set's color of ThreeJS item's material
     * @param params Object wih color/[hue, saturation, value, alpha] fields
     */
    private __set_color(params: IParams): void {
        const hsva: tools.IHSVA = {
            h: params["color/hue"],
            s: params["color/saturation"],
            v: params["color/value"],
            a: params["color/alpha"],
        };
        const rgba: any = tools.hsva_to_rgba(hsva);
        const rgb = [rgba.r, rgba.g, rgba.b];
        if (tools.is_array(this.three_item.material)) {
            this.three_item.material[5].color.setRGB(...rgb);
            this.three_item.material[5].opacity = rgba.a;
        }
        else {
            this.three_item.material.color.setRGB(...rgb);
            this.three_item.material.opacity = rgba.a;
        }
    }
    // -------------------------------------------------------------------------

    /**
     * Default values for fields of params.
     * Fields include: name, visibile, color/*, translate/*, rotate/*, scale/*
     */
    public get _default_params(): object {
        return {
            "name": "",
            "visible": true,
            "color/hue": 0,
            "color/saturation": 0,
            "color/value": 1,
            "color/alpha": 1,
            "translate/x": 0,
            "translate/y": 0,
            "translate/z": 0,
            "rotate/x": 0,
            "rotate/y": 0,
            "rotate/z": 0,
            "scale/x": 1,
            "scale/y": 1,
            "scale/z": 1,
        };
    }

    /**
     * Read values from ThreeJS item and return them as a params object
     */
    public read(): IParams {
        const params: any = super.read();
        params["color/hue"] = this.__get_color().h;
        params["color/saturation"] = this.__get_color().s;
        params["color/value"] = this.__get_color().v;
        params["color/alpha"] = this.three_item.material.opacity;
        return params;
    }

    /**
     * @param params Params object
     * @returns true if params contains color fields
     */
    public _non_destructive_update(params: IParams): void {
        super._non_destructive_update(params);
        const keys: string[] = _.keys(params);
        if (_.intersection(three_tools.COLOR_KEYS, keys).length > 0) {
            this.__set_color(params);
        }
    }
}
