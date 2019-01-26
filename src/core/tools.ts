import * as _ from "lodash";
import tiny_color from "tinycolor2";
// -----------------------------------------------------------------------------
/**
 * Convenience function for logging things
 * @param item item to be logged
 */
export function log(item: any): any {
    // tslint:disable-next-line:no-console
    console.log(item);
    return item;
}

/**
 * Interface for RGBA color data
 */
export interface IRGBA {
    r: number;
    g: number;
    b: number;
    a?: number;
}

/**
 * Interface for HSVA color data
 */
export interface IHSVA {
    h: number;
    s: number;
    v: number;
    a?: number;
}

/**
 * Convert RGBA data to HSVA data (RGB are multiplied by 255)
 * @param rgba IRGBA color data
 * @returns HSVA object 
 */
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

/**
 * Convert HSVA data to RGBA data (divides HSV by 255)
 * @param hsva IHSVA color data
 * @returns RGBA object
 */
export function hsva_to_rgba(hsva: IHSVA): IRGBA {
    const color = tiny_color.fromRatio(hsva).toRgb();
    return {
        r: color.r / 255,
        g: color.g / 255,
        b: color.b / 255,
        a: color.a,
    };
}

/**
 * Converts HEX color data to RGBA data (A is 1)
 * @param hex Hexidecimal string
 * @returns RGBA object
 */
export function hex_to_rgba(hex: string): IRGBA {
    const color = tiny_color(hex).toRgb();
    return {
        r: color.r / 255,
        g: color.g / 255,
        b: color.b / 255,
        a: 1,
    };
}

/**
 * Converts HEX color data to HSVA data (A is 1)
 * @param hex Hexidecimal string
 * @returns HSVA object
 */
export function hex_to_hsva(hex: string): IHSVA {
    return rgba_to_hsva(hex_to_rgba(hex));
}
// -----------------------------------------------------------------------------

/**
 * Application-wide HEX color reference
 */
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

// Convenience function for exporting HSV colors
function __hex_colors_to_hsva(): object {
    const output: object = {};
    for (const key of _.keys(HEX_COLORS)) {
        output[key] = hex_to_hsva(HEX_COLORS[key]);
    }
    return output;
}
export const HSV_COLORS: object = __hex_colors_to_hsva();

/**
 * Class which replicates the functionality of Python OrderedDict and defaultdict
 */
export class OrderedDict {
    /**
     * @param items Dict object
     * @param default_value Default value for non-existent keys
     */
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

    /**
     * Gets value of key
     * @param key Key
     * @returns Value
     */
    public get(key) {
        if (this._items[key] === undefined) {
            if (this.default !== undefined) {
                this._items[key] = _.clone(this.default);
                this._keys.push(key);
            }
        }
        return this._items[key];
    }

    /**
     * 
     * @param key Sets key to value
     * @param value Value
     */
    public set(key, value) {
        if (this._items[key] === undefined) {
            this._keys.push(key);
        }
        this._items[key] = value;
    }

    /**
     * Determines if key exists
     * @param key 
     */
    public has(key: string): boolean {
        return this._keys.includes(key);
    }

    /**
     * Inserts a key at a given position
     * @param position Index of key in keys
     * @param key Key
     * @param value Value
     */
    public insert(position, key, value) {
        if (this._items[key] !== undefined) {
            this._keys.splice(position, 0, key);
            this._items[key] = value;
        }
    }

    /**
     * @returns Array of key/value pairs 
     */
    public get items() {
        return _.map(this._keys, (key) => ( [key, this.get(key)] ));
    }

    /**
     * @returns Array of keys
     */
    public get keys(): any[] {
        return this._keys;
    }

    /**
     * @returns Array of values
     */
    public get values(): any[] {
        const output = [];
        for (const key of this._keys) {
            output.push(this._items[key]);
        }
        return output;
    }

    /**
     * @returns Number of keys
     */
    public get length(): number {
        return this._keys.length;
    }

    /**
     * @returns Normal object from keys and values
     */
    public to_object(): object {
        return this._items;
    }
}

/**
 * Convenience function for determining if an object or Array is empty
 * @param item Object or Array
 */
export function is_empty(item: any): boolean {
    if (typeof item === "object") {
        return _.keys(item).length === 0;
    }
    if (item instanceof Array) {
        return item.length === 0;
    }
}

/**
 * Filter keys of object given a blacklist of keys
 * @param items Object to be filtered
 * @param blacklist String or Array of keys 
 */
export function omit(items: object, blacklist: any) {
    if (!Array.isArray(blacklist)) {
        blacklist = [blacklist];
    }
    const keys = _.filter(
        Object.keys(items),
        (item) => (!blacklist.includes(item))
    );
    const output = {};
    for (const key in keys) {
        output[key] = items[key];
    }
    return output;
}

