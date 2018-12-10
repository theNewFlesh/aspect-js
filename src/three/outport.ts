import { Port } from "./port";
import { IPortParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Outport extends Port {
    public _class: string = "outport";

    public read(): IPortParams {
        const params: IPortParams = super.read();
        params["type"] = "outport";
        return params;
    }
}
