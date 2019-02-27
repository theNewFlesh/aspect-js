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
        <div id="dag-pane" class="pane" ref="dag_pane">
            <DagPane
                :width="__dag_pane_width"
                :height="__dag_pane_height"
            >
            </DagPane>
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
    import DagPane from "./dag_pane.vue";
    import { Multipane, MultipaneResizer } from "vue-multipane";
    import * as _ from "lodash";
    import { Params } from "../../src/core/params";
    import { scene } from "../../test/test_scene";
    import { HEX_COLORS } from "../core/tools";

    import Vuetify from "vuetify";
    Vue.use(Vuetify, {
        theme: HEX_COLORS,
    });

    /**
     * The Layout component the DagPane and NodePane components
     */
    @Component( {components: { Table, DagPane, Multipane, MultipaneResizer } })
    export default class Layout extends Vue {
        /**
         * Data for NodePane table
         */
        public data = new Params(scene).to_node_pane()[0];

        /**
         * Index for NodePane table
         */
        public index = new Params(scene).to_node_pane()[1];

        /**
         * Whether the NodePane is collapsed
         */
        public _collapsed: boolean = false;

        /**
         * Previous width of the DagPane
         */
        public _prev_dag_width: number;

        /**
         * Current width of the DagPane
         */
        private __dag_pane_width: number;

        /**
         * Current height of the DagPane
         */
        private __dag_pane_height: number;

        /**
         * Percentage of window width of the DagPane
         */
        @Prop({default: 75})
        public dag_width: number;

        /**
         * Percentage of window Width at which NodePane will collapse
         */
        @Prop({default: 16})
        public collapse_width: number;

        /**
         * Update DagPane shape
         */
        public created() {
            this.__update_dag_pane_shape();
        }

        /**
         * Set DagPane and NodePane widths
         */
        public mounted() {
            this._set_width(this.$refs.dag_pane, this.dag_width);
            this._set_width(this.$refs.node_pane, 100 - this.dag_width);
            this._prev_dag_width = this._get_width(this.$refs.dag_pane);
        }

        /**
         * Set width of DagPane
         */
        private __update_dag_pane_shape(): void {
            let width: number = window.outerWidth * (this.dag_width / 100);
            if (this.$refs.dag !== undefined) {
                width = this._get_width(this.$refs.dag);
                width = width * 100 * window.outerWidth;
            }
            this.__dag_pane_width = width;
            this.__dag_pane_height = window.outerHeight;
        }

        /**
         * Get width of given DOM element
         * @param element DOM element
         */
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

        /**
         * Sets width of given element to given width
         * @param element DOM element
         * @param width Width in vw (percentage) units
         */
        public _set_width(element: any, width: number) {
            const num = Math.round(width * 10) / 10;
            element.style.width = num.toString() + "vw";
        }

        /**
         * Event handler for when user begins dragging pane divider.
         * Sets _prev_dag_width to DOM element width
         * @param DOM element
         */
        public _on_resize_start(element: any) {
            this._prev_dag_width = this._get_width(element);
        }

        /**
         * Event handler for when the user continues dragging the pane divider.
         * Updates the DagPane and NodePane width.
         * @param element Ignored DOM element
         */
        public _on_resize(element: any) {
            const dag_pane: any = this.$refs.dag_pane;
            const node_pane: any = this.$refs.node_pane;

            const sw: number = this._get_width(dag_pane);
            this._set_width(dag_pane, sw);
            this._set_width(node_pane, 100 - sw);

            this.__update_dag_pane_shape();
        }

        /**
         * Event handler for when the user stops dragging the pane divider.
         * Collapses the NodePane if it is beneath threshold
         */
        public _on_resize_stop(element: any) {
            const dag_pane: any = this.$refs.dag_pane;
            const node_pane: any = this.$refs.node_pane;
            let dag_width: number = this._get_width(dag_pane);

            // autosize_event refers to collapsing or expanding the NodePane
            let autosize_event: boolean = false;
            const delta: number = Math.abs(dag_width - this._prev_dag_width);
            if (delta <= 0.1 || dag_width > 100 - this.collapse_width) {
                autosize_event = true;
            }

            if (autosize_event) {
                // expand NodePane
                if (this._collapsed) {
                    dag_width = 100 - this.collapse_width;
                }
                // collapse NodePane
                else {
                    dag_width = 99.8;
                }
                this._collapsed = !this._collapsed;
            }

            this._set_width(dag_pane, dag_width);
            this._set_width(node_pane, 100 - dag_width);

            this.__update_dag_pane_shape();
        }
    }
