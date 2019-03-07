import * as _ from "lodash";
import * as tools from "../core/tools";
import * as three_tools from "./three_tools";
import { Component } from "./component";
import { Sphere } from "./sphere";
import { IPortParams } from "../core/iparams";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];

/**
 * Base component class for inports and outports.
 * Port primimtives include a Group and a Sphere.
 */
export class Port extends Component {
    /**
     * Order in which port is rendered relative to other ports of a node
     */
    private __order: number = 0;

    /**
     * "port"
     */
    public _class: string = "port";

    /**
     * Sphere primitive which represents a port.
     * @param params Sphere params, namely color and visibility.
     */
    private __to_sphere_params(params: object): object {
        let output: object = {
            "name": this._get_name(params),
            "visible": params["visible"],
            "color/hue": params["color/hue"],
            "color/saturation": params["color/saturation"],
            "color/value": params["color/value"],
            "color/alpha": params["color/alpha"],
        };
        output = three_tools.remove_empty_keys(output);
        return output;
    }
    // -------------------------------------------------------------------------

    /**
     * Default params for port. Include translate, scale, color and visibility.
     */
    public get _default_params(): object {
        return {
            "name": "port",
            "visible": true,
            "translate/x": 0,
            "translate/y": 0,
            "translate/z": 0,
            "scale/x": 0.15,
            "scale/y": 0.15,
            "scale/z": 0.15,
            "color/hue": cyan2.h,
            "color/saturation": cyan2.s,
            "color/value": cyan2.v,
            "color/alpha": cyan2.a,
        };
    }

    /**
     * Create a Port component according to given params.
     * @param params Port params
     * @param parent Node component
     */
    public create(params: IPortParams, parent: any): void {
        super.create(params, parent);
        const temp: IPortParams = this._clean_params(params);

        const sphere: Sphere = new Sphere(this._scene);
        sphere.create(this.__to_sphere_params(temp), this.item);
        this.add_component_id(sphere);
        this.set_primitive("sphere", sphere);

        if (_.keys(params).includes("order")) {
            this.__order = params["order"];
        }
    }

    /**
     * Read params from primitive children
     */
    public read(): IPortParams {
        const grp = this.item.read();
        const sphere = this.get_primitive("sphere").read();

        let params: IPortParams = {
            "name": grp["name"],
            "type": "port",
            "order": this.__order,
            "visible": grp["visible"],
            "translate/x": grp["translate/x"],
            "translate/y": grp["translate/y"],
            "translate/z": grp["translate/z"],
            "scale/x": grp["scale/x"],
            "scale/y": grp["scale/y"],
            "scale/z": grp["scale/z"],
            "color/hue": sphere["color/hue"],
            "color/saturation": sphere["color/saturation"],
            "color/value": sphere["color/value"],
            "color/alpha": sphere["color/alpha"],
        };
        params = three_tools.remove_empty_keys(params);
        return params;
    }

    /**
     * Update port according to given params.
     * All updates are nondestructive.
     * @param params Port params
     */
    public update(params: IPortParams): void {
        let new_params: IPortParams = this.read();
        new_params = three_tools.resolve_params(params, new_params);

        this.item.update(this._to_group_params(new_params));
        this.get_primitive("sphere").update(this.__to_sphere_params(new_params));

        if (_.keys(params).includes("order")) {
            this.__order = params["order"];
        }
    }
}
