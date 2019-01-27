import * as _ from "lodash";
import * as THREE from "three";
import * as three_tools from "./three_tools";
import { IParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * Base interface to THREE items
 */
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

/**
 * Interface to group primitives
 */
interface IGroup {
    add?: any;
    remove?: any;
}

/**
 * Interface to primitives
 */
export interface IPrimitive {
    parent: IGroup;
    primitives: object;
    three_item: IGroup;
}

/**
 * Abstract base wrapper for all ThreeJS items used by Aspect.
 * Primitives are instantiated with a THREE.Scene item.
 * They can be parented to other primitives.
 * All CRUD methods receive a params object specific to the primitive class,
 * resolve, validate, diff and apply this data to appropriate ThreeJS items.
 */
export class PrimitiveBase {
    /**
     * Name of class. Overwrite in subclass.
     */
    public _class: string = "primitive";

    /**
     * The THREE.Scene instance the instance's three_item is embedded in
     */
    public _scene: THREE.Scene;

    /**
     * Instance primitive id
     */
    public _id: string;

    /**
     * Child primitive lut
     */
    public _primitives: object = {};

    /**
     * THREE item (usually a Group)
     */
    public _three_item: any;

    /**
     * Allow scale transformations
     */
    public _scaling: boolean = true;

    /**
     * The parent of this instance
     */
    public _parent: any;

    /**
     * Assign given THREE.Scene to instances _scene
     * @param scene THREE.Scene
     */
    public constructor(scene: THREE.Scene) {
        this._scene = scene;
    }

    /**
     * Deterimines if instance has child primitive
     * @param id Primitive id
     */
    public has_primitive(id: string): boolean {
        return this._primitives.hasOwnProperty(id);
    }

    /**
     * @param id Primitve id
     * @returns A child Primitive
     */
    public get_primitive(id: string): any {
        return this._primitives[id];
    }

    /**
     * Set primitive as a new child
     * @param id Primitive id
     * @param primitive Child primitive
     */
    public set_primitive(id: string, primitive: any): void {
        this._primitives[id] = primitive;
    }

    /**
     * Child Primitives
     */
    public get primitives(): object {
        return this._primitives;
    }

    /**
     * Whether this instance has a parent
     */
    public has_parent(): boolean {
        return ![null, undefined].includes(this.parent);
    }

    /**
     * Instance's parent
     */
    public get parent(): any {
        return this._parent;
    }

    /**
     * Set's parent of instance
     * @throws Error if parent is null or undefined
     * @throws Error if parent does not have a three_item
     */
    public set parent(parent: any) {
        if ([null, undefined].includes(parent)) {
            throw new Error("parent must not be null or undefined");
        }
        if ([null, undefined].includes(parent.three_item)) {
            throw new Error("parent does not have an three_item member");
        }
        this._parent = parent;
        this._parent.three_item.add(this.three_item);
    }

    /**
     * Removes instance's ThreeJS item form parent's ThreeJS item
     */
    public delete_parent(): void {
        if ([null, undefined].includes(this.parent)) {
            throw new Error("this instance has no parent");
        }
        this.parent.three_item.remove(this.three_item);
        // this.parent = null;
    }

    /**
     * ThreeJS item of this instance
     */
    public get three_item(): any {
        return this._three_item;
    }

    /**
     * Set's a ThreeJS item to _three_item
     * @param three_item ThreeJS item
     */
    public set three_item(three_item: any) {
        this._three_item = three_item;
    }
    // -------------------------------------------------------------------------

    /**
     * Reads three_item position and converts it into an IVector3 object
     * @returns Object with x, y, z keys
     */
    private __get_translate(): three_tools.IVector3 {
        let vect: number[] = this.three_item.position.toArray();
        vect = vect.map(x => x === undefined ? 0 : x);
        const output: three_tools.IVector3 = { x: vect[0], y: vect[1], z: vect[2] };
        return output;
    }

    /**
     * Reads three_item roatation and converts it into an IVector3 object in degrees
     * @returns Object with x, y, z keys
     */
    public __get_rotate(): three_tools.IVector3 {
        let vect: number[] = this.three_item.rotation.toArray();
        vect.pop();
        vect = vect.map(x => x === undefined ? 0 : x);
        vect = vect.map(three_tools.to_degrees);
        const output: three_tools.IVector3 = { x: vect[0], y: vect[1], z: vect[2] };
        return output;
    }

    /**
     * Reads three_item scale and converts it into an IVector3 object
     * @returns Object with x, y, z keys
     */
    private __get_scale(): three_tools.IVector3 {
        let vect: number[] = this.three_item.scale.toArray();
        vect = vect.map(x => x === undefined ? 1 : x);
        const output: three_tools.IVector3 = { x: vect[0], y: vect[1], z: vect[2] };
        return output;
    }

    /**
     * Set's name of ThreeJS item
     * @param params Primitive params. Must have name field.
     */
    private __set_name(params: IParams): void {
        this.three_item.name = params["name"];
    }

    /**
     * Set's visibility of ThreeJS item
     * @param params Primitve params. Must have visibility field.
     */
    private __set_visible(params: IParams): void {
        this.three_item.visible = params["visible"];
    }

    /**
     * Set's translation of ThreeJS item
     * @param params Primitive params. Must have translate/[x,y,z] fields.
     */
    private __set_translate(params: IParams): void {
        this.three_item.position.set(
            params["translate/x"],
            params["translate/y"],
            params["translate/z"],
        );
    }

    /**
     * Set's rotation of ThreeJS item
     * @param params Primitive params. Must have rotate/[x,y,z] fields in degrees.
     */
    private __set_rotate(params: IParams): void {
        const rot: THREE.Euler = new THREE.Euler(
            three_tools.to_radians(params["rotate/x"]),
            three_tools.to_radians(params["rotate/y"]),
            three_tools.to_radians(params["rotate/z"]),
            "XYZ",
        );
        this.three_item.setRotationFromEuler(rot);
    }

    /**
     * Set's scale of ThreeJS item
     * @param params Primitive params. Must have scale/[x,y,z] fields.
     */
    private __set_scale(params: IParams): void {
        this.three_item.scale.set(
            params["scale/x"],
            params["scale/y"],
            params["scale/z"],
        );
    }

    /**
     * Get's name of ThreeJS item
     * @param params Primitive params
     */
    public _get_name(params: object): string {
        return three_tools.get_name(params, this._class);
    }
    // -------------------------------------------------------------------------

    /**
     * Abstract method for instantiating ThreeJS item
     * @param params Primitive params
     * @returns ThreeJS item
     */
    public _create_three_item(params: IParams): any {
        throw new Error("method must be defined in subclass");
    }

    /**
     * Abstract methoda for determining which fields of params are destructive
     * @param params Primitve params
     */
    public _is_destructive(params: IParams): boolean {
        throw new Error("method must be defined in subclass");
    }

    /**
     * Default values for fields of params
     */
    public get _default_params(): IParams {
        return {
            "name": this._class,
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

    /**
     * Create ThreeJS item with params values
     * @param params Primtive params to be appllied to ThreeJS item
     * @param parent Parent of this instance
     */
    public create(params: IParams, parent: any): void {
        const temp: IParams = three_tools.resolve_params(
            params, this._default_params
        );
        const new_params = this._default_params;
        Object.assign(new_params, temp);

        this.three_item = this._create_three_item(new_params);
        this.parent = parent;
        this._non_destructive_update(new_params);
    }

    /**
     * Read values from ThreeJS item and compile it into a params object
     * @returns Params object with ThreeJS item values
     */
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

    /**
     * Update ThreeJS item with params values.
     * Will destroy ThreeJS and recreate it with new params if destructive
     * param encountered. Call _non_destructive_update.
     * @param params Object with correct fields and values for Primitive class
     */
    public update(params: IParams): void {
        const old_params: IParams = this.read();
        const new_params: IParams = three_tools.resolve_params(params, old_params);
        if (_.keys(new_params).length === 0) {
            return;
        }

        if (this._is_destructive(new_params)) {
            Object.assign(old_params, new_params);
            this.delete();
            this.create(old_params, this.parent);
        }
        else {
            this._non_destructive_update(new_params);
        }
    }

    /**
     * Applies changes to ThreeJS translate, rotate, scale, name or visibility
     * attributes.
     * @param params Params object
     */
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

    /**
     * Deletes instance's child primitives and ThreeJS items
     */
    public delete(): void {
        const prims = this._primitives;
        for (const id of _.keys(this.primitives)) {
            this.get_primitive(id).delete();
        }
        this._scene.add(this.three_item);
        this._scene.remove(this.three_item);
        // if (this.has_parent) {
        //     this.delete_parent();
        // }
        // this.three_item = null;
        this._primitives = {};
    }
}
