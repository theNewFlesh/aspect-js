import * as _ from "lodash";
import * as tools from "../src/core/tools";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

const s0: string  = "scene_0";
const g0: string  = "graph_0";
const e0: string  = "edge_0";
const n0: string  = "node_0";
const ip0: string = "inport_0";
const op0: string = "outport_0";

const proto_scene: object = {
    "id":              s0,
    "resource_<id>":   "",
    "display/name":    "",
    "display/info":    "",
    "display/version": "",
};

const proto_edge: object = {
    "id":                              e0,
    "source":                          op0,
    "destination":                     ip0,
    "type":                            "",
    "display/name":                    "edge",
    "display/info":                    "",
    "display/order":                   "",
    "display/selected":                "",
    "display/visible":                 true,
    "display/source/translate/x":      4,
    "display/source/translate/y":      8,
    "display/source/translate/z":      0,
    "display/source/visible":          true,
    "display/destination/translate/x": 0,
    "display/destination/translate/y": 0,
    "display/destination/translate/z": 0,
    "display/destination/visible":     false,
    // "display/scale/x":                 1,
    // "display/scale/y":                 1,
    // "display/scale/z":                 1,
    // "display/radius":                  0.05,
    "display/color/hue":               cyan2.h,
    "display/color/saturation":        cyan2.s,
    "display/color/value":             cyan2.v,
    "display/color/alpha":             cyan2.a,
};

const proto_graph: object = {
    "id":                  g0,
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

const proto_node: object = {
    "id":                            n0,
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
    // "display/scale/x":               1,
    // "display/scale/y":               1,
    // "display/scale/z":               1,
    "display/color/hue":             cyan2.h,
    "display/color/saturation":      cyan2.s,
    "display/color/value":           cyan2.v,
    "display/color/alpha":           cyan2.a,
    "display/font/color/hue":        grey2.h,
    "display/font/color/saturation": grey2.s,
    "display/font/color/value":      grey2.v,
    "display/font/color/alpha":      grey2.a,
    // "display/font/text":             "DEFAULT TEXT",
    "display/font/family":           "mono",
    "display/font/style":            "normal",
    "display/font/size":             300,
};

const proto_inport: object = {
    "id":                            ip0,
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
    "display/scale/x":               0.15,
    "display/scale/y":               0.15,
    "display/scale/z":               0.15,
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

const proto_outport: object = {
    "id":                            op0,
    "display/name":                  "outport",
    "display/widget":                "",
    "display/options":               "",
    "display/info":                  "",
    "display/order":                 "",
    "display/selected":              "",
    "display/visible":               true,
    "display/translate/x":           0,
    "display/translate/y":           3,
    "display/translate/z":           0,
    "display/scale/x":               0.15,
    "display/scale/y":               0.15,
    "display/scale/z":               0.15,
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

const e1 = _.clone(proto_edge);
e1["id"] = "edge_1";
const ip1 = _.clone(proto_inport);
ip1["id"] = "inport_1";
const ip2 = _.clone(proto_inport);
ip2["id"] = "inport_2";
const ip3 = _.clone(proto_inport);
ip3["id"] = "inport_3";

const temp: object = {};
temp[`${s0}`] = proto_scene;
temp[`${s0}`][`${e0}`] = proto_edge;
temp[`${s0}`][`${g0}`] = proto_graph;
temp[`${s0}`][`${g0}`]["edge_1"] = e1;
temp[`${s0}`][`${g0}`][`${n0}`] = proto_node;
temp[`${s0}`][`${g0}`][`${n0}`][`${ip0}`] = proto_inport;
temp[`${s0}`][`${g0}`][`${n0}`][`inport_1`] = ip1;
temp[`${s0}`][`${g0}`][`${n0}`][`inport_2`] = ip2;
// temp[`${s0}`][`${g0}`][`${n0}`][`inport_3`] = ip3;
temp[`${s0}`][`${g0}`][`${n0}`][`${op0}`] = proto_outport;
export const scene: object = tools.flatten(temp);
