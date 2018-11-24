import * as _ from "lodash";
import * as uuidv4 from "uuid/v4";
import * as tools from "../src/core/tools";
// -----------------------------------------------------------------------------

const display = {
    color: "aspect_bg",
    options: {
        min: 10,
        max: 60,
        step: 5,
        tick_step: 10,
        round: 3,
        values: [
            "alpha", "bravo", "charlie", "delta", "echo",
        ],
        default_color: "aspect_cyan_1",
    }
};

const text = "testy mctest test";
const a = "alpha";
const b = "bravo";

const rows = [
    // [null, "graph_001", "node_001", "func1", "baz", b, b, "dropdown", "override", display],
    ["scene_001",  "graph_001", "node_099", "func1", "baz",  b,    b,   "dropdown",    "override", display],
    ["scene_001",  "graph_001", "node_099", "func1", "bar",  a,    a,   "combobox",    "override", display],
    ["scene_001",  "graph_001", "node_099", "func1", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_001",  "graph_001", "node_099", "func1", "fuz", 55,   55,   "slider",      "present" , display],
    ["scene_001",  "graph_001", "node_099", "func1", "zag",  5,    8,   "spinbox",     "override", display],
    ["scene_002",  "graph_001", "node_001", "func1", "baz",  b,    b,   "dropdown",    "override", display],
    ["scene_002",  "graph_001", "node_001", "func1", "bar",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_001", "func1", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_002", "func1", "fuz", 55,   55,   "slider",      "present" , display],
    ["scene_002",  "graph_001", "node_003", "func1", "zag",  5,    8,   "spinbox",     "override", display],
    ["scene_002",  "graph_001", "node_003", "func2", "boo", text, text, "slider",      "unlocked", display],
    ["scene_002",  "graph_001", "node_003", "func2", "fuz", text, text, "slider",      "present",  display],
    ["scene_002",  "graph_001", "node_003", "func3", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_003", "func3", "fuz", 55,   55,   "none",        "present" , display],
    ["scene_002",  "graph_001", "node_004", "func4", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_004", "func4", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_004", "func4", "fuz", 55,   55,   "slider",      "present" , display],
    ["scene_002",  "graph_001", "node_005", "func5", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_005", "func5", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_005", "func5", "fuz", 55,   55,   "none",        "present" , display],
    ["scene_002",  "graph_001", "node_005", "func5", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_005", "func5", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_005", "func5", "fuz", 55,   55,   "slider",      "present" , display],
    ["scene_002",  "graph_001", "node_005", "func5", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_006", "func6", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_006", "func6", "fuz", 55,   55,   "none",        "present" , display],
    ["scene_002",  "graph_001", "node_006", "func6", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_006", "func6", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_006", "func6", "fuz", 55,   55,   "slider",      "present" , display],
    ["scene_002",  "graph_001", "node_007", "func7", "baz",  a,    a,   "combobox",    "override", display],
    ["scene_002",  "graph_001", "node_007", "func7", "boo", text, text, "textarea",    "unlocked", display],
    ["scene_002",  "graph_001", "node_007", "func7", "fuz", 55,   55,   "none",        "present" , display],
];

function add_index(data) {
    let i: number = 0;
    for (const row of data) {
        row.splice(0, 0, i);
        i++;
    }
}

const cols = [
    "scene_id", "graph_id", "node_id", "node_name",
    "inport_name", "value", "default_value", "widget", "lock", "display"
];

export const acols = [
    cols.slice(0, 3),
];

export const bcols = [
    ["node_name"],
    ["inport_name", "value"]
];

export const ccols = [
    // ["scene_id", "graph_id", "node_id", "node_name"],
    ["node_name"],
    ["inport_name", "value", "default_value", "widget", "lock"]// , "display"]
];

export const dcols = [
    ["scene_id"],
    ["graph_id"],
    ["node_id", "node_name"],
    ["inport_name", "value", "default_value", "options", "widget", "lock"]
];

const _index = [];
for (const cols of ccols) {
    _index.push({
        columns: cols,
        group: cols[0],
        indent: true,
        hide_headers: false,
    });
}
export const index = _index;

cols.splice(0, 0, "__index");
add_index(rows);
export const data = _.map(rows, (row) => (_.zipObject(cols, row)) );

export const masks = [false, false, false, false];