/**
 * Converts strings like "foo_bar_baz" to "foo-bar-baz"
 * @param item String to be converted
 * @returns Kebab-case string
 */
export function to_kebab_case(item: string) {
    return item.replace(/_/g, "-");
}

/**
 * Conforms strings to a special naming convention
 * Replaces "_" and "-"" with " ", also drops "inport "
 * @param name String to be conformed
 * @returns Conformed string
 */
export function conform_name(name: string): string {
    let output: string = name.replace(/_|-/g, " ");
    // probably should remove this at some point
    output = output.replace(/inport ?/, "");
    return output;
}

/**
 * Convenience function for adding a given attribute to a DOM element
 * @param selector QuerySelector string
 * @param attribute Name of DOM attribute
 * @param value Value of DOM attribute
 */
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

/**
 * Convenience function for adding a given style attribute to a DOM element
 * @param selector QuerySelector string
 * @param attribute Name of style attribute
 * @param value Value of style attribute
 */
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
 * Flattens nested objects into objects with character seperated keys
 * @param object object to be flattened
 * @param separator string separator used in keys. Default: "."
 * @param skipArrays don't recurse into Array objects. Default: true
 * @returns Object without nested objects
 * <p>
 * <b>Example</b>
 * <pre>
 * >>> const nested = {
 *         "a": {
 *             "b": 1,
 *             "c": {
 *                 "d": 2,
 *             }
 *         }
 *     };
 * >>> flatten(nested);
 *     {
 *         "a/b": 1,
 *         "a/c/d": 2,
 *     }
 * </pre>
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
 * Transforms flattend objects into nested objects by splitting apart keys
 * @param object object to be flattened
 * @param separator string separator used in keys. Default: "."
 * @param skipArrays don't recurse into Array objects. Default: true
 * @returns Unflattened object
 * <p>
 * <b>Example</b>
 * <pre>
 * >>> const flat = {
 *         "a/b": 1,
 *         "a/c/d": 2,
 *     };
 * >>> unflatten(flat);
 *     {
 *         "a": {
 *             "b": 1,
 *             "c": {
 *                 "d": 2,
 *             }
 *         }
 *     }
 * </pre>
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

/**
 * Flattens objects, aggregates their values into 1 Array per key,
 * applies given aggregator to each Array and finally unflattens the results
 * @param objects Array of objects with same schema
 * @param aggregator Function of signature: (items) => (scalar)
 * @param separator Key field separator
 * @returns Aggregated object
 * <p>
 * <b>Example</b>
 * <pre>
 * >>> const a = {
 *         "a": {
 *             "b": 1,
 *             "c": 2
 *         }
 *     };
 * >>> aggregate([a, a], items => ).sum(item));
 *     {
 *         "a": {
 *             "b": 2,
 *             "c": 4
 *         }
 *     };
 * </pre>
 */
export function aggregate(objects: object[], aggregator: any, separator: string = "/") {
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

/**
 * Recursively compares to objects to find differences between them
 * @param a
 * @param b
 */
export function different(a: object, b: object): boolean {
    const a_keys: any[] = _.keys(a);
    const b_keys: any[] = _.keys(b);
    const keys: any[] = _.concat(a_keys, b_keys);

    for (const key of keys) {
        if (!a_keys.includes(key)) {
            return true;
        }
        if (!b_keys.includes(key)) {
            return true;
        }
        if (a[key] !== b[key]) {
            return true;
        }
    }
    return false;
}

/**
 * Filters an object according to a predicate applied to its key/value pairs
 * @param dict Object to be filtered
 * @param predicate Funtion of signature: (a, b) => (boolean)
 * @returns Filtered object
 */
export function filter(dict: object, predicate: any): object {
    const pairs: any[][] = _.toPairs(dict);
    let output: any = _.filter(pairs, x => predicate(x[0], x[1]));
    const keys: any[] = output.map(x => x[0]);
    const values: any[] = output.map(x => x[1]);
    output = _.zipObject(keys, values);
    return output;
}

/**
 * Filters the keys of a given object according to a given regex
 * Keys must be strings
 * @param dict Object to be filtered
 * @param regex Regular expression to be applied to object keys
 * @returns Filtered object
 */
export function filter_keys(dict: object, regex: any): object {
    return filter( dict, (k, v) => (k.search(regex) > -1) );
}

/**
 * Filters the values of a given object according to a given regex
 * Values must be strings
 * @param dict Object to be filtered
 * @param regex Regular expression to be applied to object values
 * @returns Filtered object
 */
export function filter_values(dict: object, predicate: any): object {
    return filter( dict, (k, v) => (predicate(v)) );
}

/**
 * @param item Array indicating whether item is an Array
 */
export function is_array(item): boolean {
    return item instanceof Array;
}
