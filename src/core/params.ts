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

    public get_full_graph(graph_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("graph_" + graph_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public get_full_node(node_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("node_" + node_id + "\/"), "key")
            .to_object();
        return new Params(data);
    }

    public get_graph(graph_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("graph_" + graph_id + "\/"), "key")
            .filter(x => !x.match("node|edge|inport|outport"), "key")
            .to_object();
        return new Params(data).strip_id();
    }

    public get_node(node_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("node_" + node_id + "\/"), "key")
            .filter(x => !x.match("inport|outport"), "key")
            .to_object();
        return new Params(data).strip_id();
    }

    public get_edge(edge_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("edge_" + edge_id + "\/"), "key")
            .to_object();
        return new Params(data).strip_id();
    }

    public get_inport(inport_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("inport_" + inport_id + "\/"), "key")
            .to_object();
        return new Params(data).strip_id();
    }

    public get_outport(outport_id: string): Params {
        const data: object = this.__data
            .filter(x => x.match("outport_" + outport_id + "\/"), "key")
            .to_object();
        return new Params(data).strip_id();
    }

    public to_graph(graph_id: string): object {
        return this.get_graph(graph_id).to_object();
    }

    public to_node(node_id: string): object {
        return this.get_node(node_id).to_object();
    }

    public to_edge(edge_id: string): object {
        return this.get_edge(edge_id).to_object();
    }

    public to_inport(inport_id: string): object {
        return this.get_inport(inport_id).to_object();
    }

    public to_outport(outport_id: string): object {
        return this.get_outport(outport_id).to_object();
    }

    public _to_ports(node_id: string, port_type: string): object[] {
        const data: object[] = this.get_full_node(node_id).__data
            .filter(x => x.match(port_type + "_.*?\/"), "key")
            .assign(x => x.key.match("(" + port_type + "_.*?)\/")[1], "id")
            .group_by(x => x.to_object(), "id")
            .to_array();
        const output: object[] = [];
        for (const port of data) {
            output.push( new Params(port).strip_id().to_object() );
        }
        return output;
    }

    public to_inports(node_id: string): object[] {
        return this._to_ports(node_id, "inport");
    }

    public to_outports(node_id: string): object[] {
        return this._to_ports(node_id, "outport");
    }
}
