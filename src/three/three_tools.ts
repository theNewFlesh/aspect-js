import * as _ from "lodash";
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

export const START_KEYS: string[] = [
    "start/translate/x",
    "start/translate/y",
    "start/translate/z",
];

export const STOP_KEYS: string[] = [
    "stop/translate/x",
    "stop/translate/y",
    "stop/translate/z",
];

export const COLOR_KEYS: string[] = [
    "color/hue",
    "color/saturation",
    "color/value",
    "color/alpha",
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
    "visible"?: boolean;
    "color/hue"?: number;
    "color/saturation"?: number;
    "color/value"?: number;
    "color/alpha"?: number;
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

interface IVector {
    x?: number;
    y?: number;
    z?: number;
}
// -----------------------------------------------------------------------------

export function to_radians(angle: number): number {
    return (angle / 360) * Math.PI * 2;
}

export function to_angle(radian: number): number {
    return radian * (180 / Math.PI);
}

export function to_l2_distance(v0: IVector, v1: IVector): number {
    const x0: number = v0.x || 0;
    const y0: number = v0.y || 0;
    const z0: number = v0.z || 0;

    const x1: number = v1.x || 0;
    const y1: number = v1.y || 0;
    const z1: number = v1.z || 0;

    const dx: number = Math.pow(x0 - x1, 2);
    const dy: number = Math.pow(y0 - y1, 2);
    const dz: number = Math.pow(z0 - z1, 2);
    const distance: number =  Math.sqrt(dx + dy + dz);

    return distance;
}

export function get_center(v0: IVector3, v1: IVector3): IVector3 {
    return {
        x: (v0.x + v1.x) / 2,
        y: (v0.y + v1.y) / 2,
        z: (v0.z + v1.z) / 2,
    };
}

export function get_rotation(v0: IVector3, v1: IVector3): IVector3 {
    const adj: number = Math.sqrt(Math.pow(v1.x - v0.x, 2));
    const hyp: number = to_l2_distance(v0, v1);
    let angle: number = Math.acos(adj / hyp);
    angle = to_angle(angle);

    const q1: boolean = v0.x < v1.x && v0.y < v1.y;
    const q2: boolean = v0.x < v1.x && v0.y > v1.y;
    const q3: boolean = v0.x > v1.x && v0.y > v1.y;
    const q4: boolean = v0.x > v1.x && v0.y < v1.y;
    const horizontal: boolean = v0.x === v1.x;
    const vertical: boolean = v0.y === v1.y;

    if (horizontal) {
        angle = 90;
    }
    else if (vertical) {
        angle = 0;
    }
    else if (q1) {
        angle = 90 + angle;
    }
    else if (q2) {
        angle = 90 - angle;
    }
    else if (q3) {
        angle = 270 + angle;
    }
    else if (q4) {
        angle = 270 - angle;
    }

    return {
        x: 0,
        y: 0,
        z: angle,
    };
}

export function is_array(item): boolean {
    return item instanceof Array;
}

export function diff_params(a: IParams, b: IParams): IParams {
    const output: IParams = {};
    for (const key of _.keys(a)) {
        if (a[key] !== b[key]) {
            output[key] = a[key];
        }
    }
    return output;
}

export function update_params(partial_params: object, full_params: object): object {
    const params: object = _.clone(full_params);
    Object.assign(params, partial_params);
    return params;
}

export function remove_group_keys(params: object): object {
    const output: object = _.clone(params);
    delete output["name"];
    delete output["visible"];
    delete output["translate/x"];
    delete output["translate/y"];
    delete output["translate/z"];
    delete output["rotate/x"];
    delete output["rotate/y"];
    delete output["rotate/z"];
    delete output["scale/x"];
    delete output["scale/y"];
    delete output["scale/z"];
    return output;
}

export function remove_nongroup_keys(params: object): object {
    const temp: object = remove_group_keys(params);
    const output: object = {};
    for (const key of _.keys(temp)) {
        if (!_.keys(params).includes(key)) {
            output[key] = params[key];
        }
    }
    return output;
}

export function resolve_params(new_params: any, old_params: any): any {
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

        if (START_KEYS.includes(key)) {
            keys = _.concat(keys, START_KEYS);
        }

        if (STOP_KEYS.includes(key)) {
            keys = _.concat(keys, STOP_KEYS);
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
