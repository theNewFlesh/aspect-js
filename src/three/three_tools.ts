import * as _ from "lodash";
import { IParams } from "../core/iparams";
import * as mathjs from "mathjs";
// -----------------------------------------------------------------------------

/**
 * Keys with "translate/" header
 */
export const TRANSLATE_KEYS: string[] = [
    "translate/x",
    "translate/y",
    "translate/z",
];

/**
 * Keys with "rotate/" header
 */
export const ROTATE_KEYS: string[] = [
    "rotate/x",
    "rotate/y",
    "rotate/z",
];

/**
 * Keys with "scale/" header
 */
export const SCALE_KEYS: string[] = [
    "scale/x",
    "scale/y",
    "scale/z",
];

/**
 * Keys with "from/translate/" header
 */
export const FROM_KEYS: string[] = [
    "from/translate/x",
    "from/translate/y",
    "from/translate/z",
];

/**
 * Keys with "to/translate/" header
 */
export const TO_KEYS: string[] = [
    "to/translate/x",
    "to/translate/y",
    "to/translate/z",
];

/**
 * Keys with "color/" header
 */
export const COLOR_KEYS: string[] = [
    "color/hue",
    "color/saturation",
    "color/value",
    "color/alpha",
];

/**
 * Keys with "font/" header
 */
export const FONT_KEYS: string[] = [
    "font/text",
    "font/family",
    "font/style",
    "font/size",
];
// -----------------------------------------------------------------------------

/**
 * 3D (x, y, z) vector interface
 */
export interface IVector3 {
    x: number;
    y: number;
    z: number;
}

/**
 * 3D (x?, y?, z?) vector interface
 */
interface IVector {
    x?: number;
    y?: number;
    z?: number;
}
// -----------------------------------------------------------------------------

/**
 * Converts degrees to radians
 * @param angle Angle in degrees
 * @return radians
 */
export function to_radians(angle: number): number {
    return mathjs.unit(angle, "degree").to("radian").toNumber();
}

/**
 * Converts radians to degrees
 * @param angle Angle in radians
 * @return degrees
 */
export function to_degrees(radian: number): number {
    return mathjs.unit(radian, "radian").to("degree").toNumber();
}

/**
 * Calculate L2 Euclidean distance between two vectors
 * @param v0 Vector of dimension N
 * @param v1 Vector of dimension N
 * @returns Distance
 */
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
    const distance: number = Math.sqrt(dx + dy + dz);

    return distance;
}

/**
 * Calculate centroid between two vectors
 * @param v0 3D vector
 * @param v1 3D vector
 * @returns 3D centroid
 */
export function get_center(v0: IVector3, v1: IVector3): IVector3 {
    return {
        x: (v0.x + v1.x) / 2,
        y: (v0.y + v1.y) / 2,
        z: (v0.z + v1.z) / 2,
    };
}

export function rotate_x(v0: IVector3, degrees: number): IVector3 {
    const theta: number = to_radians(degrees);
    const v1: mathjs.Matrix = mathjs.matrix([v0["x"], v0["y"], v0["z"]]);
    const rot: mathjs.Matrix = mathjs.matrix([
        [1, 0, 0],
        [0, Math.cos(theta), -Math.sin(theta)],
        [0, Math.sin(theta), Math.cos(theta)],
    ]);
    const v2: number[] = mathjs.multiply(v1, rot).toArray();
    const output: IVector3 = {
        x: v2[0],
        y: v2[1],
        z: v2[2],
    };
    return output;
}

export function rotate_y(v0: IVector3, degrees: number): IVector3 {
    const theta: number = to_radians(degrees);
    const v1: mathjs.Matrix = mathjs.matrix([v0["x"], v0["y"], v0["z"]]);
    const rot: mathjs.Matrix = mathjs.matrix([
        [Math.cos(theta), 0, Math.sin(theta)],
        [0, 1, 0],
        [-Math.sin(theta), 0, Math.cos(theta)],
    ]);
    const v2: number[] = mathjs.multiply(v1, rot).toArray();
    const output: IVector3 = {
        x: v2[0],
        y: v2[1],
        z: v2[2],
    };
    return output;
}

export function rotate_z(v0: IVector3, degrees: number): IVector3 {
    const theta: number = to_radians(degrees);
    const v1: mathjs.Matrix = mathjs.matrix([v0["x"], v0["y"], v0["z"]]);
    const rot: mathjs.Matrix = mathjs.matrix([
        [Math.cos(theta), -Math.sin(theta), 0],
        [Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 1],
    ]);
    const v2: number[] = mathjs.multiply(v1, rot).toArray();
    const output: IVector3 = {
        x: v2[0],
        y: v2[1],
        z: v2[2],
    };
    return output;
}

