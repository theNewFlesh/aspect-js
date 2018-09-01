---SCENE------------------------------------------------------------------------
<id>   --> uuid written in full as <component>_<id>
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
    display.widget:    <    p> ["inert", "textarea", "slider", "range_slider", "color_picker", "dropdown", "combobox", "spinbox"]
    display.options    <    p> various widget display options in a dict, such as {"min": 0, "max": 100, "step": 1}

[scene_<id>]
    scene_<id>.<display>
    scene_<id>.resource_<id>:

[scene_<id>.graph_<id>]
    scene_<id>.graph_<id>.<display>
    scene_<id>.graph_<id>.type: ["normal", "view"]
    scene_<id>.graph_<id>.input_node_<id>:
    scene_<id>.graph_<id>.output_node_<id>:

[scene_<id>.edge_<id>]
    scene_<id>.edge_<id>.<display>
    scene_<id>.edge_<id>.outport: scene_<id>.graph_<id>.node_<id>.outport_<id>
    scene_<id>.edge_<id>.inport: scene_<id>.graph_<id>.node_<id>.inport_<id>

[scene_<id>.graph_<id>.node_<id>]
    scene_<id>.graph_<id>.node_<id>.<display>
    scene_<id>.graph_<id>.node_<id>.type: [input, output, subgraph, ...]
    scene_<id>.graph_<id>.node_<id>.operator.module: ["module_name"] (same as module)
    scene_<id>.graph_<id>.node_<id>.operator.function: ["function_name"] (same as function)
    scene_<id>.graph_<id>.node_<id>.subgraph.input_node: ["none", "scene_<id>.graph_<id>.node_<id>"] (if type == subgraph, node.type == "input")
    scene_<id>.graph_<id>.node_<id>.subgraph.output_node: ["none", "scene_<id>.graph_<id>.node_<id>"] (if type == subgraph, node.type == "output")

[scene_<id>.graph_<id>.node_<id>.inport_<id>]
    scene_<id>.graph_<id>.node_<id>.inport_<id>.value:
    scene_<id>.graph_<id>.node_<id>.inport_<id>.default_value:
    scene_<id>.graph_<id>.node_<id>.inport_<id>.type: ["node", "widget", "both", "none"]
    scene_<id>.graph_<id>.node_<id>.inport_<id>.lock: ["absent", "present", "unlocked", "override"]
    scene_<id>.graph_<id>.node_<id>.inport_<id>.<display>

[scene_<id>.graph_<id>.node_<id>.outport_<id>]
    scene_<id>.graph_<id>.node_<id>.outport_<id>.value:
    scene_<id>.graph_<id>.node_<id>.outport_<id>.<display>

---PORT-LOCKS-------------------------------------------------------------------
absent   - unlock port when data is absent
present  - unlock port when data is present
unlocked - port remains unlocked
override - unlock all ports when data is present

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
    select_nodes
    deselect_nodes
    delete_node
    select_edges
    deselect_edges
    delete_edge
    create_edge
    pick_walk
    translate
    rotate
    scale
    rename
    recolor

NodePanel
    select_node
    select_nodes
    walk_up
    walk_down
    set_value
    hover_value (css event)
    click_config
        set_default_value
        set_widget
        set_type
        set_lock

