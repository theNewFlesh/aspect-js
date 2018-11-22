import * as _ from "lodash";
import { FancyFrame } from "./fancy_frame";
// -----------------------------------------------------------------------------

export class Params {
    public constructor(data: object) {
        this.__data = new FancyFrame().from_object(data);
    }

    private __data: FancyFrame;

    public to_object(): object {
        return this.__data.to_object();
    }

    public to_array(): object[] {
        return this.__data.to_array();
    }

    public print(): void {
        this.__data.print();
    }

    public strip_id(): Params {
        const regex: RegExp = new RegExp(".*(inport|outport|node|edge|graph|scene)_.*?\/");
        const data: object = this.__data
            .assign(x => x.key.replace(regex, ""), "key")
            .to_object();
        return new Params(data);
    }

    public strip_display(): Params {
        const data: object = this.__data
            .filter(x => !x.match("display\/"), "key")
            .to_object();
        return new Params(data);
    }

    public get_full_graph(id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("graph_" + id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public get_full_node(id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("node_" + id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public get_graph(id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("graph_" + id + "\/"), "key")
            .filter(x => !x.match("node|edge|inport|outport"), "key")
            .to_object();
        return new Params(data).strip_id();
    }

    public get_node(id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("node_" + id + "\/"), "key")
            .filter(x => !x.match("inport|outport"), "key")
            .to_object();
        return new Params(data).strip_id();
    }

    public get_edge(id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("edge_" + id + "\/"), "key")
            .to_object();
        return new Params(data).strip_id();
    }

    public get_inport(id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("inport_" + id + "\/"), "key")
            .to_object();
        return new Params(data).strip_id();
    }

    public get_outport(id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("outport_" + id + "\/"), "key")
            .to_object();
        return new Params(data).strip_id();
    }
}
