import { Component } from "./component";

/**
 * Graph components represent a singular directed acyclic graph of nodes and
 * edges. Graphs may contain other graphs (subgraphs), which it treats as nodes.
 * All graphs contain an initial and terminal node.
 */
export class Graph extends Component {
    /**
     * "graph"
     */
    public _class: string = "graph";
}
