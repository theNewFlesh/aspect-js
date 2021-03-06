import * as _ from "lodash";
import * as tools from "../src/core/tools";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

const options = [{
    min: 0,
    max: 60,
    step: 5,
    tick_step: 10,
    round: 3,
    values: [
        "alpha", "bravo", "charlie", "delta", "echo",
    ],
    default_color: "aspect_cyan_1",
}];

const proto_scene: object = {
    "id":              "scene_0",
    "type":            "scene",
    "subtype":         "",
    "resource_<id>":   "",
    "display/name":    "",
    "display/info":    "",
    "display/version": "",
};

const proto_edge: object = {
    "id":                              "edge_0",
    "type":                            "edge",
    "subtype":                         "",
    "source/id":                       "outport_0",
    "destination/id":                  "inport_0",
    "display/name":                    "edge",
    "display/info":                    "",
    "display/order":                   "",
    "display/selected":                "",
    "display/visible":                 true,
    "display/source/visible":          true,
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
    "id":                  "graph_0",
    "type":                "graph",
    "subtype":             "",
    "source/id":           "node_0",
    "destination/id":      "node_2",
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
    "id":                            "node_0",
    "type":                          "node",
    "subtype":                       "",
    "module":                        "mod",
    "function":                      "func",
    // "subgraph":                      "",
    "display/name":                  "node",
    "display/info":                  "",
    "display/version":               "",
    "display/order":                 "",
    "display/selected":              "",
    "display/visible":               true,
    "display/translate/x":           2,
    "display/translate/y":           4,
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
    "display/font/text":             "node_0",
    "display/font/family":           "courier",
    "display/font/style":            "normal",
    "display/font/size":             300,
};

const proto_inport: object = {
    "id":                            "inport_0",
    "type":                          "inport",
    "subtype":                       "node",
    "value":                         10,
    "default_value":                 50,
    "lock":                          "present",
    "parameter":                     "param_0",
    "display/name":                  "inport",
    "display/widget":                "slider",
    "display/options":               options,
    "display/info":                  "blah blah blah",
    "display/order":                 0,
    "display/selected":              "",
    "display/visible":               true,
    // "display/translate/x":           0,
    // "display/translate/y":           0,
    // "display/translate/z":           0,
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
    "display/font/family":           "courier",
    "display/font/style":            "normal",
    "display/font/size":             300,
};

const proto_outport: object = {
    "id":                            "outport_0",
    "type":                          "outport",
    "subtype":                       "",
    "display/name":                  "outport",
    "display/widget":                "",
    "display/options":               "",
    "display/info":                  "",
    "display/order":                 0,
    "display/selected":              "",
    "display/visible":               true,
    // "display/translate/x":           0,
    // "display/translate/y":           0,
    // "display/translate/z":           0,
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
    "display/font/family":           "courier",
    "display/font/style":            "normal",
    "display/font/size":             300,
};

const op1 = _.clone(proto_outport);
op1["id"] = "outport_1";
op1["name"] = "outport_1";
op1["display/order"] = 0;

const op2 = _.clone(proto_outport);
op2["id"] = "outport_2";
op2["name"] = "outport_2";
op2["display/order"] = 2;

const ip1 = _.clone(proto_inport);
ip1["id"] = "inport_1";
ip1["name"] = "inport_1";
ip1["display/order"] = 1;
ip1["display/widget"] = "combobox";

const ip2 = _.clone(proto_inport);
ip2["id"] = "inport_2";
ip2["name"] = "inport_2";
ip2["display/order"] = 2;
ip2["display/widget"] = "textarea";

const ip3 = _.clone(proto_inport);
ip3["id"] = "inport_3";
ip3["name"] = "inport_3";
ip3["display/order"] = 3;
ip3["display/widget"] = "spinbox";
ip3["subtype"] = "both";

const ip4 = _.clone(proto_inport);
ip4["id"] = "inport_4";
ip4["name"] = "inport_4";
ip4["display/order"] = 4;

const ip5 = _.clone(proto_inport);
ip5["id"] = "inport_05";
ip5["name"] = "inport_05";
ip5["display/order"] = 1;
ip5["subtype"] = "both";
ip5["display/widget"] = "combobox";

const ip6 = _.clone(proto_inport);
ip6["id"] = "inport_06";
ip6["name"] = "inport_06";
ip6["display/order"] = 2;
ip6["subtype"] = "both";
ip6["display/widget"] = "dropdown";

const ip7 = _.clone(proto_inport);
ip7["id"] = "inport_07";
ip7["name"] = "inport_07";
ip7["display/order"] = 3;
ip7["subtype"] = "both";
ip7["display/widget"] = "slider";

const ip8 = _.clone(proto_inport);
ip8["id"] = "inport_08";
ip8["name"] = "inport_08";
ip8["display/order"] = 3;
ip8["subtype"] = "both";
ip8["display/widget"] = "spinbox";

const ip9 = _.clone(proto_inport);
ip9["id"] = "inport_09";
ip9["name"] = "inport_09";
ip9["display/order"] = 3;
ip9["subtype"] = "both";
ip9["display/widget"] = "textarea";

const n1 = _.clone(proto_node);
n1["id"] = "node_1";
n1["name"] = "node_1";
n1["display/font/text"] = "node_1";
n1["display/translate/x"] = -3;

const n2 = _.clone(proto_node);
n2["id"] = "node_2";
n2["name"] = "node_2";
n2["display/font/text"] = "node_2";
n2["display/translate/y"] = -8;

const e1 = _.clone(proto_edge);
e1["id"] = "edge_1";
e1["name"] = "edge_1";
e1["source/id"] = "outport_1";
e1["destination/id"] = "inport_05";

const temp: object = {};
temp["scene_0"] = proto_scene;
temp["scene_0"]["graph_0"] = proto_graph;
temp["scene_0"]["graph_0"]["edge_1"] = e1;
temp["scene_0"]["graph_0"]["node_1"] = n1;
temp["scene_0"]["graph_0"]["node_1"]["inport_1"] = ip1;
temp["scene_0"]["graph_0"]["node_1"]["inport_2"] = ip2;
temp["scene_0"]["graph_0"]["node_1"]["inport_3"] = ip3;
// temp["scene_0"]["graph_0"]["node_1"]["inport_4"] = ip4;
temp["scene_0"]["graph_0"]["node_1"]["outport_1"] = op1;
// temp["scene_0"]["graph_0"]["node_1"]["outport_2"] = op2;
temp["scene_0"]["graph_0"]["node_2"] = n2;
temp["scene_0"]["graph_0"]["node_2"]["inport_05"] = ip5;
temp["scene_0"]["graph_0"]["node_2"]["inport_06"] = ip6;
temp["scene_0"]["graph_0"]["node_2"]["inport_07"] = ip7;
temp["scene_0"]["graph_0"]["node_2"]["inport_08"] = ip8;
temp["scene_0"]["graph_0"]["node_2"]["inport_09"] = ip9;
export const scene: object = tools.flatten(temp);
