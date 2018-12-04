import * as _ from "lodash";
import * as THREE from "three";
import * as three_tools from "./three_tools";
import { IParams } from "../core/iparams";
// -----------------------------------------------------------------------------

interface IThreeItem {
    material?: any;
    geometry?: any;
    name?: any;
    visible?: any;
    position?: any;
    rotation?: any;
    scale?: any;
    setRotationFromEuler?: any;
}

interface IGroup {
    add?: any;
    remove?: any;
}

export interface IPrimitive {
    parent: IGroup;
    children: object;
    three_item: IGroup;
}

export class PrimitiveBase {
    public _id: string;
    public _children: object = {};
    public _three_item: IThreeItem;
    public _scaling: boolean = true;
    public _parent: any = null;

    public has_child(id: string): boolean {
        return this._children.hasOwnProperty(id);
    }

    public get_child(key: string): any {
        return this._children[key];
    }

    public set_child(key: string, value: any): void {
        this._children[key] = value;
    }

    public get children(): object {
        return this._children;
    }

    public has_parent(): boolean {
        return ![null, undefined].includes(this.parent);
    }

    public get parent(): any {
        return this._parent;
    }

    public set parent(parent: any) {
        if ([null, undefined].includes(parent)) {
            throw new Error("parent must not be null or undefined");
        }
        if (parent.three_item === null) {
            throw new Error("parent does not have an three_item member");
        }
        this._parent = parent;
        this._parent.three_item.add(this.three_item);
    }

    public delete_parent(): void {
        if ([null, undefined].includes(this.parent)) {
            throw new Error("this instance has no parent");
        }
        this.parent.three_item.remove(this.three_item);
        this.parent = null;
    }

    public get three_item(): IThreeItem {
        return this._three_item;
    }

    public set three_item(three_item: IThreeItem) {
        this._three_item = three_item;
    }
    // -------------------------------------------------------------------------

    private __get_translate(): three_tools.IVector3 {
        let vect: number[] = this.three_item.position.toArray();
        vect = vect.map(x => x === undefined ? 0 : x);
        const output: three_tools.IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
        return output;
    }

    private __get_rotate(): three_tools.IVector3 {
        let vect: number[] = this.three_item.rotation.toArray();
        vect.pop();
        vect = vect.map(x => x === undefined ? 0 : x);
        vect = vect.map(three_tools.to_angle);
        const output: three_tools.IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
        return output;
    }

    private __get_scale(): three_tools.IVector3 {
        let vect: number[] = this.three_item.scale.toArray();
        vect = vect.map(x => x === undefined ? 1 : x);
        const output: three_tools.IVector3 = {x: vect[0], y: vect[1], z: vect[2]};
        return output;
    }

    private __set_name(params: IParams): void {
        this.three_item.name = params["name"];
    }

    private __set_visible(params: IParams): void {
        this.three_item.visible = params["visible"];
    }

    private __set_translate(params: IParams): void {
        this.three_item.position.set(
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
        this.three_item.setRotationFromEuler(rot);
    }

    private __set_scale(params: IParams): void {
        this.three_item.scale.set(
            params["scale/x"],
            params["scale/y"],
            params["scale/z"],
        );
    }
    // -------------------------------------------------------------------------

    public _create_three_item(params: IParams): any {
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

    public create(params: IParams, parent: any = null): void {
        const temp: IParams = three_tools.resolve_params(
            params, this._default_params
        );
        const new_params = this._default_params;
        Object.assign(new_params, temp);

        this.three_item = this._create_three_item(new_params);
        if (parent !== null) {
            this.parent = parent;
        }
        this._non_destructive_update(new_params);
    }

    public read(): IParams {
        const three_item = this.three_item;
        const geo = this.three_item.geometry;
        const params: IParams = {
            "id": this._id,
            "name": three_item.name,
            "visible": three_item.visible,
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

        if (_.intersection(three_tools.SCALE_KEYS, keys).length > 0 && this._scaling) {
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
        _.keys(prims).map(key => prims[key].delete());
        if (this.has_parent) {
            this.delete_parent();
        }
        this.three_item = null;
        this._children = {};
    }
}
