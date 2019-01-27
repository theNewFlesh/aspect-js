import * as three_tools from "./three_tools";
import { Group } from "./group";
import { IComponentParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * Base class for Aspect 3D components
 */
export class Component extends Group {
    /**
     * Lowercase name of component class. Should be overridden for each subclass.
     */
    public _class: string = "component";

    /**
     * Child id: Child instance lut object
     */
    public _children: object = {};

    /**
     * Group object which encapsulates all ThreeJs children
     */
    public _item: Group;

    public has_child(id: string): boolean {
        return this._children.hasOwnProperty(id);
    }

    /**
     * @param id Component id
     * @returns Child component instance
     */
    public get_child(id: string): Component {
        return this._children[id];
    }

    /**
     * Assigns a component to children
     * @param id Component id
     * @param value Child component
     */
    public set_child(id: string, value: Component): void {
        this._children[id] = value;
    }

    /**
     * @returns Child component lut
     */
    public get children(): object {
        return this._children;
    }

    /**
     * @returns This class's single Group primitive
     */
    public get item(): Group {
        return this._item;
    }

    /**
     * Sets this class's Group component
     */
    public set item(item: Group) {
        this._item = item;
    }

    /**
     * Convenience methhod for adding an instance'd id to a given primitive
     * @param primitive Primitive instance
     */
    public add_component_id(primitive: any): void {
        primitive.three_item.component_id = this._id;
    }
    // -------------------------------------------------------------------------

    /**
     * Coerces params object into one that a Group component can ingest
     * @param params Params object
     */
    public _to_group_params(params: object): object {
        let output: object = {
            "name": this._get_name(params),
            "visible": params["visible"],
            "translate/x": params["translate/x"],
            "translate/y": params["translate/y"],
            "translate/z": params["translate/z"],
            "rotate/x": params["rotate/x"],
            "rotate/y": params["rotate/y"],
            "rotate/z": params["rotate/z"],
            "scale/x": params["scale/x"],
            "scale/y": params["scale/y"],
            "scale/z": params["scale/z"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }

    /**
     * @returns THREE.Group instance for an instance
     */
    public get three_item(): any {
        return this._three_item;
    }

    /**
     * Sets the THREE.Group item for an instance
     */
    public set three_item(three_item: any) {
        this._three_item = three_item;
    }

    /**
     * Resolves params and assign defaults to undefined fields
     * @param params Dirty params object
     * @returns Cleaned up params
     */
    public _clean_params(params: object): object {
        const temp: IComponentParams = three_tools.resolve_params(
            params, this._default_params
        );
        const output: any = this._default_params;
        Object.assign(output, temp);
        return three_tools.remove_empty_keys(output);
    }

    /**
     * Creates a new Group component with given params, and assigns this._item
     * and this.three_item appropriately.
     * @param params Component params
     */
    public _assign_three_item(params: IComponentParams): void {
        const grp: Group = new Group(this._scene);
        grp.create(this._to_group_params(params), this);
        this._item = grp;
        this.three_item = grp.three_item;
    }

    /**
     * Create component given params a parent component.
     * Assigns a component id, three_item and Group primitive.
     * @param params Component params
     * @param parent Parent component
     */
    public create(params: IComponentParams, parent: any): void {
        const temp: IComponentParams = this._clean_params(params);
        this._id = params["id"];
        this.three_item = this._create_three_item(temp);
        if (parent !== null) {
            this.parent = parent;
            this.parent.set_child(this._id, this);
        }
        this._assign_three_item(this._clean_params(params));
        this._non_destructive_update(temp);
    }
}