---WEB-COMPONENTS---------------------------------------------------------------
App
    |- SceneViewer
    |   |- Overlay (HUD with scene name, etc)
    |   |- ThreeJS
    |       |- Node (rectalinear prism)
    |       |       Color
    |       |       Name
    |       |- Edge (cylinder of dynamic length)
    |               Color
    |               Name
    |- SearchBox (a la VSCode's Search)
    |   |- CommandInput
    |   |- ResultBox { ag_grid }
    |- NodePanel { ag_grid }
        |- Item --> node --> function { row }
            |- Parameter --> inport --> function parameter { value cell, type cell }
                |- Widget
                    |- Config (sets widget, default_value, lock, color) { ag_grid }
                    |- Tooltip (doc strings)                         { hsy_vue_tooltip }
                    |- Textbox (option)                              { textarea }
                    |- Slider (option)                               { vue_slider_component }
                    |- RangeSlider (option)                          { vue_slider_component }
                    |- ColorPicker (option)                          { vue_color }
                    |- Dropdown (option)                             { vue_select }
                    |- MultiDropdown (option)                        { vue_select }
                    |- IntegerInput (option)                         { vue_number_input }
                    |- FloatInput (option)                           { vue_number_input }

DataTable
    Should be used for SearchBox, Config, NodePanel and NodePanel configuration.
    Inport order determines intra_node inport row order.
    Outport order determines intra_node outport row order.
    Node row groups are sorted by most recently selected then alphabetical by name.
    Graph row groups are sorted by most recently selected then alphabetical by name.
    Use immutable, chainable API.

---DSL--------------------------------------------------------------------------
Component   Query
-----------------------------
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

Field type is specified with <field>.<field_type>
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
dotsplit( scene, scene_<id>.graph_<id>.node_<id>.inport_<id> ) => {
    scene: scene_<id>,
    graph: graph_<id>,
    node: node_<id>,
    inport: inport_<id>
}

to_dict(scene, key) => {
    graph_<id>: {
        input_node: node_<id>,
        output_node: node_<id>,
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
    ( scene, graph_<id>    ) => scene_<id>.graph_<id>
    ( scene, edge_<id>     ) => scene_<id>.edge_<id>
    ( scene, node_<id>     ) => scene_<id>.graph_<id>.node_<id>
    ( scene, inport_<id>   ) => scene_<id>.graph_<id>.node_<id>.inport_<id>
    ( scene, outport_<id>  ) => scene_<id>.graph_<id>.node_<id>.outport_<id>

unresolve
    unresolve_to_id
        ( scene, scene_<id>.graph_<id>                        ) => graph_<id>
        ( scene, scene_<id>.edge_<id>                         ) => edge_<id>
        ( scene, scene_<id>.graph_<id>.node_<id>              ) => node_<id>
        ( scene, scene_<id>.graph_<id>.node_<id>.inport_<id>  ) => inport_<id>
        ( scene, scene_<id>.graph_<id>.node_<id>.outport_<id> ) => outport_<id>

    unresolve_to_name
        ( scene, scene_<id>                                   ) => scene_<id>.display.name
        ( scene, scene_<id>.graph_<id>                        ) => graph_<id>.display.name
        ( scene, scene_<id>.edge_<id>                         ) => edge_<id>.display.name
        ( scene, scene_<id>.graph_<id>.node_<id>              ) => node_<id>.display.name
        ( scene, scene_<id>.graph_<id>.node_<id>.inport_<id>  ) => inport_<id>.display.name
        ( scene, scene_<id>.graph_<id>.node_<id>.outport_<id> ) => outport_<id>.display.name

filter
    filter_by_value
        ( scene, value         ) => [ scene_<id>.graph_<id>.node_<id>.port_<id>...    ]

    filter_by_id
        ( scene, graph_<id>    ) => [ scene_<id>.graph_<id>...                        ]
        ( scene, edge_<id>     ) => [ scene_<id>.edge_<id>...                         ]
        ( scene, node_<id>     ) => [ scene_<id>.graph_<id>.node_<id>...              ]
        ( scene, inport_<id>   ) => [ scene_<id>.graph_<id>.node_<id>.inport_<id>...  ]
        ( scene, outport_<id>  ) => [ scene_<id>.graph_<id>.node_<id>.outport_<id>... ]

    filter_by_name
        ( scene, graph_name    ) => [ scene_<id>.graph_<id>...                        ]
        ( scene, node_name     ) => [ scene_<id>.graph_<id>.node_<id>...              ]
        ( scene, inport_name   ) => [ scene_<id>.graph_<id>.node_<id>.inport_<id>...  ]
        ( scene, outport_name  ) => [ scene_<id>.graph_<id>.node_<id>.outport_<id>... ]
        ( scene, module_name   ) => [ scene_<id>.graph_<id>.node_<id>...              ]
        ( scene, function_name ) => [ scene_<id>.graph_<id>.node_<id>...              ]
        ( scene, node_type     ) => [ scene_<id>.graph_<id>.node_<id>...              ]

    filter_by_component
        ( scene, "graph"       ) => [ scene_<id>.graph_<id>...                        ]
        ( scene, "edge"        ) => [ scene_<id>.edge_<id>...                         ]
        ( scene, "node"        ) => [ scene_<id>.graph_<id>.node_<id>...              ]
        ( scene, "inport"      ) => [ scene_<id>.graph_<id>.node_<id>.inport_<id>...  ]
        ( scene, "outport"     ) => [ scene_<id>.graph_<id>.node_<id>.outport_<id>... ]

---CACHE------------------------------------------------------------------------
luts
    graph_lut = { graph_<id>: scene_<id>.graph_<id> }
    graph_ilut = { <graph.name>: [graph_<id>] }

    node_lut = { node_<id>: scene_<id>.graph_<id>.node_<id> }
    node_ilut = { <node.name>: [node_<id>...] }

    edge_lut = { edge_<id>: scene_<id>.edge_<id> }
    edge_ilut = { inport_<id>: edge_<id> } (one edge per inport)

    inport_lut = {
        inport_<id>: scene_<id>.graph_<id>.node_<id>.inport_<id>
    }
    inport_ilut = {
        <inport.name>: [scene_<id>.graph_<id>.node_<id>.inport_<id>...]
    }

    outport_lut = {
        outport_<id>: scene_<id>.graph_<id>.node_<id>.outport_<id>
    }
    outport_ilut = {
        <outport.name>: [scene_<id>.graph_<id>.node_<id>.outport_<id>...]
    }

Scene DataFrame

---BROADER-FRAMEWORK------------------------------------------------------------
client
    |- client_config
    |- server_config
    |- scene
    |- properties panel
    |- search
    |- crud sgne
    |- undo cache
        |- scene
        |- client_config
        |- server_config

resource_server (crud) update versions elements
    |- code
    |- data
    |- client_config
    |- server_config
    |- scene [scene_id, scene_name and version]
    |- graph [graph_id, graph_name and version]
    |- nodes (from code)

    talks to S3

job_server
    |
    receive scene
    |
    parse scene _ graph cache
    |
    schedule jobs _ response cache
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
    |    |- resolve data resources @aspect
    |    |- compute data with input parameters
    |    |- write new data resource @aspect
    |    |- resolve output dict @aspect
    |    |- return dict
    |
    send status and dict to provisioner

event server

widgets
    |- text box
    |- slider _ ion.rangeSlider
    |- checkbox
    |- dropdown
    |- multi dropdown
