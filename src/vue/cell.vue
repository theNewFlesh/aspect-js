<template>
  <v-flex v-if="widget_type === 'slider'" class="widget-container pad-4">
    <Slider
      class="widget"
      :value="value"
      :default_value="default_value"
      :display="display"
      v-on:node_pane-widget-value-update="on_node_pane_widget_value_update"
    />
  </v-flex>
  <v-flex v-else-if="widget_type === 'spinbox'" class="widget-container pad-2">
    <SpinBox
      class="widget"
      :value="value"
      :default_value="default_value"
      :display="display"
      v-on:node_pane-widget-value-update="on_node_pane_widget_value_update"
    />
  </v-flex>
  <v-flex v-else-if="widget_type === 'combobox'" class="widget-container">
    <ComboBox
      class="widget"
      :value="value"
      :default_value="default_value"
      :display="display"
      v-on:node_pane-widget-value-update="on_node_pane_widget_value_update"
    />
  </v-flex>
  <v-flex v-else-if="widget_type === 'dropdown'" class="widget-container pad-l">
    <DropDown
      class="widget"
      :value="value"
      :default_value="default_value"
      :display="display"
      v-on:node_pane-widget-value-update="on_node_pane_widget_value_update"
    />
  </v-flex>
  <v-flex v-else-if="widget_type === 'textarea'" class="widget-container pad-l">
    <TextArea
      class="widget"
      :value="value"
      :default_value="default_value"
      :display="display"
      v-on:node_pane-widget-value-update="on_node_pane_widget_value_update"
    />
  </v-flex>
  <v-flex v-else-if="widget_type === 'widget'" class="widget-container widget">
    <DropDown
      class="widget pad-l"
      :value="widget"
      :default_value="widget"
      :display="widget_options"
      v-on:node_pane-widget-value-update="on_node_pane_widget_value_update"
    />
  </v-flex>
  <v-flex v-else-if="widget_type === 'lock'" class="widget-container lock">
    <DropDown
      class="widget pad-l"
      :value="lock"
      default_value="present"
      :display="lock_options"
      v-on:node_pane-widget-value-update="on_node_pane_widget_value_update"
    />
  </v-flex>
  <v-flex v-else-if="widget_type === 'display'" class="widget-container display">
    <TextArea
      class="widget"
      :value="JSON.stringify(display)"
      :default_value="default_value"
      v-on:node_pane-widget-value-update="on_node_pane_widget_value_update"
    />
  </v-flex>
  <v-flex v-else-if="widget_type === 'inert'" class="widget-container pad-l inert">{{ value }}</v-flex>
</template>

<script lang="ts">
import { EventBus } from "./event_bus";
import { ISubEvent, IEvent } from "./event_manager";
import { Component, Prop, Vue } from "vue-property-decorator";
import Slider from "./slider.vue";
import SpinBox from "./spinbox.vue";
import ComboBox from "./combobox.vue";
import DropDown from "./dropdown.vue";
import TextArea from "./textarea.vue";

/**
 * A cell is a single element of a row of a Table. A cell contains a single
 * widget and has an API for getting widget values, default values and type.
 */
@Component({ components: { Slider, SpinBox, ComboBox, DropDown, TextArea } })
export default class Cell extends Vue {
  /**
   * Cell of table that contains cell
   */
  @Prop()
  public row: any;

  /**
   * Column of table that contains cell
   */
  @Prop()
  public column: string;

  /**
   * Return value of row at column
   */
  public get value(): any {
    return this.row[this.column];
  }

  /**
   * Return default value of cell
   */
  public get default_value(): any {
    return this.row.default_value;
  }

  /**
   * Returns display options for cell widget
   */
  public get display(): object {
    return this.row.display;
  }

  /**
   * Returns the cell's widget class
   */
  public get widget(): string {
    return this.row.widget;
  }

  /**
   * Returns the value of the cell's lock property. Locks are related to
   * dataflow.
   */
  public get lock(): string {
    return this.row.lock;
  }

  /**
   * Returns the cell's widget type
   */
  public get widget_type(): string {
    if (this.column === "value") {
      return this.row.widget;
    }
    if (this.column === "default_value") {
      return this.row.widget;
    }
    if (this.column === "display") {
      return "display";
    }
    if (this.column === "widget") {
      return "widget";
    }
    if (this.column === "lock") {
      return "lock";
    }
    return "inert";
  }

  /**
   * Options for locks
   */
  public lock_options: object = {
    options: {
      values: ["absent", "present", "unlocked", "override"]
    }
  };

  /**
   * Available widget types
   */
  public widget_options: object = {
    options: {
      values: ["combobox", "dropdown", "slider", "spinbox", "textarea", "inert"]
    }
  };

  public on_node_pane_widget_value_update(event: ISubEvent): void {
    const name: string = "node_pane-cell-inport-update";
    const event_: IEvent = {
      name: name,
      value: event.value,
      row: this.row,
      column: this.column
    };
    EventBus.$emit(name, event);
  }
}
</script>

<style lang="stylus">
@import '../static/css/config.styl';

.widget-container.pad-2, th {
  padding: 2px 6px 2px 6px;
}

.widget-container.pad-4 {
  padding: 4px 6px 4px 6px;
}

.widget-container.pad-l {
  padding: 0px 0px 0px 6px;
}

#cell.name-cell {
  padding-right: 6px;
}

.value-cell, .default_value-cell {
  min-width: 150px;
}

.widget-cell {
  max-width: 90px;
  padding: 0px 0px 0px 6px;
}

.lock-cell {
  max-width: 90px;
  padding: 0px 0px 0px 6px;
}

.display-cell {
  max-width: 250px;
  padding: 0px 0px 0px 6px;
}
</style>
