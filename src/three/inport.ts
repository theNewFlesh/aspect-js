import { Port } from "./port";
import { IPortParams } from "../core/iparams";
// -----------------------------------------------------------------------------

/**
 * InPort components are responsible for controlling incoming connections to a
 * node. An edge stemming from the outport of a different node may connect to an
 * inport, the inport is in turn connected to its parent node via another edge.
 */
export class Inport extends Port {
    /**
     * "inport"
     */
    public _class: string = "inport";

    /**
     * Get's port params from primitives. Set's type to "inport".
     */
    public read(): IPortParams {
        const params: IPortParams = super.read();
        params["type"] = "inport";
        return params;
    }
}
