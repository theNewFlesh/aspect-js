import * as _ from "lodash";
import tiny_color from "tinycolor2";
// -----------------------------------------------------------------------------

export function log(item: any): any {
    // tslint:disable-next-line:no-console
    console.log(item);
    return item;
}

export interface IRGBA {
    r: number;
    g: number;
    b: number;
    a?: number;
}

export interface IHSVA {
    h: number;
    s: number;
    v: number;
    a?: number;
}

export function rgba_to_hsva(rgba: IRGBA): IHSVA {
    const color = {
        r: rgba.r * 255,
        g: rgba.g * 255,
        b: rgba.b * 255,
        a: rgba.a,
    };
    const hsva = tiny_color.fromRatio(color).toHsv();
    return {
        h: hsva.h / 360,
        s: hsva.s,
        v: hsva.v,
        a: hsva.a,
    };
}

export function hsva_to_rgba(hsva: IHSVA): IRGBA {
    const color = tiny_color.fromRatio(hsva).toRgb();
    return {
        r: color.r / 255,
        g: color.g / 255,
        b: color.b / 255,
        a: color.a,
    };
}

export function hex_to_rgba(hex: string): IRGBA {
    const color = tiny_color(hex).toRgb();
    return {
        r: color.r / 255,
        g: color.g / 255,
        b: color.b / 255,
        a: 1,
    };
}

export function hex_to_hsva(hex: string): IHSVA {
    return rgba_to_hsva(hex_to_rgba(hex));
}
// -----------------------------------------------------------------------------

export const HEX_COLORS: object = {
    aspect_dark_1:   "#040404",
    aspect_dark_2:   "#141414",
    aspect_bg:       "#242424",
    aspect_grey_1:   "#343434",
    aspect_grey_2:   "#444444",
    aspect_light_1:  "#A4A4A4",
    aspect_light_2:  "#F4F4F4",
    aspect_dialog_1: "#444459",
    aspect_dialog_2: "#5D5D7A",
    aspect_red_1:    "#F77E70",
    aspect_red_2:    "#DE958E",
    aspect_orange_1: "#EB9E58",
    aspect_orange_2: "#EBB483",
    aspect_yellow_1: "#E8EA7E",
    aspect_yellow_2: "#E9EABE",
    aspect_green_1:  "#8BD155",
    aspect_green_2:  "#A0D17B",
    aspect_cyan_1:   "#7EC4CF",
    aspect_cyan_2:   "#B6ECF3",
    aspect_cyan_3:   "#3A4C4F",
    aspect_blue_1:   "#5F95DE",
    aspect_blue_2:   "#93B6E6",
    aspect_purple_1: "#C98FDE",
    aspect_purple_2: "#AC92DE",
    // aspect_hover:    "rgba(126, 196, 207, 0.25)",
};

function __hex_colors_to_hsva(): object {
    const output: object = {};
    for (const key of _.keys(HEX_COLORS)) {
        output[key] = hex_to_hsva(HEX_COLORS[key]);
    }
    return output;
}
export const HSV_COLORS: object = __hex_colors_to_hsva();

export class OrderedDict {
    constructor(items?: object, default_value?) {
        this.default = default_value;
        if (items !== undefined) {
            this._keys = Object.keys(items);
            this._items = items;
        }
    }

    public _keys = [];
    public _items = {};
    public default;

    public get(key) {
        if (this._items[key] === undefined) {
            if (this.default !== undefined) {
                this._items[key] = _.clone(this.default);
                this._keys.push(key);
            }
        }
        return this._items[key];
    }

    public set(key, value) {
        if (this._items[key] === undefined) {
            this._keys.push(key);
        }
        this._items[key] = value;
    }

    public insert(position, key, value) {
        if (this._items[key] !== undefined) {
            this._keys.splice(position, 0, key);
            this._items[key] = value;
        }
    }

    public get items() {
        return _.map(this._keys, (key) => ( [key, this.get(key)] ));
    }

    public get keys(): any[] {
        return this._keys;
    }

    public get values(): any[] {
        const output = [];
        for (const key of this._keys) {
            output.push(this._items[key]);
        }
        return output;
    }

    public get length(): number {
        return this._keys.length;
    }

    public as_object(): object {
        return this._items;
    }
}

export function omit(items, trash) {
    if (!Array.isArray(trash)) {
        trash = [trash];
    }
    const keys = _.filter(
        Object.keys(items),
        (item) => (!trash.includes(item))
    );
    const output = {};
    for (const key in keys) {
        output[key] = items[key];
    }
    return output;
}

export function to_kebab_case(item: string) {
    return item.replace(/_/g, "-");
}

export function conform_name(name: string): string {
    let output: string = name.replace(/_|-/g, " ");
    // probably should remove this at some point
    output = output.replace(/inport ?/, "");
    return output;
}

