<div class="component">
    <h1>DropDown</h1>
</div>



<div class="definition">
    <div class="indent">Similar to ComboBox component but only allows 1 item to be selected</div>
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
    <div class="indent">Creat widget with value if it exists, else use default value</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">void</i>
    <p>
        <div class="indent">void</div>
    </p>

</div>







<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon method-icon"></div>


        <strong class="method">update_selection</strong>
        <span class="paren">(</span>




        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Update selection and display.options.values with item differs from
previous_item</div>
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


        <strong class="method">on_change</strong>
        <span class="paren">(</span>




        <span class="param-name">value</span>

        <span class="paren">:</span>
        <i class="param-value">any</i>





        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">void</i>

    </div>
    <div class="indent">Event handler for change events</div>
    <br>

    <strong>Parameters</strong>
    <br>
    <ul>

        <li>

            <strong>value</strong>


            <span class="paren">&nbsp:</span>
            <i class="return-value">any</i>

            <br>

            <span>Value of dropdown selection.</span>

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


        <strong class="method">filter</strong>
        <span class="paren">(</span>




        <span class="param-name">item</span>

        <span class="paren">:</span>
        <i class="param-value"></i>


<span class="paren">,</span>




        <span class="param-name">query</span>

        <span class="paren">:</span>
        <i class="param-value"></i>





        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">boolean</i>

    </div>
    <div class="indent">Determine whether query matchs item</div>
    <br>

    <strong>Parameters</strong>
    <br>
    <ul>

        <li>

            <strong>item</strong>


            <span class="paren">&nbsp:</span>
            <i class="return-value"></i>

            <br>

            <span>Item to query</span>

        </li>

        <li>

            <strong>query</strong>


            <span class="paren">&nbsp:</span>
            <i class="return-value"></i>

            <br>

            <span>Query string</span>

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

        <strong class="method">value</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Value of component</div>
    <br>

</div>



<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">default_value</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Default value of component</div>
    <br>

</div>



<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">display</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Display options of component</div>
    <br>

</div>





<div class="definition">
    <div class="definition-header">
    <div class="tsd-kind-icon property-icon"></div>

        <strong class="method">selection</strong>

        <span class="paren">:</span>

        <i class="return-value">void</i>

    </div>
    <div class="indent">Selected items</div>
    <br>

</div>




















<h2>Acessors</h2>

















<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">items</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">object[]</i>

    </div>
    <div class="indent">Returns Array of objects with value, text and color keys</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">object[]</i>
    <p>
        <div class="indent">object[]</div>
    </p>

</div>



<div class="definition">
    <div class="definition-header">

<div class="tsd-kind-icon accessor-icon"></div>
<span class="getter">get</span>


        <strong class="method">default_color</strong>
        <span class="paren">(</span>


        <span class="paren">)</span>

        <span class="paren">:</span>
        <i class="return-value">string</i>

    </div>
    <div class="indent">Returns the default color of the widget</div>
    <br>


    <strong>Returns&nbsp</strong><i class="return-value">string</i>
    <p>
        <div class="indent">string</div>
    </p>

</div>









