/**
 * Calculate the rotation of an arrow at centroid(v0, v1) would require
 * to point from v0 to v1. Currently, only works in the XY plane.
 * @param v0 Source vector
 * @param v1 Target vector
 * @returns Z axis rotation vector
 */
export function get_rotation(v0: IVector3, v1: IVector3): IVector3 {
    function _get_rotation(p0: any, p1: any): number {
        const adj: number = Math.sqrt(Math.pow(p1.x - p0.x, 2));
        const hyp: number = to_l2_distance(p0, p1);
        let angle: number = Math.acos(adj / hyp);
        angle = to_degrees(angle);

        const q1: boolean = p0.x < p1.x && p0.y < p1.y;
        const q2: boolean = p0.x < p1.x && p0.y > p1.y;
        const q3: boolean = p0.x > p1.x && p0.y > p1.y;
        const q4: boolean = p0.x > p1.x && p0.y < p1.y;
        const up: boolean = p0.x === p1.x && p0.y < p1.y;
        const down: boolean = p0.x === p1.x && p0.y > p1.y;
        const left: boolean = p0.y === p1.y && p0.x < p1.x;
        const right: boolean = p0.y === p1.y && p0.x > p1.x;

        if (up) {
            angle = 180;
        }
        else if (down) {
            angle = 0;
        }
        else if (left) {
            angle = 90;
        }
        else if (right) {
            angle = 270;
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

        return angle;
    }

    return {
        // x: 90 + _get_rotation({x: v0.y, y: v0.z}, {x: v1.y, y: v1.z}),
        // y: 180 + _get_rotation({x: v0.z, y: v0.x}, {x: v1.z, y: v1.x}),
        x: 0,
        y: 0,
        z: _get_rotation({ x: v0.x, y: v0.y }, { x: v1.x, y: v1.y }),
    };
}

/**
 * Removes keys with values of null, undefined or NaN
 * @param params Object with keys to be removed
 * @returns Object without null keys
 */
export function remove_empty_keys(params: object): object {
    const output: object = {};
    for (const key of _.keys(params)) {
        if (![null, undefined, NaN].includes(params[key])) {
            output[key] = params[key];
        }
    }
    return output;
}

/**
 * Subtracts object b from object a based on value
 * @param a Object
 * @param b Object to subtract from a
 * @returns a - b
 */
export function diff_params(a: IParams, b: IParams): IParams {
    const output: IParams = {};
    for (const key of _.keys(a)) {
        if (a[key] !== b[key]) {
            output[key] = a[key];
        }
    }
    return output;
}

/**
 * Assign partial_params to full_params
 * @param partial_params Params to be assigned
 * @param full_params Params to be updated
 * @returns Updated full_params
 */
export function update_params(partial_params: object, full_params: object): object {
    const params: object = _.clone(full_params);
    Object.assign(params, partial_params);
    return params;
}

/**
 * Removes keys that have subfields, such as translate, which has subfields
 * x, y and z
 * @param params Params
 * @returns Params without group keys
 */
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

/**
 * Removes keys that do not have subfields from given params. FOr example,
 * "visibility" would be removed, because it has no keys beneath it.
 * @param params Params
 * @returns Params with only group keys
 */
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

/**
 * Finds diff of new and old params. If diff contains a member of a group key,
 * the other members of that group key are added to diff. Empty keys are also
 * removed.
 * @param new_params Params
 * @param old_params Params to be subtracted from new
 * @returns Cleaned up diff of new and old
 */
export function resolve_params(new_params: any, old_params: any): any {
    const diff = diff_params(new_params, old_params);

    // Add all group key members to keys if sigle group key member found in diff
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

        if (FROM_KEYS.includes(key)) {
            keys = _.concat(keys, FROM_KEYS);
        }

        if (TO_KEYS.includes(key)) {
            keys = _.concat(keys, TO_KEYS);
        }

        if (COLOR_KEYS.includes(key)) {
            keys = _.concat(keys, COLOR_KEYS);
        }

        if (FONT_KEYS.includes(key)) {
            keys = _.concat(keys, FONT_KEYS);
        }
    }
    keys = _.uniq(keys);

    // Effectively update new keys with values of non-included group key members
    // from old_params
    const new_keys: string[] = _.keys(new_params);
    let output: IParams = {};
    for (const key of keys) {
        if (new_keys.includes(key)) {
            output[key] = new_params[key];
        }
        else {
            output[key] = old_params[key];
        }
    }
    output = remove_empty_keys(output);
    return output;
}

/**
 * Convenience function that gets name from params name or display/name key + suffix
 * @param params Params
 * @param suffix Name suffix
 * @returns params[<name key>] + "_" + suffix
 */
export function get_name(params: object, suffix: string): string {
    if (params["name"]) {
        return params["name"] + "_" + suffix;
    }
    else if (params["display/name"]) {
        return params["display/name"] + "_" + suffix;
    }
    return suffix;
}
