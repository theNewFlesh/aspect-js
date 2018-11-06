import * as _ from "lodash";
import tiny_color from "tinycolor2";
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

export function rgb_to_hsv(rgb: IRGB): IHSV {
    const color = {
        r: rgb.r * 255,
        g: rgb.g * 255,
        b: rgb.b * 255,
    };
    return tiny_color.fromRatio(color).toHsv();
}

export function hsv_to_rgb(hsv: IHSV): IRGB {
    const color = tiny_color.fromRatio(hsv).toRgb();
    return {
        r: color.r / 255,
        g: color.g / 255,
        b: color.b / 255,
    };
}

export function hex_to_rgb(hex: string): IRGB {
    const color = tiny_color(hex).toRgb();
    return {
        r: color.r / 255,
        g: color.g / 255,
        b: color.b / 255,
    };
}

export function hex_to_hsv(hex: string): IHSV {
    return rgb_to_hsv(hex_to_rgb(hex));
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

function __hex_colors_to_hsv(): object {
    const output: object = {};
    for (const key of _.keys(HEX_COLORS)) {
        output[key] = hex_to_hsv(HEX_COLORS[key]);
    }
    return output;
}
export const HSV_COLORS: object = __hex_colors_to_hsv();

export class OrderedDict {
    constructor(items: object = undefined, default_value = undefined) {
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
    const elems = document.querySelectorAll(selector);
    for (const elem of elems) {
        elem.setAttribute(attribute, value);
    }
}

export function add_style_attribute(
    selector: string, attribute: string, value: any
) {
    const elems = document.querySelectorAll(selector);
    for (const elem of elems) {
        let style = elem.getAttribute("style");
        if (style === null) {
            style = "";
        }
        style = style + ` ${attribute}: ${value};`;
        elem.setAttribute("style", style);
    }
}
