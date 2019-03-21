<div class="component">
    <h1>Cell</h1>
</div>



<div class="definition">
    <div class="indent">A cell is a single element of a row of a Table. A cell contains a single
widget and has an API for getting widget values, default values and type.</div>
</div>


















































<h2>Methods</h2>























<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">on_node_pane_widget_value_update</strong>
        <span class="paren">(</span>




        <span class="param-name"></span>

        <span class="paren">:</span>
        <i class="param-value"></i>





        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Available widget types</div>
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

        <strong class="method">row</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Cell of table that contains cell</div>
    <br>

</div>



<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">column</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Column of table that contains cell</div>
    <br>

</div>




















<h2>Acessors</h2>









<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">value</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">any</i>

    </div>
    <div class="indent">Return value of row at column</div>
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


        <strong class="method">default_value</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">any</i>

    </div>
    <div class="indent">Return default value of cell</div>
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


        <strong class="method">display</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">object</i>

    </div>
    <div class="indent">Returns display options for cell widget</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">object</i>
    <p>
        <div class="indent">object</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">widget</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">string</i>

    </div>
    <div class="indent">Returns the cell's widget class</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">string</i>
    <p>
        <div class="indent">string</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">lock</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">string</i>

    </div>
    <div class="indent">Returns the value of the cell's lock property. Locks are related to
dataflow.</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">string</i>
    <p>
        <div class="indent">string</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">widget_type</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">string</i>

    </div>
    <div class="indent">Returns the cell's widget type</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">string</i>
    <p>
        <div class="indent">string</div>
    </p>

</div>





























