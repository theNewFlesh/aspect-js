import * as _ from "lodash";
import * as THREE from "three";
import * as three_tools from "./three_tools";
import { IParams } from "../core/iparams";
// -----------------------------------------------------------------------------

interface IItem {
    material?: any;
    geometry?: any;
    name?: any;
    visible?: any;
    position?: any;
    rotation?: any;
    scale?: any;
    setRotationFromEuler?: any;
}

interface IThreeItem {
    add?: any;
    remove?: any;
}

interface IPrimitive {
    parent: IThreeItem;
    children: object;
    item: IThreeItem;
}

export class PrimitiveBase {
    private __id: string;
    public _parent: any;
    public _children: object = {};
    public _item: IItem;

    public constructor(parent: any) {
        if (parent.item === undefined) {
            throw new Error("parent does not have an item member");
        }
        this.parent = parent;
    }
    // -------------------------------------------------------------------------

    public get_child(key: string): IPrimitive {
        return this._children[key];
    }

    public get parent(): IPrimitive {
        return this._parent;
    }

    public set parent(parent: IPrimitive) {
        this._parent = parent;
    }

    public get children(): object {
        return this._children;
    }

    public get item(): IItem {
        return this._item;
    }

    public set item(item: IItem) {
        this._item = item;
    }
    // -------------------------------------------------------------------------

    private __get_translate(): three_tools.IVector3 {
        let vect: number[] = this.item.position.toArray();
        vect = vect.map(x => x === undefined ? 0 : x);
        const output: three_tools.IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
        return output;
    }

    private __get_rotate(): three_tools.IVector3 {
        let vect: number[] = this.item.rotation.toArray();
        vect.pop();
        vect = vect.map(x => x === undefined ? 0 : x);
        vect = vect.map(three_tools.to_angle);
        const output: three_tools.IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
        return output;
    }

    private __get_scale(): three_tools.IVector3 {
        let vect: number[] = this.item.scale.toArray();
        vect = vect.map(x => x === undefined ? 1 : x);
        const output: three_tools.IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
        return output;
    }

    private __set_name(params: IParams): void {
        this.item.name = params["name"];
    }

    private __set_visible(params: IParams): void {
        this.item.visible = params["visible"];
    }

    private __set_translate(params: IParams): void {
        this.item.position.set(
            params["translate/x"],
            params["translate/y"],
            params["translate/z"],
        );
    }

    private __set_rotate(params: IParams): void {
        const rot: THREE.Euler = new THREE.Euler(
            three_tools.to_radians(params["rotate/x"]),
            three_tools.to_radians(params["rotate/y"]),
            three_tools.to_radians(params["rotate/z"]),
            "XYZ",
        );
        this.item.setRotationFromEuler(rot);
    }

    private __set_scale(params: IParams): void {
        this.item.scale.set(
            params["scale/x"],
            params["scale/y"],
            params["scale/z"],
        );
    }
    // -------------------------------------------------------------------------

    public _create_item(params: IParams): any {
        throw new Error("method must be defined in subclass");
    }

    public _is_destructive(params: IParams): boolean {
        throw new Error("method must be defined in subclass");
    }

    public get _default_params(): IParams {
        return {
            "name": "",
            "visible": true,
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
    }

    public create(params: IParams): void {
        const temp: IParams = three_tools.resolve_params(
            params, this._default_params
        );
        const new_params = this._default_params;
        Object.assign(new_params, temp);

        const item = this._create_item(new_params);
        this.item = item;

        this.link(this.parent);

        this._non_destructive_update(new_params);
    }

    public read(): IParams {
        const item = this.item;
        const geo = this.item.geometry;
        const params: IParams = {
            "id": this.__id,
            "name": item.name,
            "visible": item.visible,
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

    public update(params: IParams): void {
        const old_params: IParams = this.read();
        const new_params: IParams = three_tools.resolve_params(params, old_params);
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

    public _non_destructive_update(params: IParams): void {
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

        if (keys.includes("name")) {
            this.__set_name(params);
        }

        if (keys.includes("visible")) {
            this.__set_visible(params);
        }
    }

    public delete(): void {
        const prims = this._children;
        let keys = _.keys(prims);
        const grp = this._children["group"];
        keys = _.filter(keys, key => key !== "group");
        keys.map(key => prims[key].delete());
        this.unlink();
        this.item = null;
    }

    public link(parent: any): void {
        if (parent.item === undefined) {
            throw new Error("parent does not have an item member");
        }
        this.parent.item.add(this.item);
    }

    public unlink(): void {
        if (this.parent === undefined) {
            throw new Error("parent does not exist");
        }
        this.parent.item.remove(this.item);
    }
}
