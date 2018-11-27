import * as _ from "lodash";
import { FancyFrame } from "./fancy_frame";
// -----------------------------------------------------------------------------

export class Params {
    public constructor(data: object) {
        this.__data = new FancyFrame().from_object(data);
    }

    private __data: FancyFrame;

    public _to_components(type: string): object[] {
        let temp: FancyFrame;
        if (type === "graph") {
            temp = this.filter_graph(".*?").__data;
        }
        else if (type === "node") {
            temp = this.filter_node(".*?").__data;
        }
        else if (type === "edge") {
            temp = this.filter_edge(".*?").__data;
        }
        else if (type === "inport") {
            temp = this.filter_inport(".*?").__data;
        }
        else if (type === "outport") {
            temp = this.filter_outport(".*?").__data;
        }
        const regex: RegExp = new RegExp(type + "_(.*?)\/");
        const data: object[] = temp
            .filter(x => x.match(regex), "key")
            .assign(x => x.key.match(regex)[1], "id")
            .group_by(x => x.to_object(), "id")
            .to_array();
        const output: object[] = [];
        for (const port of data) {
            output.push( new Params(port).strip_id().to_object() );
        }
        return output;
    }
    // -------------------------------------------------------------------------

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

    public diff(params: Params): Params {
        const a: object = this.to_object();
        const b: object = params.to_object();

        const data: object = {};
        for (const key of _.keys(a)) {
            if (a[key] !== b[key]) {
                data[key] = a[key];
            }
        }
        return new Params(data);
    }
    // -------------------------------------------------------------------------

    public filter_graph(graph_id: string, full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => x.match("graph_" + graph_id + "\/"), "key");
        if (!full) {
            data = data.filter(x => !x.match("node|edge|inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    public to_graph(graph_id: string, full: boolean = false): object {
        return this.filter_graph(graph_id, full).to_object();
    }

    public to_graphs(): object[] {
        return this._to_components("graph");
    }
    // -------------------------------------------------------------------------

    public filter_node(node_id: string, full: boolean = false): Params {
        let data: any = this.__data
            .filter(x => x.match("node_" + node_id + "\/"), "key");
        if (!full) {
            data = data.filter(x => !x.match("inport|outport"), "key");
        }
        data = data.to_object();
        return new Params(data);
    }

    public to_node(node_id: string, full: boolean = false): object {
        return this.filter_node(node_id, full).to_object();
    }

    public to_nodes(): object[] {
        return this._to_components("node");
    }
    // -------------------------------------------------------------------------

    public filter_edge(edge_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("edge_" + edge_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public to_edge(edge_id: string): object {
        return this.filter_edge(edge_id).to_object();
    }

    public to_edges(): object[] {
        return this._to_components("edge");
    }
    // -------------------------------------------------------------------------

    public filter_inport(inport_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("inport_" + inport_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public to_inport(inport_id: string): object {
        return this.filter_inport(inport_id).to_object();
    }

    public to_inports(): object[] {
        return this._to_components("inport");
    }
    // -------------------------------------------------------------------------

    public filter_outport(outport_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("outport_" + outport_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public to_outport(outport_id: string): object {
        return this.filter_outport(outport_id).to_object();
    }

    public to_outports(): object[] {
        return this._to_components("outport");
    }
}
