import { Port } from "./port";
import { IPortParams } from "../core/iparams";
// -----------------------------------------------------------------------------

export class Inport extends Port {
    public read(): IPortParams {
        const params: IPortParams = super.read();
        params["type"] = "inport";
        return params;
    }
}
