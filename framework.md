---SCENE------------------------------------------------------------------------
<id>   --> uuid written in full as <component>-<id>
keys   --> fields separated by single periods only
values --> may not include dicts or lists that contain dicts

[<display>]
    display.name:      <sgnep> ["function name", "function param name", "node name", "graph name", "scene name"]
    display.info:      <sgnep> ["description", "doc string", "tooltip"]
    display.version:   <sgn  > ["0.1"..."n.n"] major is controled by explicit saves, minor is through scene state change
    display.order:     < gnep> [int]
    display.selected:  < gne > [true, false]
    display.color:     < gnep> [r, g, b, a]
    display.translate: < gn  > [x,y,z]
    display.rotate:    < gn  > [x,y,z]
    display.scale:     < gn  > [x,y,z]
    display.widget:    <    p> ["none", "textbox", "slider", "range-slider", "color-picker", "dropdown", "multi-dropdown", "integer-input", "float-input"]

[scene-<id>]
    scene-<id>.<display>
    scene-<id>.resource-<id>:

[scene-<id>.graph-<id>]
    scene-<id>.graph-<id>.<display>
    scene-<id>.graph-<id>.type: ["normal", "view"]
    scene-<id>.graph-<id>.input-node-<id>:
    scene-<id>.graph-<id>.output-node-<id>:

[scene-<id>.edge-<id>]
    scene-<id>.edge-<id>.<display>
    scene-<id>.edge-<id>.outport: scene-<id>.graph-<id>.node-<id>.outport-<id>
    scene-<id>.edge-<id>.inport: scene-<id>.graph-<id>.node-<id>.inport-<id>

[scene-<id>.graph-<id>.node-<id>]
    scene-<id>.graph-<id>.node-<id>.<display>
    scene-<id>.graph-<id>.node-<id>.type: [input, output, subgraph, ...]
    scene-<id>.graph-<id>.node-<id>.operator.module: ["module-name"] (same as module)
    scene-<id>.graph-<id>.node-<id>.operator.function: ["function-name"] (same as function)
    scene-<id>.graph-<id>.node-<id>.subgraph.input-node: ["none", "scene-<id>.graph-<id>.node-<id>"] (if type == subgraph, node.type == "input")
    scene-<id>.graph-<id>.node-<id>.subgraph.output-node: ["none", "scene-<id>.graph-<id>.node-<id>"] (if type == subgraph, node.type == "output")

[scene-<id>.graph-<id>.node-<id>.inport-<id>]
    scene-<id>.graph-<id>.node-<id>.inport-<id>.value:
    scene-<id>.graph-<id>.node-<id>.inport-<id>.default:
    scene-<id>.graph-<id>.node-<id>.inport-<id>.type:
    scene-<id>.graph-<id>.node-<id>.inport-<id>.pattern:
    scene-<id>.graph-<id>.node-<id>.inport-<id>.<display>

[scene-<id>.graph-<id>.node-<id>.outport-<id>]
    scene-<id>.graph-<id>.node-<id>.outport-<id>.value:
    scene-<id>.graph-<id>.node-<id>.outport-<id>.<display>

---EVENTS-----------------------------------------------------------------------
SearchBox
    create
        scene
        graph
        node
    read
        scene
        graph
        node
    update
        save (scene)
        execute (scene)
    delete
        scene (server)
        graph (client)
        node (client)
        edge (client)

SceneView
    select-nodes
    deselect-nodes
    delete-node
    select-edges
    deselect-edges
    delete-edge
    create-edge
    pick-walk
    translate
    rotate
    scale
    rename
    recolor

NodePanel
    select-node
    select-nodes
    walk-up
    walk-down
    set-value
    hover-value (css event)
    click-config
        set-default
        set-widget
        set-type
        set-pattern

