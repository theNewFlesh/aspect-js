import { DataFrame } from "data-forge";
import * as _ from "lodash";
import { conform_name } from "./tools";
// -----------------------------------------------------------------------------

export interface IHeader {
    text: string;
    value: string;
    align: string; // "left", "center", "right"
    sortable: boolean;
    class: string[];
    width?: number;
    index: number;
}

export interface IIndexRow {
    columns: string[];
    group?: string;
    indent?: boolean;
    hide_headers?: boolean;
}
// -----------------------------------------------------------------------------

export class FancyIndex {
    public constructor(data: IIndexRow[]) {
        this.__data = new DataFrame( _.map(data, this._coerce) );
    }

    private __data: DataFrame;

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

    public to_dataframe(): DataFrame {
        return this.__data;
    }

    public get hide_headers(): boolean {
        return this.__data.getSeries("hide_headers").head(1).toArray()[0];
    }

    public get indent(): boolean {
        return this.__data.getSeries("indent").head(1).toArray()[0];
    }

    public get group_column(): string {
        return this.__data.at(0).group;
    }

    public print(): void {
        // tslint:disable-next-line:no-console
        console.log(this.__data.toString());
    }

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