</script>

<style lang="stylus">
    @import "../static/css/vuetify.css"
    @import "../static/css/config.styl"

    .application.theme--dark
        background: aspect_dark_2
        color: aspect_light_2

    .theme--dark .v-text-field--solo .v-input__slot,
    .application .theme--dark.v-text-field--solo .v-input__slot
        border-radius: 0px
        background: #d1a4a4

    .theme--dark.v-list .v-list__tile--link:hover,
    .theme--dark.v-list .v-list__tile--highlighted,
    .theme--dark.v-list .v-list__group__header:hover
        background: aspect_highlight_alpha

    .v-text-field
        padding-top: 0px

    .v-text-field input
        padding: unset

    .v-select__slot
        align-items: center
        height: 100%
        width: 10000%

    .v-select__selections
        padding-left: 6px

    // ---widget-indicators-----------------------------------------------------
    .v-input__slot
        margin-bottom: unset
        min-height: unset

    .v-input__append-inner
        margin-top: 0px !important

    .v-input__slot::before
        display: none !important

    .v-icon
        font-size: 16px
        color: unset
    // -------------------------------------------------------------------------

    // ---dropdown-list---------------------------------------------------------
    .theme--dark .v-list,
    .application .theme--dark.v-list
        background: aspect_grey_1
        color: aspect_light_2
        padding: 0px 0px 0px 0px

    .v-list__tile
        font-size: 13px
        height: 30px
        padding: 0 8px
    // -------------------------------------------------------------------------

    // ---textarea--------------------------------------------------------------
    .v-textarea.v-text-field--enclosed .v-text-field__slot textarea
        padding-right: 4px

    .v-textarea.v-text-field--box textarea,
    .v-textarea.v-text-field--box .v-text-field__prefix,
    .v-textarea.v-text-field--box.v-text-field--single-line textarea,
    .v-textarea.v-text-field--box.v-text-field--single-line .v-text-field__prefix,
    .v-textarea.v-text-field--enclosed textarea,
    .v-textarea.v-text-field--enclosed .v-text-field__prefix,
    .v-textarea.v-text-field--enclosed.v-text-field--single-line textarea,
    .v-textarea.v-text-field--enclosed.v-text-field--single-line .v-text-field__prefix
        margin-top: 0px

    .v-text-field.v-text-field--enclosed > .v-input__control > .v-input__slot
        padding-left: 0px
        padding-right: 0px
        padding-top: 0px
    // -------------------------------------------------------------------------

    .multipane
        height: 100vh
        display: inline-flex

    .pane
        // overflow: hidden
        flex-grow: 1
        width: 100%

    .multipane .multipane-resizer
        width: 4px
        margin: 0
        left: 0
        position: relative
        background: aspect_grey_1
        &:hover
            background: aspect_highlight_alpha

    *
        box-shadow: unset !important

    .v-messages
        display: none

    button, input, optgroup, select, textarea
        font-size: 13px

    ::-moz-selection
        background-color: aspect_highlight_alpha
        color: aspect_light_2
        text-shadow: none

    ::selection
        background-color: aspect_highlight_alpha
        color: aspect_light_2
        text-shadow: none

    ::grammar-error,
    ::spelling-error
        color: aspect_red_1

    .v-menu__content
        position: fixed
</style>
