import { Port } from "./port";
import { IPortParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * OutPort components are responsible for controlling outgoing connections from
 * a node. An edge stemming from the outport's parent node, connects to it and
 * an another edge stemming for the outport may connect to the inport of another
 * node.
 */
export class Outport extends Port {
    /**
     * "outport"
     */
    public _class: string = "outport";

    /**
     * Get's port params from primitives. Set's type to "outport".
     */
    public read(): IPortParams {
        const params: IPortParams = super.read();
        params["type"] = "outport";
        return params;
    }
}
