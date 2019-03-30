<div class="component">
    <h1>Table</h1>
</div>





<div class="definition">
    <div class="indent">The Table class recursively wraps the contents of a tabular data
structure with a hierarchical index with v-data-tables</div>
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
    <div class="indent">Create Index and Scaffold data structures</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">print</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Print content of index and data to console</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>















<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">in_groups</strong>
        <span class="paren">(</span>




        <span class="param-name"></span>

        <span class="paren">:</span>
        <i class="param-value"></i>





        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">boolean</i>

    </div>
    <div class="indent">Determines if given key is in groups</div>
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


    <strong>Returns&nbsp</strong><i class="return-value">boolean</i>
    <p>
        <div class="indent">boolean</div>
    </p>

</div>




<h2>Properties</h2>







<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">_data</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Internal tabular data structure</div>
    <br>

</div>



<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">_index</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Index to internal tabular data structure</div>
    <br>

</div>


























<h2>Acessors</h2>



















<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">headers</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">IHeader[]</i>

    </div>
    <div class="indent">Headers to be passed to a v-data-table</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">IHeader[]</i>
    <p>
        <div class="indent">IHeader[]</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">rows</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Data rows as grouped by the first header</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">hide_headers</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">boolean</i>

    </div>
    <div class="indent">Whether to display headers of each table</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">boolean</i>
    <p>
        <div class="indent">boolean</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">indent</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">boolean</i>

    </div>
    <div class="indent">Whether each successive table is indented</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">boolean</i>
    <p>
        <div class="indent">boolean</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">group_column</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">string</i>

    </div>
    <div class="indent">Column upon which the outmost table is grouped</div>
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


        <strong class="method">groups</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Returns a lut with the group_column values as its keys</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>



