---WEB-COMPONENTS---------------------------------------------------------------
App
    |-- SceneViewer
    |   |-- Overlay (HUD with scene name, etc)
    |   |-- ThreeJS
    |       |-- Node (rectalinear prism)
    |       |       Color
    |       |       Name
    |       |-- Edge (cylinder of dynamic length)
    |               Color
    |               Name
    |-- SearchBox (a la VSCode's Search)
    |   |-- CommandInput
    |   |-- ResultBox { ag-grid }
    |-- NodePanel { ag-grid }
        |-- Item --> node --> function { row }
            |-- Parameter --> inport --> function parameter { value cell, type cell }
                |-- Widget
                    |-- Config (sets widget, default, pattern, color) { ag-grid }
                    |-- Tooltip (doc strings)                         { hsy-vue-tooltip }
                    |-- Textbox (option)                              { textarea }
                    |-- Slider (option)                               { vue-slider-component }
                    |-- RangeSlider (option)                          { vue-slider-component }
                    |-- ColorPicker (option)                          { vue-color }
                    |-- Dropdown (option)                             { vue-select }
                    |-- MultiDropdown (option)                        { vue-select }
                    |-- IntegerInput (option)                         { vue-number-input }
                    |-- FloatInput (option)                           { vue-number-input }

DataTable
    Should be used for SearchBox, Config, NodePanel and NodePanel configuration.
    Inport order determines intra-node inport row order.
    Outport order determines intra-node outport row order.
    Node row groups are sorted by most recently selected then alphabetical by name.
    Graph row groups are sorted by most recently selected then alphabetical by name.
    Use immutable, chainable API.

---DSL--------------------------------------------------------------------------
Component   Query
----------------------------------------------------
All         all=(name, id)
Scene       scene=(name, id)
Graph       graph=(name, id)
Edge        edge=(id)
Node        node=(name, id, type, module, function)
Inport      inport=(name, id)
Outport     outport=(name, id)

a= expands to all=
s= expands to scene=
g= expands to graph=
e= expands to edge=
n= expands to node=
i= expands to inport=
o= expands to outport=

Field type is specified with <field>.<field-type>
Name is default field type
all.name       all.id
scene.name     scene.id
graph.name     graph.id
               edge.id
node.name      node.id      node.type   node.module     node.function
inport.name    inport.id
outport.name   outport.id

| and & for chaining queries

---PLUGIN-----------------------------------------------------------------------
    Same as appp but with the SceneViewer replaced
    Viewer3D (subclass of SceneViewer)
    Viewer2D (like Nuke's viewer)
    ViewerTable (DataTable editor)

    input --> viewer --> output
                |
                V
            javascript
            Viewer component

---FUNCTIONS--------------------------------------------------------------------
dotsplit( scene, scene-<id>.graph-<id>.node-<id>.inport-<id> ) => {
    scene: scene-<id>,
    graph: graph-<id>,
    node: node-<id>,
    inport: inport-<id>
}

to_dict(scene, key) => {
    graph-<id>: {
        input-node: node-<id>,
        output-node: node-<id>,
        display: {
            name: <name>,
            info: <info>,
            version: <version>,
            order: <order>,
            selected: <selected>,
            color: <color>,
            translate: <translate>,
            rotate: <rotate>,
            scale: <scale>
        }
    }
}

resolve
    ( scene, graph-<id>    ) => scene-<id>.graph-<id>
    ( scene, edge-<id>     ) => scene-<id>.edge-<id>
    ( scene, node-<id>     ) => scene-<id>.graph-<id>.node-<id>
    ( scene, inport-<id>   ) => scene-<id>.graph-<id>.node-<id>.inport-<id>
    ( scene, outport-<id>  ) => scene-<id>.graph-<id>.node-<id>.outport-<id>

unresolve
    unresolve_to_id
        ( scene, scene-<id>.graph-<id>                        ) => graph-<id>
        ( scene, scene-<id>.edge-<id>                         ) => edge-<id>
        ( scene, scene-<id>.graph-<id>.node-<id>              ) => node-<id>
        ( scene, scene-<id>.graph-<id>.node-<id>.inport-<id>  ) => inport-<id>
        ( scene, scene-<id>.graph-<id>.node-<id>.outport-<id> ) => outport-<id>

    unresolve_to_name
        ( scene, scene-<id>                                   ) => scene-<id>.display.name
        ( scene, scene-<id>.graph-<id>                        ) => graph-<id>.display.name
        ( scene, scene-<id>.edge-<id>                         ) => edge-<id>.display.name
        ( scene, scene-<id>.graph-<id>.node-<id>              ) => node-<id>.display.name
        ( scene, scene-<id>.graph-<id>.node-<id>.inport-<id>  ) => inport-<id>.display.name
        ( scene, scene-<id>.graph-<id>.node-<id>.outport-<id> ) => outport-<id>.display.name

filter
    filter_by_value
        ( scene, value         ) => [ scene-<id>.graph-<id>.node-<id>.port-<id>...    ]

    filter_by_id
        ( scene, graph-<id>    ) => [ scene-<id>.graph-<id>...                        ]
        ( scene, edge-<id>     ) => [ scene-<id>.edge-<id>...                         ]
        ( scene, node-<id>     ) => [ scene-<id>.graph-<id>.node-<id>...              ]
        ( scene, inport-<id>   ) => [ scene-<id>.graph-<id>.node-<id>.inport-<id>...  ]
        ( scene, outport-<id>  ) => [ scene-<id>.graph-<id>.node-<id>.outport-<id>... ]

    filter_by_name
        ( scene, graph-name    ) => [ scene-<id>.graph-<id>...                        ]
        ( scene, node-name     ) => [ scene-<id>.graph-<id>.node-<id>...              ]
        ( scene, inport-name   ) => [ scene-<id>.graph-<id>.node-<id>.inport-<id>...  ]
        ( scene, outport-name  ) => [ scene-<id>.graph-<id>.node-<id>.outport-<id>... ]
        ( scene, module-name   ) => [ scene-<id>.graph-<id>.node-<id>...              ]
        ( scene, function-name ) => [ scene-<id>.graph-<id>.node-<id>...              ]
        ( scene, node-type     ) => [ scene-<id>.graph-<id>.node-<id>...              ]

    filter_by_component
        ( scene, "graph"       ) => [ scene-<id>.graph-<id>...                        ]
        ( scene, "edge"        ) => [ scene-<id>.edge-<id>...                         ]
        ( scene, "node"        ) => [ scene-<id>.graph-<id>.node-<id>...              ]
        ( scene, "inport"      ) => [ scene-<id>.graph-<id>.node-<id>.inport-<id>...  ]
        ( scene, "outport"     ) => [ scene-<id>.graph-<id>.node-<id>.outport-<id>... ]

---CACHE------------------------------------------------------------------------
luts
    graph_lut = { graph-<id>: scene-<id>.graph-<id> }
    graph_ilut = { <graph.name>: [graph-<id>] }

    node_lut = { node-<id>: scene-<id>.graph-<id>.node-<id> }
    node_ilut = { <node.name>: [node-<id>...] }

    edge_lut = { edge-<id>: scene-<id>.edge-<id> }
    edge_ilut = { inport-<id>: edge-<id> } (one edge per inport)

    inport_lut = {
        inport-<id>: scene-<id>.graph-<id>.node-<id>.inport-<id>
    }
    inport_ilut = {
        <inport.name>: [scene-<id>.graph-<id>.node-<id>.inport-<id>...]
    }

    outport_lut = {
        outport-<id>: scene-<id>.graph-<id>.node-<id>.outport-<id>
    }
    outport_ilut = {
        <outport.name>: [scene-<id>.graph-<id>.node-<id>.outport-<id>...]
    }

Scene DataFrame



---BROADER-FRAMEWORK------------------------------------------------------------
client
    |-- client-config
    |-- server-config
    |-- scene
    |-- properties panel
    |-- search
    |-- crud sgne
    |-- undo cache
        |- scene
        |-- client-config
        |-- server-config

resource-server (crud) update versions elements
    |-- code
    |-- data
    |-- client-config
    |-- server-config
    |-- scene [scene-id, scene-name and version]
    |-- graph [graph-id, graph-name and version]
    |-- nodes (from code)

    talks to S3

job-server
    |
    receive scene
    |
    parse scene -- graph cache
    |
    schedule jobs -- response cache
    |
    emit jobs

provisioner
    |
    setup worker
    |
    send job
    |
    receive status
    |
    teardown worker
    |
    send response to job server

worker
    |
    receive job
    |
    find function
    |
    call function
    |    |-- resolve data resources @aspect
    |    |-- compute data with input parameters
    |    |-- write new data resource @aspect
    |    |-- resolve output dict @aspect
    |    |-- return dict
    |
    send status and dict to provisioner

event server

widgets
    |-- text box
    |-- slider - ion.rangeSlider
    |-- checkbox
    |-- dropdown
    |-- multi dropdown
