<template>
    <v-app dark id="app" class="app" >
        <Table
            :data="data"
            :columns="columns"
            :header_masks="masks"
            :indent="indent"
        />
    </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DevContainer from "./components/DevContainer.vue";
import Table from "./components/table.vue";
import * as _ from "lodash";

import Vuetify from "vuetify";
Vue.use(Vuetify, {
    theme: {
        aspect_dark_1:   "#040404",
        aspect_dark_2:   "#141414",
        aspect_bg:       "#242424",
        aspect_grey_1:   "#343434",
        aspect_grey_2:   "#444444",
        aspect_light_1:  "#A4A4A4",
        aspect_light_2:  "#F4F4F4",
        aspect_dialog_1: "#444459",
        aspect_dialog_2: "#5D5D7A",
        aspect_red_1:    "#F77E70",
        aspect_red_2:    "#DE958E",
        aspect_orange_1: "#EB9E58",
        aspect_orange_2: "#EBB483",
        aspect_yellow_1: "#E8EA7E",
        aspect_yellow_2: "#E9EABE",
        aspect_green_1:  "#8BD155",
        aspect_green_2:  "#A0D17B",
        aspect_cyan_1:   "#7EC4CF",
        aspect_cyan_2:   "#B6ECF3",
        aspect_cyan_3:   "#3A4C4F",
        aspect_blue_1:   "#5F95DE",
        aspect_blue_2:   "#93B6E6",
        aspect_purple_1: "#C98FDE",
        aspect_purple_2: "#AC92DE",
        // aspect_hover:    "rgba(126, 196, 207, 1)",
    }
});

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

const acols = [
    cols,
];

const bcols = [
    ["node_name"],
    ["inport_name", "value"]
];

const ccols = [
    ["scene_id", "graph_id", "node_id", "node_name"],
    ["inport_name", "value", "default_value", "widget", "lock", "display"]
];

const dcols = [
    ["scene_id"],
    ["graph_id"],
    ["node_id", "node_name"],
    ["inport_name", "value", "default_value", "options", "widget", "lock"]
];

const data = _.map(rows, (row) => (_.zipObject(cols, row)) );

const masks = [false, false, false, false];

@Component( {components: { Table } })
export default class App extends Vue {
    public columns = ccols;
    public data = data.slice(0, 5);
    public masks = masks;
    public indent = true;
}
</script>

<style lang="less">
    .aspect-testarea textarea {
        margin-top: 0px !important;
        font-size: 12px;
        padding-left: 6px !important;
        padding-bottom: 2px !important;
    }

    * {
        box-shadow: unset !important;
    }

    .application.theme--dark {
        background-color: #141414;
        color: #F4F4F4;
    }

    .v-messages {
        display: none;
    }

    button, input, optgroup, select, textarea {
        font-size: 13px;
    }

    ::-moz-selection {
        background-color: rgba(126, 196, 207, 0.25);
        color: #F4F4F4;
        text-shadow: none;
    }
    ::selection {
        background-color: rgba(126, 196, 207, 0.25);
        color: #F4F4F4;
        text-shadow: none;
    }

    @import "./static/css/style.css";
</style>
