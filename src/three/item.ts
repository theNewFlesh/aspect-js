import * as _ from "lodash";
import * as THREE from "three";
// -----------------------------------------------------------------------------

const TRANSLATE_KEYS: string[] = [
    "translate.x",
    "translate.y",
    "translate.z",
];

const ROTATE_KEYS: string[] = [
    "rotate.x",
    "rotate.y",
    "rotate.z",
    "rotate.w",
];

const SCALE_KEYS: string[] = [
    "scale.x",
    "scale.y",
    "scale.z",
];

const COLOR_KEYS: string[] = [
    "color.hue",
    "color.saturation",
    "color.luminance",
];
// -----------------------------------------------------------------------------

interface IVector3 {
    x: number;
    y: number;
    z: number;
}

interface IVector4 {
    x: number;
    y: number;
    z: number;
    w: number;
}

function to_translate(item): IVector3 {
    const vect: number[] = item.position.toArray();
    const output: IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
    return output;
}

function to_rotate(item): IVector4 {
    const vect: number[] = item.quaternion.toArray();
    const output: IVector4 = {x: vect[0], y: vect[1], z: vect[2], w: vect[3]};
    return output;
}

function to_scale(item): IVector3 {
    const vect: number[] = item.scale.toArray();
    const output: IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
    return output;
}

function diff_params(a: object, b: object): object {
    const output: object = {};
    for (const key of _.keys(b)) {
        if (a.hasOwnProperty(key)) {
            if (a[key] === b[key]) {
                output[key] = b[key];
            }
        }
    }
    return output;
}

function resolve_params(params: any, old_params: any): any {
    const diff = diff_params(params, old_params);
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
    }
    keys = _.uniq(keys);

    const old_keys: string[] = _.keys(params);

    const output: object = {};
    for (const key of keys) {
        if (old_keys.includes(key)) {
            output[key] = params[key];
        }
        else {
            output[key] = old_params[key];
        }
    }
    return output;
}
// -----------------------------------------------------------------------------

export class Item {
    private __scene: THREE.Scene;
    private __params: object;
    private __item;

    public constructor(scene: THREE.Scene, params: any) {
        this.__scene = scene;
        this.__params = params;
    }

    public create(): void {
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0x7ec4cf,
            transparent: true
        });
        const item = new THREE.Mesh(geo, material);
        this.__scene.add(item);
        this.__item = item;
    }

    public read(): object {
        const item = this.__item;
        const geo = this.__item.geometry;
        const params: object = {
            id: item.uuid,
            name: item.name,
            opacity: item.material.opacity,
            visible: item.visible,
            "color.hue": item.material.color.getHSL().h,
            "color.saturation": item.material.color.getHSL().s,
            "color.luminance": item.material.color.getHSL().l,
            "translate.x": to_translate(item).x,
            "translate.y": to_translate(item).y,
            "translate.z": to_translate(item).z,
            "rotate.x": to_rotate(item).x,
            "rotate.y": to_rotate(item).y,
            "rotate.z": to_rotate(item).z,
            "rotate.w": to_rotate(item).w,
            "scale.x": to_scale(item).x,
            "scale.y": to_scale(item).y,
            "scale.z": to_scale(item).z,
        }
        return params;
    }

    private __set_id(params: any): void {
        this.__item.uuid = params.id;
    }

    private __set_name(params: any): void {
        this.__item.name = params.name;
    }

    private __set_visible(params: any): void {
        this.__item.visible = params.visible;
    }

    private __set_opacity(params: any): void {
        this.__item.opacity = params.opacity;
    }

    private __set_translate(params: any): void {
        this.__item.translateX(params.translate.x);
        this.__item.translateY(params.translate.y);
        this.__item.translateZ(params.translate.z);
    }

    private __set_rotate(params: any): void {
        const rot: THREE.Quaternion = new THREE.Quaternion(
            params.rotate.x,
            params.rotate.y,
            params.rotate.z,
            params.rotate.w,
        );
        this.__item.setRotationFromQuaternion(rot);
    }

    private __set_scale(params: any): void {
        this.__item.scale.set(
            params.scale.x,
            params.scale.y,
            params.scale.z,
        );
    }

    private __set_color(params: any): void {
        this.__item.material.color.setHSL(
            params.hue,
            params.saturation,
            params.luminance,
        );
    }

    public update(params: object): void {
        const old_params: object = this.read();
        const new_params: object = resolve_params(params, old_params);

        const keys: string[] = _.keys(new_params);
        if (_.intersection(TRANSLATE_KEYS, keys).length > 0) {
            this.__set_translate(new_params);
        }

        if (_.intersection(ROTATE_KEYS, keys).length > 0) {
            this.__set_rotate(new_params);
        }

        if (_.intersection(SCALE_KEYS, keys).length > 0) {
            this.__set_scale(new_params);
        }

        if (_.intersection(COLOR_KEYS, keys).length > 0) {
            this.__set_color(new_params);
        }

        if (keys.includes("id")) {
            this.__set_id(new_params);
        }

        if (keys.includes("name")) {
            this.__set_name(new_params);
        }

        if (keys.includes("visible")) {
            this.__set_visible(new_params);
        }

        if (keys.includes("opacity")) {
            this.__set_opacity(new_params);
        }
    }

    public delete(): void {
        this.__scene.remove(this.__item);
    }
}
