import * as _ from "lodash";
import * as THREE from "three";
import * as uuidv4 from "uuid/v4";
import * as tools from "../core/tools";
import * as three_tools from "./three_tools";
// -----------------------------------------------------------------------------

export class PrimitiveBase {
    private __id: string;
    public _container: any;
    public _item: any;
    public _three_id: string;

    public constructor(container: any) {
        this._container = container;
        this.__id = uuidv4();
    }
    // -------------------------------------------------------------------------

    private __get_translate(): three_tools.IVector3 {
        let vect: number[] = this._item.position.toArray();
        vect = vect.map(x => x === undefined ? 0 : x);
        const output: three_tools.IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
        return output;
    }

    private __get_rotate(): three_tools.IVector3 {
        let vect: number[] = this._item.rotation.toArray();
        vect.pop();
        vect = vect.map(x => x === undefined ? 0 : x);
        vect = vect.map(three_tools.to_angle);
        const output: three_tools.IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
        return output;
    }

    private __get_scale(): three_tools.IVector3 {
        let vect: number[] = this._item.scale.toArray();
        vect = vect.map(x => x === undefined ? 1 : x);
        const output: three_tools.IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
        return output;
    }

    private __get_color(): any {
        let rgb;
        if (three_tools.is_array(this._item.material)) {
            rgb = this._item.material[5].color.toArray();
        }
        else {
            rgb = this._item.material.color.toArray();
        }
        rgb = {
            r: rgb[0],
            g: rgb[1],
            b: rgb[2],
        };
        return tools.rgba_to_hsva(rgb);
    }

    private __set_name(params: three_tools.IParams): void {
        this._item.name = params["name"];
    }

    private __set_visible(params: three_tools.IParams): void {
        this._item.visible = params["visible"];
    }

    private __set_translate(params: three_tools.IParams): void {
        this._item.position.set(
            params["translate/x"],
            params["translate/y"],
            params["translate/z"],
        );
    }

    private __set_rotate(params: three_tools.IParams): void {
        const rot: THREE.Euler = new THREE.Euler(
            three_tools.to_radians(params["rotate/x"]),
            three_tools.to_radians(params["rotate/y"]),
            three_tools.to_radians(params["rotate/z"]),
            "XYZ",
        );
        this._item.setRotationFromEuler(rot);
    }

    private __set_scale(params: three_tools.IParams): void {
        this._item.scale.set(
            params["scale/x"],
            params["scale/y"],
            params["scale/z"],
        );
    }

    public __set_color(params: three_tools.IParams): void {
        const hsva: tools.IHSVA = {
            h: params["color/hue"],
            s: params["color/saturation"],
            v: params["color/value"],
            a: params["color/alpha"],
        };
        const rgba: any = tools.hsva_to_rgba(hsva);
        const rgb = [rgba.r, rgba.g, rgba.b];
        if (three_tools.is_array(this._item.material)) {
            this._item.material[5].color.setRGB(...rgb);
            this._item.material[5].opacity = rgba.a;
        }
        else {
            this._item.material.color.setRGB(...rgb);
            this._item.material.opacity = rgba.a;
        }
    }
    // -------------------------------------------------------------------------

    public _create_item(params: three_tools.IParams): any {
        throw new Error("method must be defined in subclass");
    }

    public _is_destructive(params: three_tools.IParams): boolean {
        throw new Error("method must be defined in subclass");
    }

    private __default_params = {
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

    public create(params: three_tools.IParams = {}): void {
        const new_params: three_tools.IParams = three_tools.resolve_params(
            params, this.__default_params
        );
        const item = this._create_item(new_params);
        this._three_id = item.uuid;
        this._container.add(item);
        this._item = item;
        this._non_destructive_update(new_params);
    }

    public read(): three_tools.IParams {
        const item = this._item;
        const geo = this._item.geometry;
        const params: three_tools.IParams = {
            "id": this.__id,
            "name": item.name,
            "visible": item.visible,
            "color/hue": this.__get_color().h,
            "color/saturation": this.__get_color().s,
            "color/value": this.__get_color().v,
            "color/alpha": item.material.opacity,
            "translate/x": this.__get_translate().x,
            "translate/y": this.__get_translate().y,
            "translate/z": this.__get_translate().z,
            "rotate/x": this.__get_rotate().x,
            "rotate/y": this.__get_rotate().y,
            "rotate/z": this.__get_rotate().z,
            "scale/x": this.__get_scale().x,
            "scale/y": this.__get_scale().y,
            "scale/z": this.__get_scale().z,
        };
        return params;
    }

    public update(params: three_tools.IParams): void {
        const old_params: three_tools.IParams = this.read();
        const new_params: three_tools.IParams = three_tools.resolve_params(params, old_params);
        if (_.keys(new_params).length === 0) {
            return;
        }

        if (this._is_destructive(new_params)) {
            Object.assign(old_params, new_params);
            this.delete();
            this.create(old_params);
        }
        else {
            this._non_destructive_update(new_params);
        }
    }

    public _non_destructive_update(params: three_tools.IParams): void {
        const keys: string[] = _.keys(params);
        if (_.intersection(three_tools.TRANSLATE_KEYS, keys).length > 0) {
            this.__set_translate(params);
        }

        if (_.intersection(three_tools.ROTATE_KEYS, keys).length > 0) {
            this.__set_rotate(params);
        }

        if (_.intersection(three_tools.SCALE_KEYS, keys).length > 0) {
            this.__set_scale(params);
        }

        if (_.intersection(three_tools.COLOR_KEYS, keys).length > 0) {
            this.__set_color(params);
        }

        if (keys.includes("name")) {
            this.__set_name(params);
        }

        if (keys.includes("visible")) {
            this.__set_visible(params);
        }
    }

    public delete(): void {
        this._container.remove(this._item);
    }
}
