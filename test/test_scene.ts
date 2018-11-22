import * as _ from "lodash";
import * as tools from "../src/core/tools";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

const sid0: string  = "uuid0";
const gid0: string  = "uuid1";
const eid0: string  = "uuid2";
const eid1: string  = "uuid3";
const nid0: string  = "uuid4";
const ipid0: string = "uuid5";
const opid0: string = "uuid6";
const ipid1: string = "uuid7";
const opid1: string = "uuid8";

const proto_scene: object = {
    "id":              sid0,
    "resource_<id>":   "",
    "display/name":    "",
    "display/info":    "",
    "display/version": "",
};

const proto_edge: object = {
    "id":                       eid0,
    "source":                   "",
    "destination":              ipid0,
    "type":                     "",
    "display/name":             "edge",
    "display/info":             "",
    "display/order":            "",
    "display/selected":         "",
    "display/visible":          true,
    // "display/source/translate/x":      0,
    // "display/source/translate/y":      4,
    // "display/source/translate/z":      0,
    "display/source/visible":     true,
    // "display/destination/translate/x": 0,
    // "display/destination/translate/y": 0,
    // "display/destination/translate/z": 0,
    "display/to/visible":       false,
    "display/scale/x":          1,
    "display/scale/y":          1,
    "display/scale/z":          1,
    "display/radius":           0.05,
    "display/color/hue":        cyan2.h,
    "display/color/saturation": cyan2.s,
    "display/color/value":      cyan2.v,
    "display/color/alpha":      cyan2.a,
};

const proto_graph: object = {
    "id":                  gid0,
    "type":                "",
    "innode":              "",
    "outnode":             "",
    "display/name":        "graph",
    "display/info":        "",
    "display/version":     "",
    "display/order":       "",
    "display/selected":    "",
    "display/visible":     true,
    "display/translate/x": 0,
    "display/translate/y": 0,
    "display/translate/z": 0,
    "display/rotate/x":    0,
    "display/rotate/y":    0,
    "display/rotate/z":    0,
    "display/scale/x":     1,
    "display/scale/y":     1,
    "display/scale/z":     1,
};

const edge1 = _.clone(proto_edge);
edge1["id"] = eid1;

const proto_node: object = {
    "id":                            nid0,
    "type":                          "",
    "module":                        "",
    "function":                      "",
    "subgraph":                      "",
    "display/name":                  "node",
    "display/info":                  "",
    "display/version":               "",
    "display/order":                 "",
    "display/selected":              "",
    "display/visible":               true,
    "display/translate/x":           0,
    "display/translate/y":           0,
    "display/translate/z":           0,
    "display/scale/x":               1,
    "display/scale/y":               1,
    "display/scale/z":               1,
    "display/color/hue":             cyan2.h,
    "display/color/saturation":      cyan2.s,
    "display/color/value":           cyan2.v,
    "display/color/alpha":           cyan2.a,
    "display/font/color/hue":        grey2.h,
    "display/font/color/saturation": grey2.s,
    "display/font/color/value":      grey2.v,
    "display/font/color/alpha":      grey2.a,
    "display/font/text":             "DEFAULT TEXT",
    "display/font/family":           "mono",
    "display/font/style":            "normal",
    "display/font/size":             300,
};

const proto_inport: object = {
    "id":                            ipid0,
    "value":                         "",
    "default_value":                 "",
    "type":                          "",
    "lock":                          "",
    "display/name":                  "inport",
    "display/widget":                "",
    "display/options":               "",
    "display/info":                  "",
    "display/order":                 "",
    "display/selected":              "",
    "display/visible":               true,
    "display/translate/x":           0,
    "display/translate/y":           0,
    "display/translate/z":           0,
    "display/scale/x":               1,
    "display/scale/y":               1,
    "display/scale/z":               1,
    "display/color/hue":             cyan2.h,
    "display/color/saturation":      cyan2.s,
    "display/color/value":           cyan2.v,
    "display/color/alpha":           cyan2.a,
    "display/font/color/hue":        grey2.h,
    "display/font/color/saturation": grey2.s,
    "display/font/color/value":      grey2.v,
    "display/font/color/alpha":      grey2.a,
    "display/font/text":             "DEFAULT TEXT",
    "display/font/family":           "mono",
    "display/font/style":            "normal",
    "display/font/size":             300,
};

const inport1 = _.clone(proto_inport);
inport1["id"] = ipid1;

const proto_outport: object = {
    "id":                            opid0,
    "display/name":                  "outport",
    "display/widget":                "",
    "display/options":               "",
    "display/info":                  "",
    "display/order":                 "",
    "display/selected":              "",
    "display/visible":               true,
    "display/translate/x":           0,
    "display/translate/y":           0,
    "display/translate/z":           0,
    "display/scale/x":               1,
    "display/scale/y":               1,
    "display/scale/z":               1,
    "display/color/hue":             cyan2.h,
    "display/color/saturation":      cyan2.s,
    "display/color/value":           cyan2.v,
    "display/color/alpha":           cyan2.a,
    "display/font/color/hue":        grey2.h,
    "display/font/color/saturation": grey2.s,
    "display/font/color/value":      grey2.v,
    "display/font/color/alpha":      grey2.a,
    "display/font/text":             "DEFAULT TEXT",
    "display/font/family":           "mono",
    "display/font/style":            "normal",
    "display/font/size":             300,
};

const temp: object = {};
temp[`scene_${sid0}`] = proto_scene;
temp[`scene_${sid0}`][`edge_${eid0}`] = proto_edge;
temp[`scene_${sid0}`][`graph_${gid0}`] = proto_graph;
temp[`scene_${sid0}`][`graph_${gid0}`][`edge_${eid1}`] = edge1;
temp[`scene_${sid0}`][`graph_${gid0}`][`node_${nid0}`] = proto_node;
temp[`scene_${sid0}`][`graph_${gid0}`][`node_${nid0}`][`inport_${ipid0}`] = proto_inport;
temp[`scene_${sid0}`][`graph_${gid0}`][`node_${nid0}`][`inport_${ipid1}`] = inport1;
temp[`scene_${sid0}`][`graph_${gid0}`][`node_${nid0}`][`outport_${opid0}`] = proto_outport;
export const scene: object = tools.flatten(temp);
