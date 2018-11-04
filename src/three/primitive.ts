import * as _ from "lodash";
import * as THREE from "three";
import * as uuidv4 from "uuid/v4";
// -----------------------------------------------------------------------------

export const TRANSLATE_KEYS: string[] = [
    "translate/x",
    "translate/y",
    "translate/z",
];

export const ROTATE_KEYS: string[] = [
    "rotate/x",
    "rotate/y",
    "rotate/z",
];

export const SCALE_KEYS: string[] = [
    "scale/x",
    "scale/y",
    "scale/z",
];

export const COLOR_KEYS: string[] = [
    "color/hue",
    "color/saturation",
    "color/luminance",
];

export const FONT_KEYS: string[] = [
    "font/text",
    "font/family",
    "font/style",
    "font/size",
];
// -----------------------------------------------------------------------------

export interface IParams {
    "id"?: string;
    "name"?: string;
    "opacity"?: number;
    "visible"?: boolean;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/luminance"?: number;
    "translate/x"?: number;
    "translate/y"?: number;
    "translate/z"?: number;
    "rotate/x"?: number;
    "rotate/y"?: number;
    "rotate/z"?: number;
    "scale/x"?: number;
    "scale/y"?: number;
    "scale/z"?: number;
    "font/text"?: string;
    "font/family"?: string;
    "font/style"?: string;
    "font/size"?: number;
    "radius"?: number;
}

export interface IVector3 {
    x: number;
    y: number;
    z: number;
}
// -----------------------------------------------------------------------------

function to_radians(angle: number): number {
    return (angle / 360) * Math.PI * 2;
}

function to_angle(radian: number): number {
    return (radian / (Math.PI * 2)) * 360;
}

function to_translate(item): IVector3 {
    const vect: number[] = item.position.toArray();
    const output: IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
    return output;
}

function to_rotate(item): IVector3 {
    let vect: number[] = item.quaternion.toArray();
    vect = vect.map(to_angle);
    const output: IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
    return output;
}

function to_scale(item): IVector3 {
    const vect: number[] = item.scale.toArray();
    const output: IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
    return output;
}

function diff_params(a: IParams, b: IParams): IParams {
    const output: IParams = {};
    for (const key of _.keys(a)) {
        if (a[key] !== b[key]) {
            output[key] = a[key];
        }
    }
    return output;
}

function resolve_params(new_params: any, old_params: any): any {
    const diff = diff_params(new_params, old_params);
    let keys: string[] = _.keys(diff);

    for (const key of keys) {
        if (TRANSLATE_KEYS.includes(key)) {
            keys = _.concat(keys, TRANSLATE_KEYS);
        }

        if (ROTATE_KEYS.includes(key)) {
            keys = _.concat(keys, ROTATE_KEYS);
        }

        if (SCALE_KEYS.includes(key)) {
            keys = _.concat(keys, SCALE_KEYS);
        }

        if (COLOR_KEYS.includes(key)) {
            keys = _.concat(keys, COLOR_KEYS);
        }

        if (FONT_KEYS.includes(key)) {
            keys = _.concat(keys, FONT_KEYS);
        }
    }
    keys = _.uniq(keys);

    const new_keys: string[] = _.keys(new_params);

    const output: IParams = {};
    for (const key of keys) {
        if (new_keys.includes(key)) {
            output[key] = new_params[key];
        }
        else {
            output[key] = old_params[key];
        }
    }
    return output;
}
// -----------------------------------------------------------------------------

export class Primitive {
    private __id: string;
    public _scene: THREE.Scene;
    public _item: any;
    public _three_id: string;

    public constructor(scene: THREE.Scene) {
        this._scene = scene;
        this.__id = uuidv4();
    }
    // -------------------------------------------------------------------------

    // private __set_id(params: IParams): void {
    //     this._item.uuid = params["id"];
    // }

    private __set_name(params: IParams): void {
        this._item.name = params["name"];
    }

    private __set_visible(params: IParams): void {
        this._item.visible = params["visible"];
    }

    private __set_opacity(params: IParams): void {
        this._item.opacity = params["opacity"];
    }

    private __set_translate(params: IParams): void {
        this._item.position.set(
            params["translate/x"],
            params["translate/y"],
            params["translate/z"],
        );
    }

    private __set_rotate(params: IParams): void {
        const rot: THREE.Euler = new THREE.Euler(
            to_radians(params["rotate/x"]),
            to_radians(params["rotate/y"]),
            to_radians(params["rotate/z"]),
            "XYZ",
        );
        this._item.setRotationFromEuler(rot);
    }

    private __set_scale(params: IParams): void {
        this._item.scale.set(
            params["scale/x"],
            params["scale/y"],
            params["scale/z"],
        );
    }

    private __set_color(params: IParams): void {
        this._item.material.color.setHSL(
            params["color/hue"],
            params["color/saturation"],
            params["color/luminance"],
        );
    }
    // -------------------------------------------------------------------------

    public _create_item(params: IParams): any {
        throw new Error("method must be defined in subclass");
    }

    public _is_destructive(params: IParams): boolean {
        throw new Error("method must be defined in subclass");
    }

    public create(params: IParams = {}): void {
        const item = this._create_item(params);
        this._three_id = item.uuid;
        this._scene.add(item);
        this._item = item;
        this._non_destructive_update(params);
    }

    public read(): IParams {
        const item = this._item;
        const geo = this._item.geometry;
        const params: IParams = {
            // "id": item.uuid,
            "id": this.__id,
            "name": item.name,
            "opacity": item.material.opacity,
            "visible": item.visible,
            "color/hue": item.material.color.getHSL({}).h,
            "color/saturation": item.material.color.getHSL({}).s,
            "color/luminance": item.material.color.getHSL({}).l,
            "translate/x": to_translate(item).x,
            "translate/y": to_translate(item).y,
            "translate/z": to_translate(item).z,
            "rotate/x": to_rotate(item).x,
            "rotate/y": to_rotate(item).y,
            "rotate/z": to_rotate(item).z,
            "scale/x": to_scale(item).x,
            "scale/y": to_scale(item).y,
            "scale/z": to_scale(item).z,
        }
        return params;
    }

    public update(params: IParams): void {
        const old_params: IParams = this.read();
        const new_params: IParams = resolve_params(params, old_params);

        if (this._is_destructive(new_params)) {
            Object.assign(old_params, new_params);
            this.delete();
            this.create(old_params);
        }
        else {
            this._non_destructive_update(new_params);
        }
    }

    public _non_destructive_update(params: IParams): void {
        const keys: string[] = _.keys(params);
        if (_.intersection(TRANSLATE_KEYS, keys).length > 0) {
            this.__set_translate(params);
        }

        if (_.intersection(ROTATE_KEYS, keys).length > 0) {
            this.__set_rotate(params);
        }

        if (_.intersection(SCALE_KEYS, keys).length > 0) {
            this.__set_scale(params);
        }

        if (_.intersection(COLOR_KEYS, keys).length > 0) {
            this.__set_color(params);
        }

        // if (keys.includes("id")) {
        //     this.__set_id(params);
        // }

        if (keys.includes("name")) {
            this.__set_name(params);
        }

        if (keys.includes("visible")) {
            this.__set_visible(params);
        }

        if (keys.includes("opacity")) {
            this.__set_opacity(params);
        }
    }

    public delete(): void {
        this._scene.remove(this._item);
    }
}
