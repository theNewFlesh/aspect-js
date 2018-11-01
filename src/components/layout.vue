<template>
    <multipane
        ref="multipane"
        id="layout"
        class="multipane"
        layout="vertical"
        v-on:paneResize="_on_resize"
        v-on:paneResizeStart="_on_resize_start"
        v-on:paneResizeStop="_on_resize_stop"
    >
        <div id="scene-pane" class="pane" ref="scene_pane">
            <Scene
                :width="__scene_pane_width"
                :height="__scene_pane_height"
            >
            </Scene>
        </div>

        <multipane-resizer class="multipane-resizer">
        </multipane-resizer>

        <div id="node-pane" class="pane" ref="node_pane">

            <v-app dark class="pane-app">
                <Table
                    :data="data"
                    :index="index"
                />
            </v-app>
        </div>

        <multipane-resizer
            ref="resizer_right"
            class="multipane-resizer"
        >
        </multipane-resizer>
    </multipane>
</template>

<script lang="ts">
    import { Prop, Component, Vue } from "vue-property-decorator";
    import Table from "./table.vue";
    import Scene from "./scene.vue";
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

    @Component( {components: { Table, Scene, Multipane, MultipaneResizer } })
    export default class Layout extends Vue {
        public columns = tt.ccols;
        public data = tt.data;
        public masks = tt.masks;
        public indent = true;
        public index = tt.index;
        public _collapsed: boolean = false;
        public _prev_scene_width: number;

        private __scene_pane_width: number;
        private __scene_pane_height: number;

        @Prop({default: 75})
        public scene_width: number;

        @Prop({default: 16})
        public collapse_width: number;

        public created() {
            this.__update_scene_pane_shape();
        }

        public mounted() {
            this._set_width(this.$refs.scene_pane, this.scene_width);
            this._set_width(this.$refs.node_pane, 100 - this.scene_width);
            this._prev_scene_width = this._get_width(this.$refs.scene_pane);
        }

        private __update_scene_pane_shape(): void {
            let width: number = window.outerWidth * (this.scene_width / 100);
            if (this.$refs.scene !== undefined) {
                width = this._get_width(this.$refs.scene);
                width = width * 100 * window.outerWidth
            }
            this.__scene_pane_width = width;
            this.__scene_pane_height = window.outerHeight;
        }

        public _get_width(element: any): number {
            let width = element.style.width;

            if (width.match("px")) {
                width = width.replace("px", "");
                width = Number(width);
                width = (width / window.outerWidth) * 100;
            }
            else {
                width = width.replace("vw", "");
                width = Number(width);
            }
            return width;
        }

        public _set_width(element: any, width: number) {
            const num = Math.round(width * 10) / 10;
            element.style.width = num.toString() + "vw";
        }

        public _on_resize_start(element: any) {
            this._prev_scene_width = this._get_width(element);
        }

        public _on_resize(element: any) {
            const scene_pane: any = this.$refs.scene_pane;
            const node_pane: any = this.$refs.node_pane;

            let sw: number = this._get_width(scene_pane);
            this._set_width(scene_pane, sw);
            this._set_width(node_pane, 100 - sw);

            this.__update_scene_pane_shape();
        }

        public _on_resize_stop(element: any) {
            const scene_pane: any = this.$refs.scene_pane;
            const node_pane: any = this.$refs.node_pane;
            let sw: number = this._get_width(scene_pane);

            let autosize_event: boolean = false;
            const delta: number = Math.abs(sw - this._prev_scene_width);
            if (delta <= 0.1 || sw > 100 - this.collapse_width) {
                autosize_event = true;
            }

            if (autosize_event) {
                if (this._collapsed) {
                    sw = 100 - this.collapse_width;
                }
                else {
                    sw = 99.8;
                }
                this._collapsed = !this._collapsed;
            }

            this._set_width(scene_pane, sw);
            this._set_width(node_pane, 100 - sw);

            this.__update_scene_pane_shape();
        }
    }
</script>

<style lang="less">
    .multipane {
        height: 100vh;
        display: inline-flex;
    }

    .pane {
        // overflow: hidden;
        flex-grow: 1;
        width: 100%;
    }

    .multipane .multipane-resizer {
        width: 4px;
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

    .v-menu__content {
        position: fixed;
    }

    @import "../static/css/style.css";
</style>
