<template>
    <v-app dark id="app">
        <!-- <TableAg :columns="columns" :rows="rows" :data="data" width /> -->
        <Table :data="data" :columns="columns"/>
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
            primary: "#F4F4F4",
            secondary: "#242424",
            accent: "#A4A4A4",
            error: "#F77E70",
            info: "#5F95DE",
            success: "#8BD155",
            warning: "#EB9E58"
        }
    });

    const rows = [
            ["scene-001",  "graph-001", "node-001", "func2", 0, [0,1,2,3], "slider",        "always"],
            ["scene-001",  "graph-001", "node-002", "func3", 2, [0,1,2,3], "float_input",   "always"],
            ["scene-002",  "graph-001", "node-001", "func2", 3, [0,1,2,3], "multidropdown", "always"],
            ["scene-002",  "graph-001", "node-001", "func2", 4, [0,1,2,3], "textarea",      "always"],
            ["scene-002",  "graph-001", "node-002", "func3", 5, [0,1,2,3], "slider",        "always"],
        ];

    const columns = [
        "scene-id", "graph-id", "node-id",
        "node-name", "value", "options", "widget", "pattern"
    ];

    const data = _.map(rows, (row) => (_.zipObject(columns, row)) );

    @Component( {components: { Table } })
    export default class App extends Vue {
        public columns = columns;
        public rows = rows;
        public data = data;
    }
</script>
