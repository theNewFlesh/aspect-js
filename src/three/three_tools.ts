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

export const COLOR_KEYS: string[] = [
    "color/hue",
    "color/saturation",
    "color/value",
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
    "color/value"?: number;
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

export function to_radians(angle: number): number {
    return (angle / 360) * Math.PI * 2;
}

export function to_angle(radian: number): number {
    return (radian / (Math.PI * 2)) * 360;
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

export interface IRGB {
    r: number;
    g: number;
    b: number;
}

export interface IHSV {
    h: number;
    s: number;
    v: number;
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes hsv is in the 0...1 space
 * returns rgb is in the 0...255 space
 *
 * @param IRGB object with r,g,b keys
 * @return IHSV object with h,s,v keys
 */
export function rgb_to_hsv(rgb: IRGB): IHSV {
    const r: number = rgb.r / 255;
    const g: number = rgb.g / 255;
    const b: number = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d = max - min;

    // hue
    let h: number;
    if (max === min) {
        h = 0;
    }
    else if (max === r) {
        h = 60 * (0 + ((g - b) / d));
    }
    else if (max === g) {
        h = 60 * (2 + ((b - r) / d));
    }
    else if (max === b) {
        h = 60 * (4 + ((r - g) / d));
    }
    if (h < 0) {
        h += 360;
    }
    h /= 360;

    // saturation
    let s: number;
    if (max === 0) {
        s = 0;
    }
    else {
        s = d / max;
    }

    // value
    const v = max;

    return {
        h: h,
        s: s,
        v: v,
    };
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes hsv is in the 0...1 space
 * returns rgb is in the 0...255 space
 *
 * @param IHSV object with h,s,v keys
 * @return IRGB object with r,g,b keys
 */
export function hsv_to_rgb(hsv: IHSV): IRGB {
    const h: number = hsv.h;
    const s: number = hsv.s;
    const v: number = hsv.v;

    const hp: number = h * 360 / 60;

    const c = v * s;
    const x = c * (1 - Math.abs((hp % 2) - 1));

    let rgb: number[] = [];

    if (h === undefined) {
        rgb = [0, 0, 0];
    }
    else if (0 <= hp && hp <= 1) {
        rgb = [c, x, 0];
    }
    else if (1 <= hp && hp <= 2) {
        rgb = [x, c, 0];
    }
    else if (2 <= hp && hp <= 3) {
        rgb = [0, c, x];
    }
    else if (3 <= hp && hp <= 4) {
        rgb = [0, x, c];
    }
    else if (4 <= hp && hp <= 5) {
        rgb = [x, 0, c];
    }
    else if (5 <= hp && hp <= 6) {
        rgb = [c, 0, x];
    }

    const m: number = v - c;
    rgb = rgb.map(x => x + m);
    rgb = rgb.map(x => x * 255);
    return {
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
    };
    // const i = Math.floor(h * 6);
    // const f = h * 6 - i;
    // const p = v * (1 - s);
    // const q = v * (1 - f * s);
    // const t = v * (1 - (1 - f) * s);

    // switch (i % 6) {
    //     case 0: r = v, g = t, b = p; break;
    //     case 1: r = q, g = v, b = p; break;
    //     case 2: r = p, g = v, b = t; break;
    //     case 3: r = p, g = q, b = v; break;
    //     case 4: r = t, g = p, b = v; break;
    //     case 5: r = v, g = p, b = q; break;
    // }

    // r *= 255;
    // g *= 255;
    // b *= 255;

    // return {
    //     r: r,
    //     g: g,
    //     b: b,
    // };
}
