<template>
    <div id="dag-pane" ref="dag-pane">
    </div>
</template>

<script lang="ts">
    import { Prop, Component, Vue } from "vue-property-decorator";
    import * as _ from "lodash";
    import * as THREE from "three";
    import { MeshLine, MeshLineMaterial } from "three.meshline";
    import * as CreateOrbitControls from "three-orbit-controls";
    import { DAG } from "../three/dag";
    // -------------------------------------------------------------------------

    /**
     * The DagPane class is responsible for rendering a Aspect DAG in a
     * ThreeJS scene
     */
    @Component
    export default class DagPane extends Vue {
        /**
         * Scene component
         */
        public scene;

        /**
         * DAG component
         */
        public dag: DAG;

        /**
         * Scene definition
         */
        @Prop({ required: true })
        public params: object;

        /**
         * Width of DAG window
         */
        @Prop({ required: true })
        public width: number;

        /**
         * Height of DAG window
         */
        @Prop({ required: true })
        public height: number;

        /**
         * Creates a new DAG component, assigns scene a width and height and
         * updates DAG with scene
         */
        public created() {
            // TODO: replace me with scene independent logic
            this.dag = new DAG(this.width, this.height);
            this.params["session/width"] = this.width;
            this.params["session/height"] = this.height;
            this.dag.edit(this.params);
            this.scene = this.dag.parent;
        }

        /**
         * Tells ThreeJS scene to render
         */
        public mounted() {
            const elem = document.getElementById("dag-pane");
            this.scene.render(elem, window);
            this.animate();
        }

        /**
         * Update ThreeJS scene. Called at regular intervals.
         */
        public animate() {
            window.requestAnimationFrame(this.animate);
            this.scene.render_update();
        }
    }
</script>

<style lang="stylus">
</style>
