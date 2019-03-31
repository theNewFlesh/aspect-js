<div class="component">
    <h1>Layout</h1>
</div>



<div class="definition">
    <div class="indent">The Layout component the DagPane and NodePane components</div>
</div>














































































<h2>Methods</h2>























<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">created</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Update DagPane shape</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">mounted</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Set DagPane and NodePane widths</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">__update_dag_pane_shape</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Set width of DagPane</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">_get_width</strong>
        <span class="paren">(</span>




        <span class="param-name">element</span>

        <span class="paren">:</span>
        <i class="param-value">any</i>





        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">number</i>

    </div>
    <div class="indent">Get width of given DOM element</div>
    <br>

    <strong>Parameters</strong>
    <br>
    <ul>

        <li>

            <strong>element</strong>


            <span class="paren">&nbsp:</span>
            <i class="return-value">any</i>

            <br>

            <span>DOM element</span>

        </li>

    </ul>


    <strong>Returns&nbsp</strong><i class="return-value">number</i>
    <p>
        <div class="indent">number</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">_set_width</strong>
        <span class="paren">(</span>




        <span class="param-name">element</span>

        <span class="paren">:</span>
        <i class="param-value">any</i>


<span class="paren">,</span>




        <span class="param-name">width</span>

        <span class="paren">:</span>
        <i class="param-value">number</i>





        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Sets width of given element to given width</div>
    <br>

    <strong>Parameters</strong>
    <br>
    <ul>

        <li>

            <strong>element</strong>


            <span class="paren">&nbsp:</span>
            <i class="return-value">any</i>

            <br>

            <span>DOM element</span>

        </li>

        <li>

            <strong>width</strong>


            <span class="paren">&nbsp:</span>
            <i class="return-value">number</i>

            <br>

            <span>Width in vw (percentage) units</span>

        </li>

    </ul>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">_on_resize_start</strong>
        <span class="paren">(</span>




        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Event handler for when user begins dragging pane divider.
Sets _prev_dag_width to DOM element width</div>
    <br>

    <strong>Parameters</strong>
    <br>
    <ul>

    </ul>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">_on_resize</strong>
        <span class="paren">(</span>




        <span class="param-name">element</span>

        <span class="paren">:</span>
        <i class="param-value">any</i>





        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Event handler for when the user continues dragging the pane divider.
Updates the DagPane and NodePane width.</div>
    <br>

    <strong>Parameters</strong>
    <br>
    <ul>

        <li>

            <strong>element</strong>


            <span class="paren">&nbsp:</span>
            <i class="return-value">any</i>

            <br>

            <span>Ignored DOM element</span>

        </li>

    </ul>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">_on_resize_stop</strong>
        <span class="paren">(</span>




        <span class="param-name"></span>

        <span class="paren">:</span>
        <i class="param-value"></i>





        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Event handler for when the user stops dragging the pane divider.
Collapses the NodePane if it is beneath threshold</div>
    <br>

    <strong>Parameters</strong>
    <br>
    <ul>

        <li>

            <strong></strong>


            <span class="paren">&nbsp:</span>
            <i class="return-value"></i>

            <br>

            <span></span>

        </li>

    </ul>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>




<h2>Properties</h2>









<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">params</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Scene definition</div>
    <br>

</div>





<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">_prev_dag_width</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Previous width of the DagPane</div>
    <br>

</div>



<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">__dag_pane_width</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Current width of the DagPane</div>
    <br>

</div>



<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">__dag_pane_height</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Current height of the DagPane</div>
    <br>

</div>



<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">dag_width</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Percentage of window width of the DagPane</div>
    <br>

</div>



<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">collapse_width</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Percentage of window Width at which NodePane will collapse</div>
    <br>

</div>




















<h2>Acessors</h2>





<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">_data</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">any</i>

    </div>
    <div class="indent">Data for NodePane table</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">any</i>
    <p>
        <div class="indent">any</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">_index</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">object</i>

    </div>
    <div class="indent">Index for NodePane table</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">object</i>
    <p>
        <div class="indent">object</div>
    </p>

</div>





































































