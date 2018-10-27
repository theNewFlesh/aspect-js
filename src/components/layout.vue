<template>
    <multipane
        id="layout"
        class="custom-resizer"
        layout="vertical"
    >
        <div id="scene-panel" class="pane">
            <div>
                <h6>scene-panel</h6>
            </div>
        </div>

        <multipane-resizer id="resize-bar"></multipane-resizer>

        <div id="node-panel" class="pane">
            <v-app dark>
                <Table
                    :data="data"
                    :columns="columns"
                    :header_masks="masks"
                    :indent="indent"
                />
            </v-app>
        </div>
    </multipane>
</template>

<script lang="ts">
    import { Component, Vue } from "vue-property-decorator";
    import Table from "./table.vue";
    import { Multipane, MultipaneResizer } from "vue-multipane";
    import * as _ from "lodash";
    import * as tt from "../test_tools";

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
            // aspect_hover:    "rgba(126, 196, 207, 0.25)",
        }
    });

    @Component( {components: { Table, Multipane, MultipaneResizer } })
    export default class Layout extends Vue {
        public columns = tt.bcols;
        public data = tt.data.slice(0, 20);
        public masks = tt.masks;
        public indent = true;
    }
</script>

<style lang="less">
    .layout-v > .multipane-resizer {
        width: 4px;
    }

    .custom-resizer {
        width: 100%;
        height: 100vh;
    }

    .custom-resizer > .pane {
        overflow: hidden;
    }

    .custom-resizer.layout-v > .multipane-resizer {
        margin: 0;
        left: 0;
        position: relative;
        background: #343434;
        &:hover {
            background: rgba(126, 196, 207, 0.25);
        }
    }

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

    ::grammar-error,
    ::spelling-error {
        color: #F77E70;
    }

    @import "../static/css/style.css";
</style>
