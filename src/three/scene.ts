import * as _ from "lodash";
import { Component } from "./component";
import { ISceneParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * A Scene component is responsible for containing Graph components.
 * It is the principle component rendered by the DAG.
 */
export class Scene extends Component {
    /**
     * "scene"
     */
    public _class: string = "scene";

    /**
     * Window width
     */
    public _width: number;

    /**
     * Window height
     */
    public _height: number;

    /**
     * Returns an object with a name field.
     */
    public get _default_params(): ISceneParams {
        return {
            "name": this._class,
        };
    }

    /**
     * Creates scene component from given params
     * @param params Scene params
     * @param parent Object with THREE.Scene as its three_item
     */
    public create(params: ISceneParams, parent: any): void {
        this._width = params["session/width"];
        this._height = params["session/height"];
        super.create(params, parent);
    }

    /**
     * Update component with params.
     * Currently does nothing.
     * @param params Scene params
     */
    public update(params: ISceneParams): void {
        // pass
    }
}
