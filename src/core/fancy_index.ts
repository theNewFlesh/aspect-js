import { DataFrame } from "data-forge";
import * as _ from "lodash";
import { conform_name } from "./tools";
// -----------------------------------------------------------------------------

/**
 * Interface for the header of a Table
 */
export interface IHeader {
    text: string;
    value: string;
    align: string; // "left", "center", "right"
    sortable: boolean;
    class: string[];
    width?: number;
    index: number;
}

/**
 * Interface for the row content of a Table
 */
export interface IIndexRow {
    columns: string[];
    group?: string;
    indent?: boolean;
    hide_headers?: boolean;
}
// -----------------------------------------------------------------------------

/**
 * A class for supplying a hierarchical index to Table components
 */
export class FancyIndex {
    /**
     * Constructs an internal DataFrame from given rows
     * @param data Array of IndexRows
     */
    public constructor(data: IIndexRow[]) {
        this.__data = new DataFrame( _.map(data, this._coerce) );
    }

    private __data: DataFrame;

    /**
     * Add default values to IndexRow
     * @param row IndexRow
     * @returns IndexRow with default values
     */
    public _coerce(row: IIndexRow): IIndexRow {
        if (row.group === undefined) {
            row.group = null;
        }
        if (row.indent === undefined) {
            row.indent = true;
        }
        if (row.hide_headers === undefined) {
            row.hide_headers = false;
        }

        return row;
    }

    /**
     * @returns Internal DayaFrame
     */
    public to_dataframe(): DataFrame {
        return this.__data;
    }

    /**
     * @returns Boolean indicating the visibility of outermost table's header
     */
    public get hide_headers(): boolean {
        return this.__data.getSeries("hide_headers").head(1).toArray()[0];
    }

    /**
     * @returns Boolean indicating the indentation of outermost table's header
     */
    public get indent(): boolean {
        return this.__data.getSeries("indent").head(1).toArray()[0];
    }

    /**
     * @returns Column which the outermost table will be grouped by
     */
    public get group_column(): string {
        return this.__data.at(0).group;
    }

    /**
     * Prints the internal DataFrame's content to the console
     */
    public print(): void {
        // tslint:disable-next-line:no-console
        console.log(this.__data.toString());
    }

    /**
     * @returns Array of Header objects which Vuetify VDataTable can accept
     */
    public to_headers(): IHeader[] {
        let cols = this.__data.at(0).columns;
        cols = _.filter(cols, (x) => (x !== "__index"));

        const headers = [];
        for (const i in cols) {
            const col = cols[i];
            headers.push({
                text: conform_name(col),
                value: col,
                align: "left",
                sortable: true,
                class: [col + "-column"],
                // width: "100%",
                index: i,
            });
        }
        return headers;
    }
}
