import * as _ from "lodash";

const display = {
    color: "aspect_bg",
    options: {
        min: 10,
        max: 60,
        step: 5,
        tick_step: 10,
        round: 3,
        values: [
            // "----------------------------------------------------------------------------------------------------",
            "alpha", "bravo", "charlie", "delta", "echo",
        ],
        default_color: "aspect_cyan_1",
    }
}

const text = "texty mctest test";
const a = "alpha";
const b = "bravo";

let rows = [
    ["scene_002",  "graph_001", "node_001", "func1", "baz",  b,    b,   "dropdown",    "override", display],
    ["scene_002",  "graph_001", "node_001", "func1", "bar",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_001", "func1", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_002", "func1", "fuz", 55,   55,   "slider",      "present" , display],
    ["scene_002",  "graph_001", "node_003", "func1", "zag",  5,    8,   "spinbox",     "override", display],
    ["scene_002",  "graph_001", "node_003", "func3", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_003", "func3", "fuz", 55,   55,   "none",        "present" , display],
    ["scene_001",  "graph_001", "node_004", "func4", "foo", 50,   50,   "none",        "absent"  , display],
    ["scene_001",  "graph_001", "node_004", "func4", "bar", 52,   52,   "float_input", "present" , display],
    ["scene_002",  "graph_001", "node_004", "func4", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_004", "func4", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_004", "func4", "fuz", 55,   55,   "slider",      "present" , display],
    ["scene_002",  "graph_001", "node_005", "func5", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_005", "func5", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_005", "func5", "fuz", 55,   55,   "none",        "present" , display],
    ["scene_001",  "graph_001", "node_005", "func5", "foo", 50,   50,   "none",        "absent"  , display],
    ["scene_001",  "graph_001", "node_005", "func5", "bar", 52,   52,   "float_input", "present" , display],
    ["scene_002",  "graph_001", "node_005", "func5", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_005", "func5", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_005", "func5", "fuz", 55,   55,   "slider",      "present" , display],
    ["scene_002",  "graph_001", "node_005", "func5", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_006", "func6", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_006", "func6", "fuz", 55,   55,   "none",        "present" , display],
    ["scene_001",  "graph_001", "node_006", "func6", "foo", 50,   50,   "none",        "absent"  , display],
    ["scene_001",  "graph_001", "node_006", "func6", "bar", 52,   52,   "float_input", "present" , display],
    ["scene_002",  "graph_001", "node_006", "func6", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_006", "func6", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_006", "func6", "fuz", 55,   55,   "slider",      "present" , display],
    ["scene_002",  "graph_001", "node_007", "func7", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_007", "func7", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_007", "func7", "fuz", 55,   55,   "none",        "present" , display],
];

const cols = [
    "scene_id", "graph_id", "node_id", "node_name",
    "inport_name", "value", "default_value", "widget", "lock", "display"
]

export const acols = [
    cols,
];

export const bcols = [
    ["node_name"],
    ["inport_name", "value"]
];

export const ccols = [
    ["scene_id", "graph_id", "node_id", "node_name"],
    ["inport_name", "value", "default_value", "widget", "lock"]//, "display"]
];

export const dcols = [
    ["scene_id"],
    ["graph_id"],
    ["node_id", "node_name"],
    ["inport_name", "value", "default_value", "options", "widget", "lock"]
];

export const data = _.map(rows, (row) => (_.zipObject(cols, row)) );

export const masks = [false, false, false, false];
