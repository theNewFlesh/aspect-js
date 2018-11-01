import * as _ from "lodash";
import { DataFrame, Index } from "data-forge";

export default class FancyFrame {
    public constructor(data?: any) {
        if (data !== undefined) {
            this.__data = data;
        }
    }

    private __data: DataFrame;

    public from_array(arr: object[]): FancyFrame {
        const data: DataFrame = new DataFrame(arr);
        return new FancyFrame(data);
    }

    public from_dataframe(data: DataFrame): FancyFrame {
        return new FancyFrame(data);
    }

    public to_dataframe(): DataFrame {
        return this.__data;
    }

    public print() {
        console.log(this.__data.toString());
    }

    // public loc(index: number[], columns: string[]): any {
    //     this.__data.getSeries(columns)
    // }

    public transpose(): FancyFrame {
        function _to_row(column: any) {
            const output = column.series.toArray();
            output.splice(0, 0, column.name);
            return output;
        }

        // transpose
        let data: any = this.__data.getColumns().select(_to_row);
        data = new DataFrame(data);
        const first: string = data.getIndex().head(1).toArray()[0].toString();
        data = data.setIndex(first).dropSeries(first);

        // check to see if all original columns were numbers
        let cols: any = this.__data.getColumnNames();
        cols = _.map(cols, x => Number(x).toString());
        const numcols = _.filter(
            cols, x => x !== "NaN"
        );

        // rename columns
        if (numcols.length != 0 && numcols.length == cols.length) {
            const orig = this.__data.getIndex().toArray();
            const trans = data.getColumnNames();
            const renamer: object = _.zipObject(trans, orig);
            data = data.renameSeries(renamer);
        }

        return new FancyFrame(data);
    }

    public apply(predicate, axis: number = 0): FancyFrame {
        // the predicate receives a Series object equivalent to a column
        if (axis === 1) {
            const data: any = this.transpose()
                .to_dataframe()
                .select(predicate)
            return new FancyFrame(data).transpose();
        }

        const data: any = this.__data.select(predicate);
        return new FancyFrame(data);
    }

    public applymap(predicate): FancyFrame {
        const data: any = this.__data.select(
            x => _.map(_.values(x), predicate)
        );
        return new FancyFrame(data);
    }

    public coerce(from: any[] = [null, undefined], to: any = NaN): FancyFrame {
        function _coerce(item) {
            if (from.includes(item)) {
                return to;
            }
            return item;
        }
        return this.applymap(_coerce);
    }

    public to_lut(column: string): object {
        const group = this.__data.groupBy(x => x[column]).toArray();
        const output = {};
        for (const df of group) {
            const key = df.getSeries(column).head(1).toArray()[0];

            // sort dataframe
            const data = df.orderBy(x => x[column]);
            output[key] = data.toArray();
        }
        return output;
    }
}
