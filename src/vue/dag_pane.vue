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
    import { scene as test_scene } from "../../test/test_scene";
    // -------------------------------------------------------------------------

    @Component
    export default class DagPane extends Vue {
        public scene;
        public dag;

        @Prop({ required: true })
        public width: number;

        @Prop({ required: true })
        public height: number;

        public created() {
            this.dag = new DAG();
            test_scene["width"] = this.width;
            test_scene["height"] = this.height;
            this.dag.update(test_scene);
            this.scene = this.dag.parent;
        }

        public mounted() {
            const elem = document.getElementById("dag-pane");
            this.scene.render(elem, window);
            this.animate();
        }

        public animate() {
            requestAnimationFrame(this.animate);
            this.scene.render_update();
        }
    }
</script>

<style lang="less">
</style>
