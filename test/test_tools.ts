import * as _ from "lodash";
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

const rows2 = [
    ["func1", "baz",  b,    b,   "dropdown",    "override", display],
    ["func1", "bar",  a,    a,   "combobox",    "override", display],
    ["func1", "boo", text, text, "textarea",    "unlocked", display],
    ["func1", "fuz", 55,   55,   "slider",      "present" , display],
    ["func1", "zag",  5,    8,   "spinbox",     "override", display],
    ["func1", "baz",  b,    b,   "dropdown",    "override", display],
    ["func1", "bar",  a,    a,   "combobox",    "override", display],
];

function add_index(data) {
    let i: number = 0;
    for (const row of data) {
        row.splice(0, 0, i);
        i++;
    }
}

const cols = [
    "scene_id", "graph_id", "node_id", "node/name",
    "name", "value", "default_value", "widget", "lock", "display"
];

const cols2 = [
    "node/name",
    "name", "value", "default_value", "widget", "lock", "display"
];

export const acols = [
    cols.slice(0, 3),
];

export const bcols = [
    ["node/name"],
    ["name", "value"]
];

export const ccols = [
    // ["scene_id", "graph_id", "node_id", "node/name"],
    ["node/name"],
    ["name", "value", "default_value", "widget", "lock"]// , "display"]
];

export const dcols = [
    ["scene_id"],
    ["graph_id"],
    ["node_id", "node/name"],
    ["name", "value", "default_value", "options", "widget", "lock"]
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

cols2.splice(0, 0, "__index");
add_index(rows2);
export const data = _.map(rows2, (row) => (_.zipObject(cols2, row)) );

export const masks = [false, false, false, false];
