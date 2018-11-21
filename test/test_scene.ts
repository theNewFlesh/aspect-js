import * as tools from "../src/core/tools";
// -----------------------------------------------------------------------------

const cyan2 = tools.HSV_COLORS["aspect_cyan_2"];
const grey2 = tools.HSV_COLORS["aspect_grey_2"];

const proto_scene: object = {
    "id":              "uuid0",
    "resource_<id>":   "",
    "display/name":    "",
    "display/info":    "",
    "display/version": "",
};

const proto_edge: object = {
    "id":                       "uuid1",
    "from":                     "",
    "to":                       "uuid4",
    "type":                     "",
    "display/name":             "edge",
    "display/info":             "",
    "display/order":            "",
    "display/selected":         "",
    "display/visible":          true,
    // "display/from/translate/x": 0,
    // "display/from/translate/y": 4,
    // "display/from/translate/z": 0,
    "display/from/visible":     true,
    // "display/to/translate/x":   0,
    // "display/to/translate/y":   0,
    // "display/to/translate/z":   0,
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
    "id":                  "uuid2",
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
    "id":                            "uuid3",
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
    "id":                       "uuid4",
    "value":                    "",
    "default_value":            "",
    "type":                     "",
    "lock":                     "",
    "display/name":             "inport",
    "display/widget":           "",
    "display/options":          "",
    "display/info":             "",
    "display/order":            "",
};

const proto_outport: object = {
    "id":                       "uuid5",
    "display/name":             "outport",
    "display/info":             "",
    "display/order":            "",
};

const temp: object = {};
temp["scene_<id>"] = proto_scene;
temp["scene_<id>"]["edge_<id>"] = proto_edge;
temp["scene_<id>"]["graph_<id>"] = proto_graph;
temp["scene_<id>"]["graph_<id>"]["edge_<id>"] = proto_edge;
temp["scene_<id>"]["graph_<id>"]["node_<id>"] = proto_node;
temp["scene_<id>"]["graph_<id>"]["node_<id>"]["inport_<id>"] = proto_inport;
temp["scene_<id>"]["graph_<id>"]["node_<id>"]["outport_<id>"] = proto_outport;
export const scene: object = tools.flatten(temp);