export function add_attribute(
    selector: string,
    attribute: string,
    value: any
) {
    const elems: any = document.querySelectorAll(selector);
    for (const elem of elems) {
        elem.setAttribute(attribute, value);
    }
}

export function add_style_attribute(
    selector: string, attribute: string, value: any
) {
    const elems: any = document.querySelectorAll(selector);
    for (const elem of elems) {
        let style = elem.getAttribute("style");
        if (style === null) {
            style = "";
        }
        style = style + ` ${attribute}: ${value};`;
        elem.setAttribute("style", style);
    }
}

/**
 * flattens nested objects into objects with character seperated keys
 * @param object object to be flattened
 * @param separator string separator used in keys. Default: "."
 * @param skipArrays don't recurse into Array objects. Default: true
 * example:
 *     >>> const nested = {
 *             "a": {
 *                 "b": 1,
 *                 "c": {
 *                     "d": 2,
 *                 }
 *             }
 *         };
 *     >>> flatten(nested);
 *     {
 *         "a/b": 1,
 *         "a/c/d": 2,
 *     }
 */
export function flatten(
    object: object,
    separator: string = "/",
    skipArrays: boolean = true
): object {
    const output = {};
    for ( const key of _.keys(object) ) {
        if (!object.hasOwnProperty(key)) {
            continue;
        }

        // do not recurse Array keys
        if ( skipArrays && object[key] instanceof Array) {
            output[key] = object[key];
        }
        else if ( (typeof object[key]) === "object" ) {
            const flatObject = flatten(object[key]);
            for (const flatKey in flatObject) {
                if (!flatObject.hasOwnProperty(flatKey)) {
                    continue;
                }
                output[key + separator + flatKey] = flatObject[flatKey];
            }
        }
        else {
            output[key] = object[key];
        }
    }
    return output;
}

    /**
     * transforms flattend objects into nested objects by splitting apart keys
     * @param object object to be flattened
     * @param separator string separator used in keys. Default: "."
     * @param skipArrays don't recurse into Array objects. Default: true
     * example:
     *     >>> const flat = {
     *             "a/b": 1,
     *             "a/c/d": 2,
     *         };
     *     >>> unflatten(flat);
     *     {
     *         "a": {
     *             "b": 1,
     *             "c": {
     *                 "d": 2,
     *             }
     *         }
     *     }
     */
export function unflatten(object, separator: string = "/") {
    const output = {};
    for (const flatKey of _.keys(object)) {
        let cursor = output;
        const keys = _.split(flatKey, separator);
        const lastKey = keys.pop();
        for (const key of keys) {
            if ( !cursor.hasOwnProperty(key) ) {
                cursor[key] = {};
            }
            cursor = cursor[key];
        }
        cursor[lastKey] = object[flatKey];
    }
    return output;
}

export function aggregate(objects, aggregator, separator: string = "/") {
    // flatten all objects
    const flatObjs = _.map( objects, (obj) => (flatten(obj, separator)) );

    // create aggregate objects with arrays as values
    let output = {};
    for (const obj of flatObjs) {
        for ( const key of _.keys(obj) ) {
            if (!output.hasOwnProperty(key)) {
                output[key] = [];
            }
            output[key].push(obj[key]);
        }
    }

    // aggregate each value into scalar
    for ( const key of _.keys(output) ) {
        output[key] = aggregator(output[key]);
    }

    // unflatten object
    output = unflatten(output, separator);

    return output;
}

export function filter(dict: object, predicate: any): object {
    const pairs: any[][] = _.toPairs(dict);
    let output: any = _.filter(pairs, x => predicate(x[0], x[1]));
    const keys: any[] = output.map(x => x[0]);
    const values: any[] = output.map(x => x[1]);
    output = _.zipObject(keys, values);
    return output;
}

export function filter_keys(dict: object, regex: any): object {
    return filter( dict, (k, v) => (k.search(regex) > -1) );
}

export function filter_values(dict: object, predicate: any): object {
    return filter( dict, (k, v) => (predicate(v)) );
}

const components: string[] = [
    "scene_.*/graph_.*/node_.*/ouport_.*/",
    "scene_.*/graph_.*/node_.*/inport_.*/",
    "scene_.*/graph_.*/node_.*/",
    "scene_.*/graph_.*/edge_.*/",
    "scene_.*/graph_.*/",
    "scene_.*/edge_.*/",
    "scene_.*/",
];
const component_re = components.join("|");

export function to_graphs(dict: object): object {
    const temp = unflatten(dict);
    const scene: string = _.keys(temp)[0];
    const graphs = filter_keys(temp[scene], "^graph_.*$");
    const output = {};
    for (const name of _.keys(graphs)) {
        output[name] = flatten(graphs[name]);
    }
    return output;
}
