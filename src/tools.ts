import * as _ from "lodash";

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
    };

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
    };

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
    )
    const output = {};
    for (const key in keys) {
        output[key] = items[key];
    }
    return output;
}

export function to_kebab_case(item: string) {
    return item.replace(/_/g, "-")
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
